Where sensitive data lives right now across monitored databases: KPIs, a risk-scored table of sensitive tables, and filters to narrow by engine, schema, or search.

### How it's calculated

- Scope: PostgreSQL, SQL Server, and Oracle are the only classified engines today. MongoDB, Redis, and Valkey are selectable in the Engine filter but labelled "Not classified yet" and return no rows.
- Classification runs from schema metadata only: schema, table, column name, and data type. No row values are read. A model assigns up to 4 categories per column, each kept at confidence ≥ 50%.
- A daily sweep and schema-change events keep results current; there is no manual trigger. KPIs and the table respect the topbar instance filter and are cached for about 5 minutes; **Classified Databases** is read live.
- The surface is marked **Beta**.

### Reading it

Start at the KPI strip for the exposure numbers, and check **Classified Databases** for databases the other numbers don't cover yet. Then work the Sensitive Tables list (sorted by risk by default) to triage. The same data is available as a point-in-time PDF under Reports.
