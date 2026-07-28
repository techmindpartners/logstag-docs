How many rows this statement produced during the selected window, where the engine reports row counts.

### How it's calculated

- Summed from the engine's per-statement row counters across the window: `pg_stat_statements` rows on PostgreSQL, row counts from the query statistics on SQL Server, `rows_processed` on Oracle.
- The trend compares against the preceding window; a dash means the engine did not report row counts for this statement.

### Reading it

Rows per call is the ratio to watch: divide by Calls in Period. A statement returning thousands of rows per call to an application that displays twenty is shipping data nobody reads — pagination or a tighter predicate fixes more than index tuning would.
