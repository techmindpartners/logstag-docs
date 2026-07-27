The number of sessions observed **actively executing work** on this database across the selected window's samples.

### How it's calculated

- The Logstag agent samples live session state on the activity interval (10 s by default).
- Sessions whose engine-native state maps to active are counted across the window; the trend arrow compares against the preceding window of the same length.

### Source by engine

| Engine | Source |
| --- | --- |
| PostgreSQL | `pg_stat_activity` |
| SQL Server | `sys.dm_exec_sessions` joined with `sys.dm_exec_requests` |
| Oracle | `v$session` |

### Reading it

This is the database's concurrency at a glance — the same signal the Connections tab breaks down per session. Compare it against the CPU cores available to the database: a level persistently above the core count means sessions are queuing. A sudden spike usually accompanies a deploy, a retry storm, or a lock convoy forming; the Connections and Blocking Chains tabs show which.
