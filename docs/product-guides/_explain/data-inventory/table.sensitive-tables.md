Every table with at least one sensitive column, ranked by computed risk.

### How it's calculated

- Only tables with ≥1 classified column appear. Default sort is Risk descending; 20 rows per page.
- Columns: Database, Instance, Table, Data types (first 3 categories, then "+N" for the rest), Encryption, Access level, Risk.
- Sortable columns: Database, Instance, Table, Encryption, Risk. Header-menu filters are available on Database, Encryption, and Risk, on top of the Filters row above.
- Access level is per schema: every table in a schema shows the same value, like "Low (2 roles)". It counts who can read, write or manage tables in the schema, with PUBLIC (everyone) as one; Logstag's own monitoring login and built-in roles are left out. "Everyone (N roles)" means PUBLIC has rights on tables there; "Unknown" means no grants were read for the schema.

### Reading it

Click a row to open the table's detail view for its full column-level classification. Sort by Risk to triage, or filter by Encryption to find sensitive tables still missing TDE.
