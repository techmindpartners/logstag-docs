Track API access and user activity across your organization.

### How it's calculated

- The page requires the **ViewAuditLogs** permission. Admin and SuperAdmin hold it by default — the audience is the permission, not a hardcoded role check, so a future role or a custom grant could hold it too.
- Every recorded action carries the acting user, their role at the time, the HTTP method, route, controller, and action, an optional entity reference, the response status, and duration — sourced from API request activity, not from database-level auditing on monitored engines.
- The page opens on the Last 24 Hours window by default, distinct from the shared time-window default used elsewhere in the product.

### Reading it

Start from the Activity table's filters to scope a window and narrow by method, controller, or entity, then open a row for the full Event Detail — including request context — before drawing conclusions from the summary columns alone.
