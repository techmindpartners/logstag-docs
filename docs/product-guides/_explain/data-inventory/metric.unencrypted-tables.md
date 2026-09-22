How many sensitive tables are confirmed unencrypted.

### How it's calculated

- Counts sensitive tables (≥1 classified column) whose encryption status is **Unencrypted**. Tables with status **Unknown** are excluded from this count, not treated as unencrypted.
- Only SQL Server carries a real encryption value, from the database's transparent data encryption (TDE) flag. Every other engine reports **Unknown**, so in practice this KPI counts SQL Server tables without TDE.
- Respects the topbar instance filter and the shared 5-minute KPI cache.

### Reading it

Zero does not mean everything is encrypted — it can mean nothing sensitive is on SQL Server yet, or that TDE status hasn't been read. Check the list's Encryption column, where PostgreSQL tables always show "—".
