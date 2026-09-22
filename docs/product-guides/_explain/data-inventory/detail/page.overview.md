The classification detail for one table: risk badge, summary, and every sensitive column found.

### How it's calculated

- Reached by clicking a Sensitive Tables row. Heading is `schema.table` with the same risk badge and bucket as the list, plus a "Classified …" relative timestamp from the table's latest classification time.
- Summary shows Database, Instance, Encryption, Access level, Sensitive columns as "N / M" (sensitive vs. total columns in the table), and Engine.
- The Sensitive columns table lists only columns with ≥1 assigned category, each with its categories and confidence percentage.

### Reading it

Confidence is per column, not per table — a low score on one column doesn't lower the others. Use "N / M" to gauge how concentrated sensitivity is before deciding whether the whole table needs remediation.
