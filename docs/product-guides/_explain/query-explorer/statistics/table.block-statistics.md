Time this statement spent reading and writing data blocks — the I/O-wait component of its execution time.

### Rows

- **Block read time** — time spent waiting for blocks to be read.
- **Block write time** — time spent writing blocks out.

### Availability

These timings come from PostgreSQL's per-statement I/O instrumentation and require the database's `track_io_timing` setting to be enabled; without it — and on SQL Server and Oracle — the rows show a dash.

### Reading it

Compare block time against the statement's total execution time. A statement spending most of its time in block reads is storage-bound: the fix is cache (memory), fewer blocks (indexes, tighter predicates), or faster disks — not query logic. Near-zero block time on a slow statement means the time goes to CPU or locks instead, which the Activity Explorer's wait views can attribute.
