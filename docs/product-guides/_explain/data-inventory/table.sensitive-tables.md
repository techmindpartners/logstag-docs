Every table with at least one sensitive column, ranked by computed risk.

### How it's calculated

- Only tables with ≥1 classified column appear. Default sort is Risk descending; 20 rows per page.
- Columns: Database, Instance, Table, Data types (first 3 categories, then "+N" for the rest), Encryption, Access level, Risk.
- Sortable columns: Database, Instance, Table, Encryption, Risk. Header-menu filters are available on Database, Encryption, and Risk, on top of the Filters row above.
- Access level is per schema — every table in a schema shows the same value, labelled like "High (12 roles)" from distinct roles in the latest permissions snapshot.

### Reading it

Click a row to open the table's detail view for its full column-level classification. Sort by Risk to triage, or filter by Encryption to find sensitive tables still missing TDE.
