The number of client connections observed on this database in the selected time window, across every state — executing, idle, and waiting alike.

### How it's calculated

- The Logstag agent samples live session state on the activity interval (10 s by default).
- Each sampled session counts once, using its most recent sample in the window.
- The count respects the filters applied on the tab, and the trend arrow compares against the preceding window of the same length.

### Source by engine

| Engine | Source |
| --- | --- |
| PostgreSQL | `pg_stat_activity` — query-bearing client backends; internal background workers are not part of this surface |
| SQL Server | `sys.dm_exec_sessions` joined with `sys.dm_exec_requests` and `sys.dm_exec_connections` — system sessions and the agent's own connections are excluded |
| Oracle | `v$session` |

### Reading it

Watch the level against your connection-pool size. A slow climb that never comes back down usually means a pool leak or an application that opens connections without closing them; a sudden spike often accompanies a deploy or a retry storm. Split the total with the Active and Idle tiles before reacting — a high total made of idle connections is a different problem than a high total that is all active.
