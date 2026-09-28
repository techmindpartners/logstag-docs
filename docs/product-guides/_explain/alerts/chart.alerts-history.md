Per-interval Active versus Resolved alert activity across the selected window.

### How it's calculated

- Served by `GET /api/v1/alerts/raised-resolved-history` with the same `from` / `to` / `bucketSize` the page derives from the topbar time window.
- **Active:** unmuted alerts whose firing window overlaps the bucket (a chronic alert can appear in many buckets).
- **Resolved:** unmuted alerts whose `resolved_at` falls inside the bucket. Muted alerts are excluded.
- Every bucket in the window is plotted, zeros included. This card has no per-bucket gap for time before monitoring began — a quiet bucket and a not-yet-monitored bucket both draw as zero.
- When nothing at all was raised or resolved in the window, the card swaps to an empty state instead: **Before monitoring started**, naming the start date, if the whole window predates the earliest monitored instance, and **No alerts fired in this window** otherwise.

### Reading it

Read Active as "how much was on fire" and Resolved as "how much was closed". Rising Active with flat Resolved means the backlog is building. This card's **visible title is Alerts History** — do not confuse it with Alerts Activity (severity firings from `/alerts/history`), which is the card that breaks its line for buckets before monitoring started.
