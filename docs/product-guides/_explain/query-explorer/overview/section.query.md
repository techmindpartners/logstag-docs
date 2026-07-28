The statement's full text, syntax-highlighted and formatted for the engine's SQL dialect.

### What you're looking at

- **PostgreSQL** — the text is parameter-normalized by the Logstag agent before it leaves the database host: literal values are replaced with `$1`, `$2`, … placeholders, and the original text with its literals is not retained. What you see is the statement's shape, shared by every execution regardless of values.
- **SQL Server** — the text as the engine's query statistics expose it. Depending on how the application sends statements, it can include literal values.
- **Oracle** — the statement text as Oracle exposes it, capped at a 4,000-character preview; very long statements are marked as truncated. It too can include literal values.

### Reading it

This is the exact shape the metrics on this page describe — one row of statistics per statement shape, not per execution. When the text surprises you (an unexpected join, a missing predicate), you are usually looking at the reason for the numbers above it. Access note for administrators: because SQL Server and Oracle text can carry literal application values, Query Explorer access should track who is allowed to read SQL, not just metrics.
