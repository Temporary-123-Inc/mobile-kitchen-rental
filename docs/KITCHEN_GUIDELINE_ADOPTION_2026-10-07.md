# Kitchen-site guideline adoption — October 7, 2026

Applied the owner-adopted [site rebuild standards](guidelines/skills.temporary123/.agents/skills/site-rebuild-standards/SKILL.md), [keyword reference](guidelines/skills.temporary123/.agents/skills/site-rebuild-standards/KEYWORDS.md) and [page data criteria](guidelines/skills.temporary123/.agents/skills/site-rebuild-standards/PAGE-DATA.md) to the existing US kitchen website. The owner's kitchen-trailer-only instruction takes precedence over the shared multi-service examples. Source snapshot `c6fbaef` remains unmodified.

## Application and acceptance

| Criterion | Implementation and evidence |
| --- | --- |
| Focused service subject | Homepage cards show five existing photographed kitchen models. Inventory menus, inquiry selectors, calculator choices, rental-guide answers and active location promotions focus on kitchen trailers. Appliances built into an actual kitchen remain described truthfully. |
| Location H1 | All 301 location pages (50 states, 246 regions, five reviewed cities) have one deterministic state-first kitchen rental H1, at least 30 characters long. |
| Lead paragraph | All 301 have distinct 70–120-word introductions immediately after H1, covering emergency/planned uses, short/long terms, commercial/institutional customers, delivery coordination and an availability/quote invitation. |
| Location planning | All 301 include 5–10 project locations and a route-reference sentence using the existing state's corridor data. A statewide reference is not represented as a verified last-mile route for every community. Local/seasonal sources and reviewed city geography remain available. |
| Pricing and operation | Existing $4,995 equipment / $995 20 ft delivery starting figures are identified as national calculator estimates, not recurring rates or local final quotes. One-week/monthly requests, minimum terms, delivery/setup time, stairs/ramp and GPS require confirmation. The approved 24/7 rental-team contact remains. |
| Matching photographs | Location galleries contain five distinct kitchen photographs instead of the former 4:1 mix with unrelated service images. Captions distinguish configuration references from local inventory. Model quick views use their existing image mappings. |
| SEO consistency | Location descriptions, social images and Service schema reflect kitchen trailer rentals. Every generated page has a distinct title/description; full link/image check passes. |
| Design | All 15 source CSS files, index template, hosting configuration and contact configuration retain their original hashes. Twelve sampled header/hero/CTA computed-style comparisons at 375/1440 px match the prior build. Content and card counts changed to satisfy the requested service scope. |
| URL and indexing protection | All 745 registered paths and indexability flags remain identical. The 25-entry sitemap is byte-identical. Legacy equipment/source pages retain their existing URLs and historical content for compatibility; they are not the active promoted kitchen inventory. No additional indexing/publication. |
| Repeatable enforcement | `pnpm test` includes the rendered-location regression suite. `pnpm check:standards` inspects finished HTML after a build. Existing headline/city checks now validate the adopted headings and actual state-to-region-to-directory-to-city navigation. Prerender rejects an already-rendered template rather than silently reusing the homepage. |

[Exact before/after page mapping](guidelines/kitchen-page-mapping-2026-10-07.csv) records the 303 focused location/hub URLs, previous/current H1, intent, photo policy, indexing state and unknown business facts. Unrelated family headings were rejected for this site's active cluster; protected legacy URLs were retained rather than renamed or redirected.

## Verification

Evidence is isolated under `/tmp/mkr-guideline-adoption/`; detailed commands/results are in [TEST_RESULTS.md](TEST_RESULTS.md).

- Full application tests: 77/77; focused contact, development-rendering, SEO/accessibility and prepared-guide tests separately verified.
- Production pipeline: TypeScript, Vite and prerender generated 745 pages plus 404. `check:standards` passed all 301 location pages. SEO check passed 746 HTML pages, 42,291 local links, 8,427 local images and 746 distinct titles/descriptions.
- Headline and city checks cover 548 location/directory presentations and 19,702 Census places across 246 directories. URLs and staged content policy remain intact.
- Six Playwright tests cover 18 responsive page presentations, keyboard inventory/preview focus, all five circular quick views and galleries, the unchanged $6,490 kitchen + 25 ft delivery estimate and styled JavaScript-disabled output. No inquiry was submitted.
- Axe WCAG-tag comparison of the homepage at 375/1440 px found only the existing color-contrast rule among automatic violations: 10 mobile nodes and two desktop nodes in the candidate. No new automatic violation rule was introduced. ARIA and contrast checks also require manual review. The injected audit alone bypassed CSP; normal browser interaction tests retained CSP.

## Facts and release boundaries

The shared blank base-price/delivery fields, random price variations, exact setup durations and GPS claims do not establish business facts for this website. Final location prices, availability, delivery deadlines, GPS availability and installation durations still require the team's verified information. They were not invented to make the checklist appear complete.

DA is unmeasured here. The focused family rule is used without claiming a score or increasing the keyword families based on a hypothetical DA. No Moz improvement, backlinks, outreach, Search Console indexing or ranking result is claimed.

The generic 250-page build example does not authorize deleting protected URLs or releasing additional batches. The existing 25-page controlled cohort remains. Local specificity has improved, but this task does not certify a 75% unique-local-content ratio or every legacy page against the new editorial brief. Further substantive local evidence should be reviewed before any expanded indexing batch.

This is local implementation and verification. Existing contrast limitations remain under the owner's design-preservation constraint; full WCAG compliance is not claimed. No real call, form delivery, commit, push, deployment or live-host result was verified.
