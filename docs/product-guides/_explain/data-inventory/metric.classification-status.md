How many active databases have completed at least one sensitive-data classification run, out of all active databases in scope.

### How it's calculated

- Served by `GET /api/v1/insights/data-inventory/classification-status`, one row per active database, filtered by the topbar instance filter. Unlike the other KPIs it lists every engine, including ones beyond the classified PostgreSQL, SQL Server, and Oracle.
- A database counts as classified once any classification run for it has completed. The figure after "of" is every active database in scope.
- **N skipped on last run** counts classified databases whose most recent run was skipped. They keep the results of their earlier run, so their tables still count toward the other KPIs.
- Read live, not from the 5-minute KPI cache. Shows `—` when the status can't be read or there are no active databases.

### Statuses and reasons

**View details** lists every database that is not fully classified, with its instance, engine, reason and last attempt. Databases that need attention come first; unsupported engines are listed last.

- **No columns found in the schema catalog**: the current schema snapshot has no columns for the database. It has no tables, or its first snapshot hasn't arrived yet.
- **Too many columns to classify**: the database has more columns than the per-database limit (10,000 by default), so the run is skipped.
- **Classification quota reached**: the classification model's quota ran out. A later run retries.
- **Classification failed**: the run returned an error.
- **No results returned; previous classifications kept**: the model returned nothing while earlier results exist, so those results were kept.
- **Engine not supported yet**: MongoDB, Redis and Valkey are not classified yet.
- **No classification attempt recorded yet**: no run has reached the database so far.

### Reading it

On an estate with MongoDB, Redis or Valkey, a total well above the classified count is expected. Look at PostgreSQL, SQL Server, and Oracle rows first: a database skipped for its column count stays unclassified, or keeps an old result, until its catalog shrinks below the limit. This counts databases; the PDF report's **Classification coverage** counts columns, so the two can differ.
