# Existing public-page indexability: release handoff

Status: implemented and locally verified; **not pushed or deployed**.

Base revision: `4d05061` from `Temporary-123-Inc/Temporary-123` main.
Branch: `codex/public-page-indexability`.
Workspace: `D:\Temporary123-public-indexing-20260922`.

## Result

| Check | Live baseline | Prepared production build |
| --- | ---: | ---: |
| Registered routes | 745 | 745 |
| Public pages permitting indexing | 25 | 744 |
| Public pages held by noindex | 719 | 0 |
| Operational dashboard held by noindex | 1 | 1 |
| Production sitemap URLs | 25 | 744 |

Every public route preserves its exact path, returns direct HTTP 200 in local HTTP QA, contains one H1 and an exact self-canonical, appears in the production sitemap, and is reachable from the homepage through HTML links. Existing content, images, forms and `vercel.json` redirects are unchanged. Unfinished city drafts and retired historical URLs are outside this release.

Preview builds still exclude all registered routes from indexing and emit no sitemap URLs. The 404 page remains excluded. Noindex is an indexing directive, not authentication or access control.

## Evidence

- `indexability-production.json`: per-route production HTML metadata, sitemap membership, route parity and crawl-graph audit; 744 eligible public routes, zero errors.
- `indexability-preview.json`: per-route preview audit; zero eligible routes, zero sitemap URLs, zero errors. The existing Oklahoma Panhandle preview canonical was preserved while its noindex remained enforced.
- `docs/TEST_RESULTS.md`: 74/74 application tests; 6/6 focused browser/HTTP tests (including all 744 public URLs and 24 representative viewport presentations); SEO/link/headline/city/secret results.
- Generated `audit/build-registry.json`, `audit/indexing-rollout.json` and `audit/draft-sitemap.xml` reflect the effective 744-page public scope. The last build was restored to production after preview testing.

These results prove local technical eligibility, not deployment or Google's decision to index/rank a page. No Search Console resubmission occurred.

## Deployment prerequisite

`npm run check:release` still fails with:

```text
security evidence contains unresolved release controls
```

The existing security evidence has eight blocked controls: `AUTHZ`, `CORS_HEADERS`, `APP_CHECK`, `INTEGRATIONS`, `SECRETS`, `DEPLOY`, `OBSERVE`, and `RECOVERY`. Its environment descriptions are older than the current production site. Refresh the actual authorization, origin/header, App Check, delivery, secret-scope, deployment, observability and backup/restore evidence; do not merely change statuses or disable inquiries. `npm run check:security` also rejected existing evidence references outside the required report directory. Restore a valid evidence bundle without weakening the checker. These findings are missing or stale verification, not proof of a current production vulnerability.

After those prerequisites are resolved, rebase or reconcile against the latest official main without including the primary checkout's separate drafts. Run the application suite, build, SEO checks and browser tests again, then use the verified `temporary-124/temporary-123` Vercel project. Do not use an unrelated similarly named project.

After deployment, rerun the full public-indexability browser/HTTP test against `https://temporary123.com`, inspect production HTTP robots headers and sitemap membership, and verify dashboard/preview/error exclusions. Only then report the 744-page change as live. Google index inclusion still requires fresh Search Console evidence.
