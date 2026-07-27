The number of **deadlocks the engine detected** in the selected window. Unlike the Wait Events tab's Potential Deadlocks, this counts real occurrences — situations the engine resolved by killing a victim.

### How it's calculated

- The agent collects each engine's deadlock counters; Logstag reports the growth within the window, with rising shown red.

### Source by engine

| Engine | Source |
| --- | --- |
| PostgreSQL | the `deadlocks` counter in `pg_stat_database` |
| SQL Server | the engine's deadlock rate counters |
| Oracle | the change in the cumulative `lock deadlock retry` event counter |

### Reading it

Zero is the only comfortable value. Every unit here is a transaction the engine chose to kill, which the application experienced as an error. One-off deadlocks under rare workloads happen; recurring ones are a code pattern — two paths taking the same locks in different orders — and the Blocking Chains tab plus the engine's own deadlock report will name the tables involved.
