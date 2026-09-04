# Council

A multi-agent decision framework skill for Codex, Claude Code, OpenCode, Cursor, ChatGPT Work, or any other harness that supports subagents.

*Council* spawns parallel isolated expert advisor subagents with diverse perspectives, synthesizes their views through a neutral Chairman, and delivers an opinionated final take.

Use it for architectural calls, product and marketing decisions, naming debates — any decision worth more than one perspective.

Inspired by [Karpathy's LLM Council](https://github.com/karpathy/llm-council).

```text
Claude: /council:council should we rewrite this service in Rust?
Codex:  $council:council deep what's the commercial viability of this app right now?
```

---

## Install

### Claude Code plugin

```text
/plugin marketplace add mattakins/council
/plugin install council@mattakins
```

Plugin skills are namespaced. Invoke this skill as `/council:council <question>`.

### Codex plugin

```bash
codex plugin marketplace add mattakins/council
codex plugin add council@mattakins
```

Invoke the plugin skill as `$council:council <question>`.

### Universal Agent Skills install

```bash
npx skills add mattakins/council -g
```

The Skills CLI installs the shared `SKILL.md` into the paths expected by the agents you select.

### Standalone install

Clone or copy `plugins/council/skills/council` into one of these supported locations:

- Claude Code: `~/.claude/skills/council/`
- Codex: `~/.agents/skills/council/`
- OpenCode: `~/.agents/skills/council/` or `~/.config/opencode/skills/council/`

---

## Usage

| Command | What it does |
|---------|--------------|
| `<council> <question>` | Default: 5 agents + Chairman |
| `<council> 3 <question>` | Use 3 agents |
| `<council> 7 <question>` | Use 7 agents |
| `<council> deep <question>` | Research + 7 agents + Chairman (full treatment) |
| `<council> research <question>` | Explicitly enable research |
| `<council> no research <question>` | Skip research, reasoning only |
| `<council> "SEO, legal, UX" <question>` | Specify perspectives explicitly |
| `<council> quick <question>` | Skip Chairman, faster output |
| `<council> no chairman <question>` | Same as quick |
| `<council> save <question>` | Write output to `council-YYYY-MM-DD-<slug>.md` |
| `<council> opus <question>` | Run all advisors on Opus (any named model works if your harness supports per-subagent overrides) |
| `<council> sonnet <question>` | Run all advisors on Sonnet |

Replace `<council>` with `/council:council` for the Claude plugin or `$council:council` for the Codex plugin. Flags combine, and options also work as plain language — e.g. `use 4 advisors, no research, and save: <question>`.

---

## How it works

1. **Parse** — extracts agent count, perspectives, flags, and auto-detects if research is needed
2. **Research detection** — if the question involves markets, companies, current events, or real-world data, agents are automatically told to research before answering. No flag needed.
3. **Parallel agents** — all advisors run simultaneously, blind to each other, each from their assigned perspective
4. **Chairman synthesis** — a fresh, isolated subagent synthesizes the council into a definitive verdict (skippable with `quick`)
5. **My Take** — the final section: an opinionated recommendation drawing on both the council outputs and full conversation context

---

## Output structure

```
Chairman's Verdict:
[Definitive synthesis]

| Agent | Perspective | Recommendation | Confidence |
| ...   | ...         | ...            | ...        |

Consensus: ...
Dissent (if any): ...
Risks: ...
Verdict: ...

My Take: ...        ← always present, always opinionated
Next step: ...
```

## Compatibility

| Tool | Works? | Install path |
|------|--------|--------------|
| Claude Code | ✅ | Plugin or `~/.claude/skills/council/` |
| OpenAI Codex | ✅ | Plugin or `~/.agents/skills/council/` |
| OpenCode | ✅ | `~/.agents/skills/council/` or native OpenCode path |
| Cursor | ✅ | Agent Skills install (`npx skills add`) |
| Other harnesses | Conditional | Requires parallel subagent support |

The instruction format follows the open Agent Skills specification. Full behavior requires a harness that can launch parallel, isolated subagents.

---

## License

MIT
