Typical number of sessions waiting at once, by wait category, across the selected databases.

### How it's calculated

- Served by `GET /api/v1/metrics/wait-events` with the dashboard's `from` / `to` / `bucketSize` and optional instance filter (empty = whole org). Results are cached for 30 s.
- Covers PostgreSQL, SQL Server and Oracle only.
- **Unit:** average number of sessions waiting at once in the bucket, per database, then summed across databases and engines — averaged only over the samples that had at least one waiting session, so rare, bursty waits read higher than a strict time-average would. Sessions running on CPU (no wait) are not counted.
- Sampling cadence: PostgreSQL `pg_stat_activity` ~every 10 s; SQL Server sessions ~every 30 s; Oracle sessions in `WAITING` state.
- **Category: Locks** — PostgreSQL `Lock`, `BufferPin`; SQL Server `LCK_*`; Oracle Concurrency, Application.
- **Category: Lightweight Locks** — PostgreSQL `LWLock`; SQL Server `LATCH_*`; Oracle Configuration.
- **Category: I/O** — PostgreSQL `IO`; SQL Server `PAGEIOLATCH_*`, `WRITELOG`, `IO_*`, `PAGELATCH_*`, `HADR_*`, `LOGMGR*`; Oracle User I/O, System I/O.
- **Category: Client / Network** — PostgreSQL `Client`, `IPC`; SQL Server `ASYNC_NETWORK_IO`, `*NETWORK*`, `SNI_*`; Oracle Network.
- **Category: Other** — everything else (e.g. PostgreSQL `Activity`, `Timeout`; SQL Server `CXPACKET`, `SOS_SCHEDULER_YIELD`).
- Buckets with no data come back `null` and are drawn as gaps; a real zero stays 0. A failed read on one engine silently drops that engine's contribution.

### Reading it

Idle PostgreSQL connections wait on Client, so a steady Client / Network band usually means idle pooled connections, not a network problem; idle Oracle sessions ("SQL*Net message from client") land in Other. Look at Locks, Lightweight Locks and I/O for real contention. Hover stays in sync with the other three trend tiles.
