How many sensitive tables carry a High or Critical computed risk score.

### How it's calculated

- Risk = sensitivity × exposure, bucketed as Critical (≥0.75), High (≥0.55), Medium (≥0.35), or Low. This KPI counts the Critical and High buckets.
- Sensitivity is the table's most sensitive kind of data: Credentials and Payment 1.0, Health 0.9, PII and Financial 0.8, HR and Legal 0.6, Location 0.4.
- Exposure = 0.5 + 0.5 × access. Access is 1.0 when everyone (PUBLIC) has rights on tables in the schema (the Access level column says "Everyone"); otherwise it follows the number in the Access level column: none 0, 1–2 0.2, 3–5 0.4, 6–10 0.7, more than 10 1.0. When no grants were read, access counts as 0.
- Encryption is shown in its own column but doesn't change the score. Respects the topbar instance filter and the same 5-minute cache as the other KPIs.

### Reading it

A table needs both sensitive data and people with rights on it to rank high: with nobody known, sensitive data stays Medium at most. Credentials or Payment with even one is High; PII or Financial needs 3 or more for High, and more than 10 or everyone for Critical. Open a row to see who has rights in its schema.
