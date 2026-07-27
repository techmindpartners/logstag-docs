A single 0–100 score summarizing the database's health, with the five dimension scores that feed it. The ring's color follows the score band, and each dimension row can jump straight to the alerts behind it.

### The dimensions

- **Performance** — query efficiency, resource contention, and throughput.
- **Security** — authentication settings, privilege management, and encryption.
- **Configuration** — server parameter tuning and best-practice settings.
- **Schema** — index coverage, constraint integrity, and object design.
- **Maintenance** — vacuuming, backup status, and replication health.

### How it's calculated

- Each dimension is scored 0–100 from the health signals Logstag evaluates for that area of the engine.
- Overall health is the weighted average of the dimension scores: Performance 30%, Security 25%, Configuration 20%, Schema 15%, Maintenance 10% — the same weights the in-app info icon shows.
- When a dimension is not applicable for an engine, it is excluded and the remaining weights are re-normalized. For Redis and Valkey, Security and Maintenance are not applicable — note that the Schema *dimension* still applies to them even though the Schema *tab* is hidden, because key-design signals are still scored.
- The score bands are: **80–100 Healthy** (green), **60–79 Warning** (amber), **0–59 Critical** (red).
- A database whose metrics have not been collected yet shows a pending state instead of a score.

### Reading it

Treat the overall number as a triage order, not a verdict — two databases at 74 can be amber for entirely different reasons. The dimension rows tell you which area is dragging the score down, and the arrow on a row opens the Alerts tab pre-filtered to exactly the alerts responsible. Fixing the underlying alerts is what moves the score; the score itself is never edited directly.
