# Operations handoff

- Review queued inquiry records promptly; investigate Glide webhook failures and any `manual_review` jobs. Confirm the workflow result in Glide before manually retrying jobs older than 23 hours.
- Alert on contact 5xx, `delivery_pending` events, elevated 429s, old queued records, and Firebase spending. Logs intentionally omit lead contents and raw IPs. Assign the business a Glide-workflow owner and an infrastructure operator before enabling inquiries.
- Verify Firestore TTL on rateLimits, leads and outbox. The default 90-day inquiry retention is not approved policy. Align backups, logs, inbox copies and deletion requests with the chosen policy.
- Enable appropriate Firestore backup/PITR features and document cost. Set business-approved recovery objectives; perform a restore into an isolated project before declaring recovery verified.
- To stop intake, set `CONTACT_ENABLED=false`. To stop automated Glide retries, disable the external scheduler and rotate `CRON_SECRET`. Restrict service-account access and rotate Firebase/Glide credentials after suspected exposure.
- Roll back application revisions independently from data. Do not roll back to permissive database rules. Preserve migration redirects and canonical policies during rollback unless the SEO owner has approved another treatment.
- Monitor the migration at launch, +1, +7, +14 and +30 days. Use Search Console and provider logs; sitemap inclusion or a 200 response does not prove indexing.
