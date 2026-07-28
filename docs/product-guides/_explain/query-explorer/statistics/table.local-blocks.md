The statement's traffic against local buffers — PostgreSQL's per-session memory for temporary tables.

### Rows

Same shape as Shared Blocks — cache hits, hit percentage, reads, writes, and dirtied blocks — but counted against session-local buffers instead of the shared cache.

### Availability

Local buffers are a PostgreSQL concept; this card shows dashes for SQL Server and Oracle, and for PostgreSQL statements that never touch temporary tables.

### Reading it

Nonzero local-block traffic means the statement uses temporary tables. That is often fine by design — but a statement with heavy local *reads* is churning through temp data larger than its local buffer allowance, and a statement whose local traffic appeared out of nowhere usually gained a temp-table step in a recent code change worth a look in the Changes-aware views.
