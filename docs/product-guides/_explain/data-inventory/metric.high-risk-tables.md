How many sensitive tables carry a High or Critical computed risk score.

### How it's calculated

- Risk = 0.5 × sensitivity + 0.3 × encryption + 0.2 × access, bucketed as Critical (≥0.75), High (≥0.55), Medium (≥0.35), or Low. This KPI counts the Critical and High buckets.
- Sensitivity comes from the table's highest-sensitivity category — Credentials and Payment score highest, then Health, then PII and Financial.
- Encryption and access-level inputs are described under **Unencrypted Tables** and the Sensitive Tables table. Respects the topbar instance filter and the same 5-minute cache as the other KPIs.

### Reading it

A table can be High risk from access alone, even when encrypted — check the row's Access level column before assuming encryption is the gap. Open a row for the full breakdown.
