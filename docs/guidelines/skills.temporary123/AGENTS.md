# Temporary 123 skills

Agent skills for Temporary 123 work live in `.agents/skills/`; `.claude/skills/` symlinks to them.

- Rebuilding a site, or writing a location page, H1, opening paragraph, page pricing/setup data, or keywords: read `.agents/skills/site-rebuild-standards/SKILL.md` first. Its standards are mandatory.
- Adding or editing a skill, AGENTS.md, or CLAUDE.md: use the `writing-for-agents` skill. Add a symlink in `.claude/skills/` for each new skill.

## Agent skills

### Issue tracker

Issues live in GitHub Issues for whichever repo you're working in (`gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context. See `docs/agents/domain.md`.
