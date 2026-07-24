The number of separate blocking chains detected in the selected time window. A blocking chain is one **root blocker** — a session holding a lock while not waiting on anything itself — plus every session queued behind it, directly or through other blocked sessions.

### How it's calculated

- The Logstag agent samples live session and lock state on the activity interval (10 s by default).
- Each blocked session is linked to the session blocking it.
- Following those links upward builds a tree per root blocker — each tree counts as **one** chain.
- The tile counts distinct chains seen in the window, with the current filters applied.

### Source by engine

| Engine | Source |
| --- | --- |
| SQL Server | `sys.dm_exec_requests.blocking_session_id` |
| PostgreSQL | `pg_blocking_pids()` |

### Example

*In the dashboard this section shows a live chain diagram: session 52 holds the lock and runs, session 67 queues behind it.*

### Reading it

Zero is the healthy state. One long-lived chain usually means a transaction was left open; many small chains point at hot rows or lock escalation on a busy table. Rising is shown red — more chains is always worse.
