Every table with at least one sensitive column, ranked by computed risk.

### How it's calculated

- Only tables with ≥1 classified column appear. Default sort is Risk descending; 20 rows per page.
- Columns: Database, Instance, Table, Data types (first 3 categories, then "+N" for the rest), Encryption, Access level, Risk.
- Sortable columns: Database, Instance, Table, Encryption, Risk. Header-menu filters are available on Database, Encryption, and Risk, on top of the Filters row above.
- Access level is per schema: every table in a schema shows the same value, like "Medium (3 users)": None (0), Low (1 to 2), Medium (3 to 5), High (6 to 10), Very high (more than 10), the same steps as the risk score. It counts the users who can read, write or manage tables in the schema: a role counts as the users in it, and users who read or write every table count too (PostgreSQL pg_read_all_data / pg_write_all_data members; SQL Server db_datareader and db_datawriter members). Admins who manage every table are not counted (PostgreSQL superusers; SQL Server sysadmins, db_owner members and the database owner): they reach every table of every database, so they say nothing about one table. "Admins only (N admins)" means only such admins have rights there. Logstag's own monitoring login and built-in accounts are left out. "Everyone" means PUBLIC has rights on tables there; "Unknown" means nothing was read for the schema or its database.

### Reading it

Click a row to open the table's detail view for its full column-level classification. Sort by Risk to triage, or filter by Encryption to find sensitive tables still missing TDE.
