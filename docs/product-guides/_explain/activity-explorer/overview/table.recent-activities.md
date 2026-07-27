A rolling record of notable activity on this database — recent operations with who ran them, on what, and how they ended.

### Columns

- **Timestamp** — when the activity was recorded.
- **Type** — the kind of activity. The available types depend on the engine and the runtime data it exposes.
- **Object** — the database object involved, when one applies.
- **User** — the database user associated with the activity.
- **Status** — the outcome, shown as a badge.
- **Duration** — how long the activity took.

The list can be searched, filtered per column, and paginated.

### How it's calculated

- Rows come from the runtime activity the agent collects for this database in the selected window, most recent first.

### Reading it

Use it as the "what just happened here?" feed. When a metric tile above spikes, the matching timestamps in this table usually name the operation responsible. Filtering by user or object turns it into a quick answer for "who touched this table recently" — for a permanent, security-oriented record, Audit Logs is the right surface; this list is operational and scoped to the selected window.
