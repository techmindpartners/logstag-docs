The statement's average execution duration over the selected window. Rising is treated as a regression and shown red.

### How it's calculated

- Computed from the engine's execution-time and call counters collected across the window; the trend compares against the preceding window.
- The unit adapts — sub-second averages keep millisecond precision.

### Source by engine

| Engine | Source |
| --- | --- |
| PostgreSQL | `pg_stat_statements` execution-time counters |
| SQL Server | Query Store runtime statistics or `sys.dm_exec_query_stats` elapsed-time counters |
| Oracle | `v$sqlarea` elapsed-time counters |

### Reading it

Means hide tails — the Statistics tab's Min/Max spread tells you whether this is a consistently-slow statement or a usually-fast one with terrible outliers, which are fixed differently (the first by plan or index work, the second usually by contention or parameter-sensitivity hunting).
