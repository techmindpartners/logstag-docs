Alerts fired per interval, stacked or lined by severity, for the selected window.

### How it's calculated

- Served by `GET /api/v1/alerts/history` (same window snapshot as Alerts Fired and Resolution Time).
- Each bucket counts firings by severity, including alerts that later resolved.
- Only **Low, Medium, High and Critical** have a series. The history query's severity list stops at Low, so Info and Best Practice firings are excluded from this chart rather than folded into the Low series — they are absent, not merged.
- Gaps appear for buckets before `monitoringStartedAt` when that timestamp is known: a bucket that predates monitoring renders as a break in the line rather than a measured zero.

### Reading it

Use this for "what severity drove the noise," not "what is open now." The **visible title is Alerts Activity**. Alerts History (raised/resolved) answers backlog motion; this card answers firing mix. A break in the line means "not monitored yet", while a plotted zero means "monitored, nothing fired".
