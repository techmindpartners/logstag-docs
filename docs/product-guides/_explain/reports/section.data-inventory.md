Where sensitive data lives right now: classification KPIs, sensitive tables by category, encryption coverage, and a risk-scored register.

### How it's calculated

- Backend kind `DataInventory`. PDF sections: Summary (tables with PII, high-risk, unencrypted, classification coverage), Sensitive tables by category, Encryption coverage, Exceptions worklist, Risk register, Coverage and methodology.
- Snapshot **as of generation** — no time chip. Optional multi-instance filter; empty means organization-wide. Classification currently covers PostgreSQL and SQL Server; encryption status focuses on SQL Server TDE.
- Async PDF delivery only — request form + history on this page.

### Reading it

Fails when no completed classification exists in scope. Prefer org-wide for auditor packs; narrow instances when remediating a single estate slice.
