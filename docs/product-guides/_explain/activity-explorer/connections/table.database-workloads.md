One row per connection observed in the selected window, using each session's most recent sample. Click a row (or its eye icon) to open the full session detail in place — session identity, state, timing, and the complete query text.

### Columns

- **PID** — the engine's session identifier: the backend process id on PostgreSQL, the session id on SQL Server, the SID on Oracle.
- **User** — the database user the connection authenticated as.
- **Database** — the database the connection is attached to (hidden by default; enable it from the column picker).
- **State** — the shared state badge: Active, Idle, Idle in transaction, Waiting for lock, Disabled, or Other. Each engine's native states are mapped onto this model.
- **Wait Event** — the engine-native name of the wait the session is currently in, when it is waiting.
- **Duration** — how long the session's current query has been running, measured with the database server's own clock. Idle connections show zero.
- **Query** — the current statement, clamped to two lines in the table; open the row detail for the full text.

Columns can be filtered individually, sorted where the header allows it, and shown or hidden from the column picker — visibility choices persist in your browser.

### How it's calculated

- The Logstag agent samples live session state on the activity interval (10 s by default).
- Each connection appears once with its latest sampled state; the tab's filters and pagination apply server-side.

### Source by engine

| Engine | Source |
| --- | --- |
| PostgreSQL | `pg_stat_activity` — query-bearing client backends |
| SQL Server | `sys.dm_exec_sessions` + `sys.dm_exec_requests` + `sys.dm_exec_connections`, with query text from `sys.dm_exec_sql_text()` |
| Oracle | `v$session`, with process and per-session statistics joined from `v$process` and `v$sesstat` |

### Reading it

Sort by Duration to surface the longest-running statements first. A row in **Waiting for lock** shows the blocker's PID in its detail view — cross-reference it with the Blocking Chains tab to see the whole chain. Recurring rows with the same query and rising duration are your candidates for the Query Explorer.
