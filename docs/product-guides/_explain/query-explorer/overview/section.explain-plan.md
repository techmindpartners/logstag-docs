The execution plan Logstag captured for this statement — the engine's own description of how it runs the query.

### Availability

- **PostgreSQL** — shown when a plan has been collected for the statement.
- **SQL Server and Oracle** — not currently available on this surface; use the engine's native plan tools (Query Store, `v$sql_plan`) for plan analysis there.

### Reading it

The plan is presented as the engine produced it. The classic things to scan for: sequential scans on large tables where an index was expected, row-estimate versus reality mismatches, and join strategies that changed since the statement was last fast. Read alongside the trend charts — a mean-time step change with a plan that no longer matches expectations is a plan regression, and the fix is index or statistics work rather than query rewriting.
