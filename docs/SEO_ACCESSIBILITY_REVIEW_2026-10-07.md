# Design-preserving SEO and accessibility review — 2026-10-07

Implemented locally at the owner's request. Default layout, colors, fonts, spacing, visible copy, equipment imagery and URLs are preserved. Nothing was committed, pushed or deployed. This is a technical improvement and measured audit, not a WCAG certification or a promise of rankings/Domain Authority.

## Changes

- Replaced the identical descriptions on all 50 state guides with concise descriptions that put the state first and explicitly qualify availability. H1s and on-page descriptions remain unchanged. WebPage/Service schema descriptions follow the corrected metadata.
- Added matching Open Graph/Twitter images and image alternatives to generated pages. Kept canonical/indexing decisions independent of sharing metadata. Removed unverified 1200 × 630 dimensions from regional images; the existing branded social card is verified at that size.
- Strengthened the existing SEO checker to validate social metadata consistency and actual image files. Corrected its title selector so SVG state-map titles are not accidentally included in the document title.
- Removed accessible-name overrides that omitted visible branding, phone-support or Project Desk labels. Catalog image links now include their visible action, equipment context and new-tab notice. Carousel thumbnails and the reduced-motion control include their visible labels.
- Added named landmarks, appropriate accessible card/map heading levels, initially hidden inactive carousel slides and a presentation role for the rental guide's internal header. Existing styled heading tags and controls are retained.

## Verification

| Check | Result |
| --- | --- |
| TypeScript | Pass |
| Focused SEO/accessibility/development/carousel tests | 14/14 pass |
| Rental-guide engine/direct-answer tests | 34/34 pass |
| Existing configured application suite | 73/74 pass; Alaska word-count failure also reproduces in the untouched baseline (517 versus maximum 500) |
| Isolated production client build and prerender | Pass; 745 routes plus 404 |
| Full generated SEO/link/image audit | 746 distinct titles and descriptions; 96,204 local links, 12,910 image uses, zero reported problems |
| Whole-output preservation | 746 pages retain body text, H1s, image paths, robots and canonicals; 745 JSON-LD graphs parse and match descriptions; route registry, sitemap and robots.txt unchanged |
| Automated accessibility scan | axe-core 4.14.0, WCAG 2.0/2.1/2.2 A/AA and best-practice rules; 11 routes at 375/1440 px (22 presentations) |
| Interaction checks | 14 production states: navigation, equipment preview/selection, lightbox, Project Desk, rental guide and state preview at both widths; keyboard opening, skip-link focus, Escape and focus restoration checked |
| Design preservation | All source CSS and hosting/indexing/dependency config unchanged; measured geometry/styles identical in 22 presentations; screenshot comparisons and settled thumbnail captures reviewed |

The existing indexing policy still releases only 25 routes. This task does not authorize an indexing expansion or recover the separate historical migration inventory. The SEO checker's local `launchReady` field means its technical assertions passed; it does not establish external release readiness.

## Remaining boundaries

**Contrast:** the desktop “Urgent project” label has a measured 3.95:1 contrast ratio against the red button, below the 4.5:1 requirement for this text. It is the only confirmed violation on the sampled ordinary pages and remains unchanged to honor the owner's strict color/design constraint. Full WCAG AA conformance is not claimed. [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

**Rental guide:** the mobile automated target-size rule reports that fixed background controls overlap the guide input. Native top-layer rendering actually places the input above those controls: its measured size is about 241 × 44.5 px, and all nine sampled hit-test positions resolve to the input. This is a recorded automated/manual discrepancy, not a suppressed rule. Desktop background-label contrast is also reported while the guide is open. Automated incomplete findings (including image-background contrast and certain ARIA/label checks) remain review items; no exhaustive screen-reader/assistive-technology certification was performed. [axe-core testing scope](https://github.com/dequelabs/axe-core).

The broad application-suite word-count failure was not repaired because changing visible state copy is outside the design-preservation scope. No live hosting, Search Console recrawl/indexing, form delivery, field Core Web Vitals or Moz score was verified.

## Domain Authority follow-through

Moz DA is a comparative, link-based metric; technical changes do not directly set its score. No numeric DA baseline or increase is claimed. Existing valuable URLs/redirects and the current crawl policy were preserved, and local broken-destination checks passed. [Moz authority scoring guide](https://moz-static.s3.amazonaws.com/products/landing-pages/announcements/Authority_Scoring_Guide.pdf).

After deployment, measure the public domain in Moz alongside relevant competitors, verify the existing domain property/crawl results in Search Console, and pursue truthful industry, institutional and partner references backed by publishable project evidence. Track relevant referring domains, qualified enquiries and search performance alongside DA. No external outreach, purchased links, fabricated project claims or additional pages were created in this task. Google's guidance supports useful content and crawlable links; eligibility alone does not guarantee indexing or rankings. [Google SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).

Detailed commands, isolated outputs and audit boundaries are recorded in `docs/TEST_RESULTS.md`; ephemeral artifacts are under `/tmp/mkr-seo-accessibility/`.
