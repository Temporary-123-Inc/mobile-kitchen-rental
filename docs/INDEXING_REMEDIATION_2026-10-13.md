# Search Console exclusion remediation — 2026-10-13

The owner's supplied report shows 838 noindex URLs, three 403 URLs and one redirected homepage URL as of October 9. The current request explicitly approves indexing **all existing public pages, including historical equipment pages**. The application has 745 registered routes: 744 public pages and one operational dashboard. The 838 historical Search Console entries were not exported, so their exact relationship to these 744 canonical routes remains unverified; protocol/host alternatives and old URLs must not be counted as newly created pages.

## Live findings before release

| Supplied URL | Observed chain | Finding |
| --- | --- | --- |
| `https://www.mobile-kitchen-rental.com/` | 308 → HTTPS apex → 200 | Reported homepage 403 not reproduced. |
| `http://www.mobile-kitchen-rental.com/` | 308 → HTTPS www → 308 → HTTPS apex → 200 | Reported homepage 403 not reproduced. |
| `http://www.mobile-kitchen-rental.com/our-prices.php` | HTTP upgrade → apex redirect → 403 | Vercel returns `x-vercel-mitigated: deny`. |
| `http://mobile-kitchen-rental.com/` | 308 → HTTPS apex → 200 | Expected canonicalization; preserve it. |

Direct HTTPS apex `/our-prices.php` also returns 403. An unrelated PHP path is denied too, consistent with a path-based mitigation, but the exact blocking rule cannot be identified without firewall configuration/log access. Initial denied-request example: `sin1::h8dgh-1791828575875-e4d4fe04bfb6`. The live homepage emits `index,follow` with an exact apex canonical. The live sitemap contains 25 destinations; all 25 returned direct 200 without a noindex header. The live calculator and `/government/hospitals/` still emit noindex with no canonical at this audit point.

## Local changes

- Select the existing `existing-public-pages` policy instead of the 25-page hold. Generated public pages now emit `index,follow`, exact HTTPS apex self-canonicals and sitemap entries.
- Preserve dashboard, private/API, preview-host and genuine error exclusions.
- Permanently redirect exact `/our-prices.php` and `/our-prices.php/` to `/rental-calculator/`, preserving query parameters. The destination supplies current published starting estimates; historic figures are not republished.
- Add a historical reference directory on `/planning/` linking 30 existing pages that became eligible but had no incoming internal links. Titles come from verified rendered pages. Active kitchen menus, customer choices and equipment promotions remain kitchen-only.
- Record the current owner's approval in `docs/BOSS_REQUIREMENTS.md`, superseding the conflicting 25-page instructions for existing public inventory.

No new URLs or equipment promotions were created. The shared checkout advanced from `335bc59` to `a92b507` during this task because another task released its Contact Us changes. Those changes, including `inquiriesEnabled: true`, were preserved; the assignment-document conflict was resolved by retaining both entries. Final validation uses a refreshed isolated candidate with the latest baseline.

## Verification

Integrated final candidate based on `a92b507`:

- `pnpm build`: TypeScript, Vite and prerender passed; 745 registered pages plus genuine 404, with 744 indexable public routes. Route set matches the original registry exactly.
- `pnpm test --testTimeout=20000`: 83/83 tests passed in 14 files. The default run hit the inherited 5-second exhaustive archive-test timeout at about 5.4 seconds; the longer CLI timeout preserves every assertion and no repository timeout was changed.
- `pnpm check:seo`: all 746 HTML pages checked; 42,322 local links, 8,427 images, 746 distinct titles/descriptions, zero problems or pending migration links. The 30 previously orphaned pages now have internal links.
- `pnpm check:standards`: all 301 location pages passed the existing kitchen-site criteria.
- Existing public-indexability Playwright suite: 4/4 tests passed, including direct HTTP 200/robots/self-canonical checks for all 744 public routes, 390/1440 px metadata after browser enhancement, excluded dashboard and genuine missing-page 404.
- Planning directory: both 390/1440 px presentations passed with all 30 correct link labels/destinations, no horizontal overflow and no browser exceptions.
- Both exact legacy pricing variants redirect locally with 308 to the calculator and preserve `utm_source=legacy`; destination returns 200. Preview hosts retain `X-Robots-Tag: noindex, follow`; a production Host request to the sitemap returns 200 without that tag or CSP.
- Generated sitemap has exactly the 744 approved canonical public destinations. Final source bytes match the current checkout's affected files; whitespace checks pass. Root generated output and tracked audit files are preserved.

Final live rechecks still show working homepage chains, a 25-URL sitemap and the pricing PHP 403. These repository changes are not deployed. Candidate and raw logs: `/tmp/mkr-indexing-20261013/`.

## Live completion requirements

1. Deploy the reviewed source to the actual Vercel project `temporary-124/mobile-kitchen-rental-new`, confirmed by the repository's Vercel commit status. Recheck current deployment/alias before making provider changes.
2. In that project's Firewall logs, locate the exact denied legacy request and matching rule. Make the smallest exception needed for public GET/HEAD requests to `/our-prices.php` (and its optional slash) on the apex/www hosts so they reach the permanent redirect. If it is a custom deny rule, place an exact-match bypass before it or exclude these exact paths from that rule. Keep other PHP/attack protections intact. A repository redirect cannot override a firewall denial that occurs first; system-level mitigations require their own provider control.
3. Recrawl the deployed sitemap's 744 canonical destinations for direct 200, robots, self-canonicals and absence of a noindex response header; verify dashboard/preview/error exclusions separately. Retest all supplied URL chains and ensure the pricing destination is 200 and indexable.
4. In Search Console, submit or refresh `https://mobile-kitchen-rental.com/sitemap.xml`, use live URL Inspection on the homepage and calculator, and start validation for the 403 and unintended noindex categories after live checks pass. Keep the HTTP homepage redirect. Intentional operational exclusions and redirect source URLs can remain excluded.
5. Export the 838 noindex example URLs before claiming every historical report entry was reconciled. Eligibility and validation requests are separate from confirmed Google indexing.

Provider changes, deployment of this task, Search Console validation and Google index inclusion are unverified. The available local Vercel auth file has no credentials; the Vercel integration was found but is not installed/connected. The owner explicitly declined connecting Vercel and requested work with existing access. No firewall changes, commit, push or deployment were made by this task.

Sources: [Google Page indexing report](https://support.google.com/webmasters/answer/7440203), [Vercel firewall rule actions](https://vercel.com/docs/vercel-firewall/vercel-waf/rule-configuration), [Vercel PHP-path blocking example](https://vercel.com/kb/guide/block-php-requests).
