Alerts fired per interval, stacked or lined by severity, for the selected window.

### How it's calculated

- Served by `GET /api/v1/alerts/history` (same window snapshot as Alerts Fired and Resolution Time).
- Each bucket counts firings by severity, including alerts that later resolved. Info / BestPractice fold into the lower severity series on the chart.
- Gaps appear for buckets before `monitoringStartedAt` when that timestamp is known.

### Reading it

Use this for "what severity drove the noise," not "what is open now." The **visible title is Alerts Activity**. Alerts History (raised/resolved) answers backlog motion; this card answers firing mix.
