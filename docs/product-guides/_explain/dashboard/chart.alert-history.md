Alerts that were firing in each interval versus alerts closed in it, across the selected databases.

### How it's calculated

- Served by `GET /api/v1/alerts/raised-resolved-history` with the same `from` / `to` / `bucketSize` the dashboard derives from the topbar time window (presets re-anchor on Refresh; custom ranges keep fixed bounds).
- **Active (raised):** an overlap gauge — every unmuted alert whose firing window `[first_triggered_at, last_triggered_at]` overlaps the bucket (edges clamped to the request window). A chronic alert that keeps re-firing appears in every bucket it was active, not only the day its row was created.
- **Resolved:** unmuted alerts whose `resolved_at` falls inside the bucket.
- Muted alerts are excluded. Instance scope uses resolved instance **names** (same filter family as the alerts list).
- Buckets that end at or before `monitoringStartedAt` (when the earliest server in scope was registered) are drawn as gaps — they predate monitoring, so a flat zero would be misleading.

### Reading it

Read Active as "how much was on fire" and Resolved as "how much was closed" in each interval. A quiet estate shows a flat Active line near zero; a rising Active line with a flat Resolved line means the backlog is building. Hover stays in sync with the other three trend tiles so you can line a spike up with utilization or wait events at the same bucket.
