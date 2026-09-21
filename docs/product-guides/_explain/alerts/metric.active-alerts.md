How many alerts are open and actionable right now across the selected instances.

### How it's calculated

- Served by `GET /api/v1/alerts/query` with `pageSize: 1` — the KPI uses `pagination.totalCount`, not a cached strip.
- Counts non-resolved alert rows (the backend's open scope). The list's default **Active** filter is narrower (`New` + `Acknowledged` only); this KPI matches the dashboard Alerts tile.
- Muted alerts are excluded. The topbar **instance** filter applies; the **time window does not** — this is "open now", not "fired in the window".

### Reading it

Zero is the healthy baseline. When Active Alerts is high but Alerts Fired is quiet for the window, the backlog is older than the chip. Open the Open Alerts list to act; use Alerts History / Alerts Activity for how the load arrived.
