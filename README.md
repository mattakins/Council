# Council

A multi-agent decision framework for Claude Code and Codex. Spawns parallel expert advisors from diverse perspectives, synthesizes their views through a neutral Chairman, and delivers an opinionated final take — all in one command.

Inspired by [Andrej Karpathy's LLM Council](https://github.com/karpathy/llm-council), adapted for the native subagents in Claude Code and Codex.

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
| `<council> "SEO, legal, UX" <question>` | Specify perspectives explicitly |
| `<council> quick <question>` | Skip Chairman, faster output |
| `<council> no chairman <question>` | Same as quick |
| `<council> save <question>` | Write output to `council-YYYY-MM-DD-<slug>.md` |
| `<council> opus <question>` | Force Opus for Claude Code agents |
| `<council> sonnet <question>` | Force Sonnet for Claude Code agents |

Replace `<council>` with `/council:council` for the Claude plugin or `$council:council` for the Codex plugin. Flags combine.

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
📡 Research mode auto-enabled.   ← when auto-triggered

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
| Other Agent Skills clients | Conditional | Requires parallel subagent support |

The instruction format follows the open Agent Skills specification. Full behavior requires a client that can launch parallel, isolated subagents.

---

## License

MIT
