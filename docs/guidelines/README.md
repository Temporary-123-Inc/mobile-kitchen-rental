# Shared Temporary123 guidelines

The owner adopted `Temporary-123-Inc/skills.temporary123` as this project's shared guidelines and criteria on October 7, 2026. The complete tracked repository contents are copied into [skills.temporary123/](skills.temporary123/README.md), including hidden directories, reference documents, scripts, the skill lockfile, source agent instructions and Claude symlinks.

Source commit: `c6fbaef5a0f0b8eb316559d4222438a988e221c2`, verified against GitHub HEAD before import. All 460 entries match the source Git blob and mode; all 48 symlinks resolve inside the snapshot. Provenance and per-file verification are recorded in [skills.temporary123.provenance.json](skills.temporary123.provenance.json). The source checkout and this project's existing root instructions are preserved; `.git` history/configuration is excluded from the content copy.

## Where to start

| Work | Reference |
| --- | --- |
| Rebuilds, headings, opening paragraphs and rendered-page acceptance | [Site rebuild standards](skills.temporary123/.agents/skills/site-rebuild-standards/SKILL.md) |
| Keyword selection | [Super 9 categories](skills.temporary123/.agents/skills/site-rebuild-standards/KEYWORDS.md) |
| Location facts, pricing, delivery, setup and local content | [Page data criteria](skills.temporary123/.agents/skills/site-rebuild-standards/PAGE-DATA.md) |
| Agent/skill documentation | [Writing for agents](skills.temporary123/.agents/skills/writing-for-agents/SKILL.md) |
| All 48 skills and upstream template conventions | [Upstream README](skills.temporary123/README.md) and [.agents/skills/](skills.temporary123/.agents/skills/) |
| Engineering issue/domain conventions | [Copied agent instructions](skills.temporary123/AGENTS.md) and [domain reference](skills.temporary123/docs/agents/domain.md) |

## Applying the criteria here

Use **kitchen trailer rentals only**, as the owner explicitly requested. The shared library serves several websites; its mixed service examples do not expand this site's scope. Use current approved business facts for actual pricing, delivery, availability, GPS and setup claims. Upstream sample numbers and unfinished base-price fields are reference material, not verified facts about this site.

Keep this project's root `AGENTS.md`, status, requirements, page assignments and decisions as the coordination entry points. The root instructions link the mandatory site standards and relevant skill references. A path inside a copied document referring to its template repository resolves under `docs/guidelines/skills.temporary123/`; project source/configuration paths refer to this project.

This import establishes guidance for subsequent work. It does not alter website content/design, protected routes, indexing selection or pricing, execute bundled tools, install hooks, create GitHub issues/labels/workflows or publish a release. Apply a workflow skill when the task calls for it, with the existing task authorization and project scope.

## Updating the snapshot

Check the upstream revision and current local changes, reserve the guideline folder in `docs/PAGE_ASSIGNMENTS.md`, then import the intended commit into a fresh temporary directory. Compare the files, links and source changes before replacing this snapshot. Update the provenance manifest and record verification/status. Preserve upstream files byte-for-byte; keep project-specific interpretations in this README and the root instructions.

## Applied kitchen-site criteria

See [the implementation and acceptance record](../KITCHEN_GUIDELINE_ADOPTION_2026-10-07.md) and [before/after URL mapping](kitchen-page-mapping-2026-10-07.csv). Run `pnpm test`, then `pnpm build` and `pnpm check:standards` for subsequent content work. The output check validates the site-specific kitchen criteria; unverified business facts and broader release gates remain separate.
