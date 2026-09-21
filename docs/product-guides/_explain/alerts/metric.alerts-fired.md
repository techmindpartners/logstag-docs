How many alert firings occurred in the selected time window, across all severities.

### How it's calculated

- Sum of per-severity `alertCount` values from `GET /api/v1/alerts/history` for the chart snapshot window.
- Counts **events in the window**, including alerts that have since resolved — not the open backlog.
- Instance filter applies. Hint text names the window label (for example Past 24 hours).

### Reading it

It is normal for Alerts Fired to be large while Active Alerts is zero: the estate fired and cleared inside the window. Compare with Alerts Activity (severity breakdown of the same history) and Open Alerts (what is still open).
