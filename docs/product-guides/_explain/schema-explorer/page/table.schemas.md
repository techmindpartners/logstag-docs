One row per monitored schema with its database and hosting instance. Click a row to open the schema's detail view.

### Columns

- **Schema** — the schema's name with its engine icon.
- **Database** — the database the schema belongs to. Filterable by database.
- **Instance** — the hosting instance. The top bar's instance selector scopes this page, so the column itself has no separate filter.
- **Size** — the schema's storage footprint. Filterable by range.
- **Alerts** — active alert counts as severity chips: Critical, High, Medium, Low.

The list can be searched by schema, database, or instance name, filtered by engine, sorted by most columns, and paginated. Column visibility choices persist in your browser.

### Reading it

Two scans cover most sessions: by Size for capacity review, and by Alerts for structural findings that need attention. Because MongoDB represents each database as one schema row, a MongoDB "schema" here is the whole database — its size and alerts read accordingly.
