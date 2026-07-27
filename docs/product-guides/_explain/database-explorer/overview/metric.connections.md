How many client connections the database currently has. On MongoDB the tile is labeled **Server Connections**, because connection counts there are reported for the server process.

### How it's calculated

- The agent samples the engine's connection figures on its collection intervals; the tile shows the latest value for the selected window with a trend against the preceding window.

### Source by engine

| Engine | Source |
| --- | --- |
| PostgreSQL | `pg_stat_activity` session samples |
| SQL Server | `sys.dm_exec_sessions` session samples |
| MongoDB | `serverStatus` connection counters |
| Redis / Valkey | `INFO clients` |
| Oracle | `v$session` samples |

### Reading it

Judge it against the connection limit and the pool size, not in isolation. A count parked near the engine's maximum is an outage waiting for one traffic spike. For the split between active and idle — and the per-session detail — the Activity Explorer's Connections tab is the drill-down surface.
