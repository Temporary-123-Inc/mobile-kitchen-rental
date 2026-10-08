# Temporary 123 Skills

Agent skills and standards for Temporary 123 work, including rebuilding the rental-services sites (mobile kitchens, refrigeration, shower/laundry, remote man camps).

## Using this as a template

This repo is a base for rebuilding a site. Create a new repo from it and keep `.agents/`, `.claude/`, `AGENTS.md`, `CLAUDE.md`, and `docs/agents/`. Build the site however you like, as long as it follows the [site rebuild standards](#site-rebuild-standards).

The new repo tracks issues in its own GitHub Issues. Create the triage labels there first (see `docs/agents/triage-labels.md`).

## Layout

| Path | Purpose |
| --- | --- |
| `.agents/skills/` | The skills. Each has a `SKILL.md`. |
| `.claude/skills/` | Symlinks to `.agents/skills/` so Claude Code finds them. |
| `AGENTS.md` | Short pointers for agents (Codex, Cursor, Amp, and others). |
| `docs/agents/` | Issue tracker, triage label, and domain doc config for the engineering skills. |
| `CLAUDE.md` | Imports `AGENTS.md` for Claude Code. |
| `skills-lock.json` | Version lock for the third-party skills. |

## Site rebuild standards

`.agents/skills/site-rebuild-standards/` holds the team standards for rebuilding a site:

- [SKILL.md](.agents/skills/site-rebuild-standards/SKILL.md): H1 and opening paragraph rules, DA thresholds, service families, and samples.
- [KEYWORDS.md](.agents/skills/site-rebuild-standards/KEYWORDS.md): the Super 9 keyword categories.
- [PAGE-DATA.md](.agents/skills/site-rebuild-standards/PAGE-DATA.md): per-page pricing, delivery, hours, setup time, local content, and the 250-page site build.

The standards are stack-neutral: use any framework or folder structure, and verify the rendered page against the checklist at the end of `SKILL.md`.

Open items: the base price is not yet set, and the heat-wave sample figures need verifying before they go on a live page.

## Third-party skills

The other skills in `.agents/skills/` are installed from outside sources and tracked in `skills-lock.json`. Edit the site rebuild standards freely; leave the third-party skills to their upstream source.

## Adding a skill

1. Create `.agents/skills/<name>/SKILL.md` with `name` and `description` frontmatter.
2. Symlink it: `ln -s ../../.agents/skills/<name> .claude/skills/<name>`.
3. Add a pointer line to `AGENTS.md` if agents must reach it without loading skills.

Follow the `writing-for-agents` skill when writing any of these documents.
