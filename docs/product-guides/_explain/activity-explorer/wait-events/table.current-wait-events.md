One row per waiting session observed in the selected window, showing its most recent wait. Click a row (or its eye icon) to open the full detail in place — session identity, the event, timing metrics, and the complete query text.

### Columns

- **PID** — the engine's session identifier for the waiting session.
- **Type** — the shared wait category badge: Locks, LW Locks, IO, Client, or Other (see the category mapping on the history chart).
- **Event** — the engine-native wait name, unmapped: the `wait_event` on PostgreSQL, the `wait_type` on SQL Server, the event name on Oracle. This is the string to search engine documentation for.
- **Resource** — the object or resource associated with the wait, when one can be determined; otherwise a dash.
- **Duration** — how long this session has been in its current wait, measured with the database server's own clock.
- **Count** — how many sessions were observed in this same wait event alongside this one.
- **Time** — the average wait duration across those sessions.
- **Query** — the statement the session is executing, clamped to two lines; open the row detail for the full text.

Columns can be filtered individually, sorted where the header allows it, and shown or hidden from the column picker — visibility choices persist in your browser.

### How it's calculated

- The Logstag agent samples live session state on the activity interval (10 s by default); each waiting session appears once with its latest wait.
- Count and Time aggregate across sessions sharing the same event, so a hot event reads the same from any of its rows.

### Source by engine

| Engine | Source |
| --- | --- |
| PostgreSQL | `pg_stat_activity` — `wait_event_type` and `wait_event` columns |
| SQL Server | `sys.dm_exec_requests` wait columns (`wait_type`, `wait_time`, `wait_resource`) joined with session and connection views |
| Oracle | `v$session` (`event`, `state`, wait timing), with wait-class enrichment from `v$system_event` |

### Reading it

Group mentally by Event: five rows with the same event and a high Count is one problem, not five. A single row with a long Duration and `Locks` type is a victim — its detail shows the blocking session. Events you don't recognize are worth the lookup: engine wait names are precise, and the engine's documentation for that exact string usually names the subsystem under pressure.
