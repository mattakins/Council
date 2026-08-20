---
name: council
description: Multi-agent decision framework. Use when the user asks for council, parallel advisors, multi-perspective analysis, or decisions with tradeoffs.
license: MIT
compatibility: Requires an agent client with parallel subagent support.
---

# Council - Multi-Agent Decision Framework

Convene a council of expert agents to analyze a decision from multiple perspectives, then synthesize their opinions into a clear recommendation.

## Usage

```
Claude Code:
  /council <question or decision>

Codex:
  $council <question or decision>

Options:
  3 agents, <question>               # Use 3 advisors instead of default 5
  research, <question>               # Explicitly enable current research
  no research, <question>            # Use reasoning and supplied context only
  from SEO, legal, and UX, <question> # Specify perspectives
  no chairman, <question>            # Skip the Chairman synthesis step
  quick, <question>                  # Alias for "no chairman"
  deep, <question>                   # Research + 7 advisors + Chairman
  save, <question>                   # Write output to council-YYYY-MM-DD-<slug>.md
  opus, <question>                   # Force Opus model for all agents (Claude Code only)
  sonnet, <question>                 # Force Sonnet model for all agents (Claude Code only)
```

Options accept natural language and can be combined in any order. Examples:

- Claude Code: `/council use 4 advisors, research this, and skip the chairman: <question>`
- Codex: `$council Give me 3 perspectives and save the result: <question>`
- Other tools: `Use the council skill with 7 advisors and no research: <question>`

## Instructions

When this skill is invoked:

### 1. Parse the input

Interpret options from both terse keywords and natural language. Users do not need exact syntax or ordering.

Recognize:

- **Advisor count:** `3`, `3 agents`, `use four advisors`, `give me seven perspectives` (default: 5)
- **Research enabled:** `research`, `look this up`, `browse`, `use current information`
- **Research disabled:** `no research`, `reasoning only`, `do not browse`, `use supplied context only`
- **Chairman disabled:** `no chairman`, `skip synthesis`, `quick`, `just the council`, `raw`
- **Chairman enabled:** `include chairman`, `synthesize the results`
- **Deep mode:** `deep`, `full treatment`, `thorough analysis` (defaults to research + 7 advisors + Chairman)
- **Save output:** `save`, `write this to a file`, `keep a markdown copy`
- **Perspectives:** quoted lists or natural language such as `from legal, UX, and engineering perspectives`
- **Model override:** In Claude Code, recognize explicit `opus` or `sonnet` requests. In Codex or other tools, inherit the current model unless the user explicitly requests a supported override.
- **Images:** If the user included screenshots, designs, mockups, or other images, include the actual images in advisor prompts.

Explicit user instructions override presets and automatic detection. For example, `deep, 4 agents` uses four advisors, and `deep, no research` disables research. Remove recognized options from the request, then treat the remaining text as the core question or decision. If wording is ambiguous, use the most reasonable interpretation instead of requiring exact flag syntax.

If research was not explicitly enabled or disabled, auto-detect whether it is needed using section 1a.

### 1a. Research auto-detection

Do NOT require an explicit `research` flag. Infer from the question whether agents should research before answering.

**Auto-enable research if the question involves:**
- Market conditions, competitive landscape, pricing, adoption rates
- Specific companies, products, tools, or technologies by name
- Current events, trends, or recent developments
- Phrases like "right now", "these days", "in 2026", "latest", "recently", "today"
- Commercial viability, go-to-market, fundraising, or investment
- Anything where a factual, up-to-date answer is better than reasoning alone

When research is auto-enabled, print: `📡 Research mode auto-enabled.` before the council results.

If the question is clearly conceptual or internal (architecture choices, code design, naming, etc.), skip research.

### 2. Generate perspectives

If perspectives not specified, auto-generate relevant ones based on the question domain:

**Business/Marketing decisions:** SEO, branding, hiring manager, industry trends, copywriting, customer psychology, competitive analysis, legal/compliance

**Tech architecture decisions:** performance, security, maintainability, developer experience, scalability, cost, simplicity

**Product decisions:** user experience, business value, technical feasibility, market fit, growth potential

Choose the most relevant perspectives for the specific question. Aim for diverse viewpoints that might surface disagreements.

### 3. Launch agents in parallel

Use your sub-agent feature to spawn advisors independently.

- Claude Code: use Claude Code's Agent/subagent mechanism.
- Codex: use Codex subagents with `default` agents unless a better built-in type is available.
- Other Agent Skills-compatible tools: use the closest available sub-agent feature.

Rules:
- Spawn every advisor with fresh, isolated context. Do not inherit or forward the parent conversation.
- Give each advisor only its assigned perspective, the core question, and any attached images or raw data needed to answer it.
- Advisors must be blind to each other's opinions.
- Run advisors in parallel.
- If the requested advisor count exceeds your concurrency limit, run advisors in batches while preserving independence.
- Inherit the current model and reasoning settings by default.
- Do not set a model override unless the user explicitly requested one and you support it.
- If images are detected, include all images in every advisor prompt. Do not describe the images in text; let advisors inspect the visuals directly.

**Agent prompt template:**
```
You are advising on a decision from the perspective of [PERSPECTIVE].

Question: [THE QUESTION]

[IF IMAGES: Include images here]

Consider this from your specific angle. [IF RESEARCH: Research current data, trends, and facts before answering.]

Provide:
1. Your top recommendation (be specific)
2. Your confidence level:
   - High = strong conviction backed by clear evidence or logic
   - Medium = directional belief but meaningful uncertainty
   - Low = gut read, limited evidence
3. Brief reasoning (2-3 sentences max)
4. Strongest objection: What is the single best argument AGAINST your own recommendation? One sentence.
```

### 3.5. The Chairman (optional)

**Skip this step if Chairman is disabled.** Otherwise, after all council agents complete, spawn the Chairman.

**Critical:** Spawn the Chairman as a fresh, isolated sub-agent. It should receive only the question and council outputs, not the full session history.

**Chairman prompt (pass this as the full prompt — no other context):**
```
You are the Chairman, synthesizing recommendations from a council of expert advisors.

Question: [THE QUESTION]

Council responses:
[PASTE ALL AGENT OUTPUTS HERE]

Analyze these perspectives and provide:
1. **Verdict:** What should be done? (Be specific and definitive)
2. **Consensus:** Where do the advisors agree?
3. **Key tension:** The most important disagreement and how to resolve it
4. **Risk:** What could go wrong with your recommendation?

Be definitive. This is the final recommendation. Under 200 words.
```

Display the Chairman's output under the heading "**Chairman's Verdict:**" before proceeding to step 4.

### 4. Synthesize results

Compile agent responses into this format:

**Results table:**
```
| Agent | Perspective | Recommendation | Confidence |
|-------|-------------|----------------|------------|
| 1 | [perspective] | ✅ Option A | High |
| 2 | [perspective] | ✅ Option A | Medium |
| 3 | [perspective] | ⚠️ Option B (dissent) | High |
| 4 | ... | ... | ... |
```

- ✅ = matches the consensus/winning recommendation
- ⚠️ = dissent (strongly disagrees with majority)

**Consensus section:**
- What points do agents agree on?
- Where do they diverge?

**Dissent section (if applicable):**
> ⚠️ **Dissent:** Agent X strongly disagrees because [reason]. Consider [their concern] before proceeding.

**Conditional recommendations (if relevant):**
- "If targeting X, then Y"
- "If priority is Z, then W"

**Risk callout (if relevant):**
- What could go wrong with the top pick?

**Verdict (neutral):**
State what the council recommends based on the weight of evidence.

### 5. My Take (required)

This section is MANDATORY — always include it as the final section, clearly labeled.

Give your own synthesized, opinionated recommendation — distinct from the Chairman's neutral verdict. Draw on the council outputs, any conversation context available, and anything the agents may not have had visibility into. If this is the first message in the session, base it purely on the council outputs.

**Format:**
> **My Take:** [Your direct recommendation. 2-4 sentences. Be opinionated.]

If your take differs from the Chairman's verdict, explicitly flag it:
> ⚡ **Differs from Chairman:** [One sentence on why]

**Next step:**
One clear action to move forward.

### 6. Save output (if `save` flag set)

Write the complete output — Chairman's Verdict, results table, consensus, and My Take — to a file named `council-YYYY-MM-DD-<slug>.md` in the current working directory. The slug is a 2-4 word kebab-case summary of the question.

### 7. Input Quality Rules

**Visual decisions:** If the decision involves visual assets (designs, images, UI, layouts), always include actual images via vision in agent prompts. Text descriptions mislead.

**Data-driven decisions:** If relevant data exists, provide raw data (CSV, full dataset) — let agents aggregate themselves. Don't pre-summarize.

**Independence:** Do NOT lead with opinions or prior analysis in agent prompts. Let each agent form independent views. Bias in the prompt defeats the purpose of multiple perspectives.

### 8. Keep it tight

- Total output should be scannable
- Use tables and bullets
- No fluff or preamble
- Get to the recommendations fast
