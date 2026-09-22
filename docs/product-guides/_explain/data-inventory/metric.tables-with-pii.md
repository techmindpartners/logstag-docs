How many classified tables have at least one column flagged as PII.

### How it's calculated

- Counts distinct tables with ≥1 column classified into the **PII** category specifically — the other 7 categories (Financial, Credentials, Payment, Health, Location, Legal, HR) don't count toward this KPI.
- Only PostgreSQL and SQL Server tables are classified, so this is a lower bound on the real estate, not organization-wide coverage.
- Respects the topbar instance filter. Cached for about 5 minutes and refreshed after each successful classification run.

### Reading it

A rising count without a matching schema change usually means the daily sweep reached a database for the first time. Cross-check against **Sensitive Column Density** to see whether PII is concentrated or spread thin.
