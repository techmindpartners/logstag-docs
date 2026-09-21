Per-interval Active versus Resolved alert activity across the selected window.

### How it's calculated

- Served by `GET /api/v1/alerts/raised-resolved-history` with the same `from` / `to` / `bucketSize` the page derives from the topbar time window.
- **Active:** unmuted alerts whose firing window overlaps the bucket (a chronic alert can appear in many buckets).
- **Resolved:** unmuted alerts whose `resolved_at` falls inside the bucket. Muted alerts are excluded.
- Buckets that end at or before `monitoringStartedAt` are drawn as gaps — they predate monitoring.

### Reading it

Read Active as "how much was on fire" and Resolved as "how much was closed". Rising Active with flat Resolved means the backlog is building. This card's **visible title is Alerts History** — do not confuse it with Alerts Activity (severity firings from `/alerts/history`).
