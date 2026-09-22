What share of the classified catalog's columns are sensitive.

### How it's calculated

- Sensitive columns divided by all live catalog columns, as a percentage to 1 decimal, on PostgreSQL and SQL Server only. The hint below the number shows the raw sensitive-column count.
- Shows "—" when the total can't be read, is 0, or comes back smaller than the sensitive count. An organization with no classifications at all shows **0.0%**, not "—".
- This is density across the whole catalog, not coverage. **Classification coverage** — the share of columns in databases with at least one completed run — is a related but different number shown only in the Data Inventory PDF report.

### Reading it

Rising density can mean either newly classified sensitive columns or a shrinking denominator (fewer live catalog columns). Pair with **Tables With PII** to see whether the change is concentrated in a few tables.
