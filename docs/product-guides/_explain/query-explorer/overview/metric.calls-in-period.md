How many times this statement executed during the selected window.

### How it's calculated

- The agent collects the engine's query statistics roughly every minute and Logstag counts the executions that fall inside the window; the trend compares against the preceding window.

### Source by engine

| Engine | Source |
| --- | --- |
| PostgreSQL | `pg_stat_statements` call counters |
| SQL Server | Query Store runtime statistics, falling back to `sys.dm_exec_query_stats` when Query Store is off |
| Oracle | `v$sqlarea` execution counters |

### Reading it

Calls are the multiplier on everything else: a 5 ms statement at a million calls costs more than a 2-second statement running hourly. When calls jump without a traffic change, suspect a new code path or a loop — the classic N+1 signature the Insights page also watches for.
