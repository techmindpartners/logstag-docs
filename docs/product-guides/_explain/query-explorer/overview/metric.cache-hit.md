How much of this statement's data access was served from memory rather than disk, as a percentage.

### How it's calculated

The formula is engine-specific, using each engine's own counters:

| Engine | Source |
| --- | --- |
| PostgreSQL | buffer-block counters from `pg_stat_statements` — blocks hit in cache as a share of all blocks accessed (shared and local) |
| SQL Server | logical versus physical reads — the share of logical reads that did not require a physical read |
| Oracle | logical versus physical reads (`buffer_gets` and `disk_reads`), same shape as SQL Server |

### Reading it

High is good, and for hot statements it should be very high — a busy statement in the low nineties or below is doing real disk work on every execution. A cache-hit drop with an unchanged query usually means the working set outgrew memory or something else evicted it; correlate with the database's own memory pressure on the Database Explorer.
