A stacked history of wait events by category across the selected window. Each bar is a sample bucket; each color is one wait category, and the legend toggles categories on and off.

### The categories

Every engine has its own wait taxonomy — PostgreSQL has wait event types, SQL Server has hundreds of wait types, Oracle has wait classes. Logstag maps them all onto five shared categories so the chart reads the same everywhere:

- **Locks** — PostgreSQL `Lock` and `BufferPin`; SQL Server `LCK_*`; Oracle `Concurrency` and `Application` wait classes.
- **LW Locks** — PostgreSQL `LWLock`; SQL Server `LATCH_*`; Oracle `Configuration` wait class.
- **IO** — PostgreSQL `IO`; SQL Server `PAGEIOLATCH_*`, `WRITELOG`, `IO_*`, `PAGELATCH_*` and other buffer, memory and log waits; Oracle `User I/O` and `System I/O` wait classes.
- **Client** — PostgreSQL `Client` and `IPC`; SQL Server network waits such as `ASYNC_NETWORK_IO`; Oracle `Network` wait class.
- **Other** — everything an engine reports outside the categories above.

The mapping is deliberately lossy — it trades engine-native precision for cross-engine comparability. The table below the chart keeps the native event name on every row, so nothing is lost for drill-down.

### Reading it

Read the dominant color first. Lock-dominated windows point at transaction design and hot rows; IO-dominated windows point at storage, checkpoints, or a working set that outgrew memory; Client-dominated windows usually mean the application reads results slowly and the database is waiting on *it*. A category that appears only at fixed times of day is a scheduled job announcing itself.
