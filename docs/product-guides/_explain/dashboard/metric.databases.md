How many monitored databases belong to the selected instances right now.

### How it's calculated

- Served by `GET /api/v1/health-checks/overview` and overlaid live onto the dashboard response.
- Counted in SQL as the current number of databases for the organization, optionally scoped to the topbar's instance (server) IDs. An empty filter match returns zero rather than falling back to org-wide.
- The trend ("vs. last week") compares that current count to the count as of seven days ago (`created_at ≤ now − 7 days` for the previous baseline).
- Independent of the topbar time-window chip.

### Reading it

Databases grow with new registrations and shrink when databases are removed from monitoring. A jump without a matching Instances change usually means more databases were attached to existing servers.
