How many database servers (instances) are connected in this organization right now.

### How it's calculated

- Served by `GET /api/v1/health-checks/overview` and overlaid live onto the dashboard response — not read from a cached snapshot of the KPI strip.
- Counts every server belonging to the organization. When the topbar instance filter is set, only the selected server IDs are included (`InstanceFilter`).
- The trend label ("vs. last week") is the difference between the current count and how many of those same servers already existed seven days ago (`CreatedAt ≤ now − 7 days`). A new server registered this week raises the trend; removing one that was present last week lowers it.
- Independent of the topbar time-window chip — this is a live estate count, not a windowed series.

### Reading it

Use this as the inventory baseline for the rest of the page. When the instance filter is on, every other KPI and chart on the dashboard narrows to the same selection, so a lower Instances number should match a quieter Connections and Alerts strip.
