The number of connections that were **executing work** when sampled — running a statement rather than sitting idle or parked in an open transaction.

### How it's calculated

- Each engine reports a native session state; Logstag maps it onto a shared state model, and this tile counts the sessions that map to **Active**.
- PostgreSQL: sessions with state `active`.
- SQL Server: sessions whose request is `running` or `runnable`, plus `suspended` sessions waiting on non-lock resources (they hold an executing request even while briefly suspended).
- Oracle: sessions with status `ACTIVE` that are not currently in a wait.
- The count uses each session's most recent sample in the window, with the tab's filters applied.

### Reading it

This is your concurrency at a glance. Compare it against the database's CPU capacity: an active count persistently higher than the cores available means sessions are queuing for CPU. A sudden drop to zero while Total Connections stays high can be just as interesting — everything connected, nothing working — and usually points at a lock convoy or an upstream stall.
