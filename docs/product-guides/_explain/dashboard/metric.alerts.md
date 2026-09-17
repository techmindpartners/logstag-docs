How many alerts are currently open (actionable) across the selected instances.

### How it's calculated

- Served by `GET /api/v1/health-checks/overview` and overlaid live from the alerts table — not derived from health-check findings.
- **Current count:** unresolved, unmuted alerts right now (`state` not Resolved / AutoResolved, `is_muted = false`). Optionally scoped to the topbar instance filter via each alert's server (through its database, or the alert's own `server_id`).
- **Trend ("vs. last week"):** the same statistic reconstructed as of seven days ago from `created_at` / `resolved_at` (past alert state is not versioned). Positive trend means more open alerts than a week ago.
- Independent of the topbar time-window chip — this is "open now", not "fired in the window". For windowed activity, use Alert History and Latest 10 Alerts.

### Reading it

Zero is the healthy baseline. When the count is up, open Latest 10 Alerts or the Alerts Explorer to see what is still firing; the Alert History chart below shows how that load arrived over the selected window.
