The database's object inventory — every table, index, view, and routine the agent has collected, searchable and sortable, largest first by default.

### Columns

- **Name** — the object's name, with a type icon.
- **Type** — the object type badge (table, index, view, procedure, function, trigger, sequence, collection — whichever the engine supports).
- **Schema** — the schema the object belongs to, where the engine has schemas.
- **Status** — object validity where the engine reports it: Oracle objects and index partitions show valid/unusable states, and a warning marker appears when an object's statistics are more than 90 days old.
- **Rows** — the row count, where collected.
- **Size** — the object's storage footprint.

The list can be searched by name, filtered per column, and paginated; column visibility choices persist in your browser.

### How it's calculated

- Rows come from the agent's schema inventory for this database — the same collection that feeds the count tiles above.
- Row counts and sizes are the most recent readings; on engines where statistics drive these numbers, a stale-statistics warning on the Status column means the figures may lag reality.

### Reading it

Sort by Size to find the giants, and by Rows to find the busiest candidates for indexing review. On Oracle, filter the Status column visually for unusable index partitions after bulk loads — they silently stop serving queries until rebuilt. The stale-statistics marker is the quiet one that matters: an optimizer working from 90-day-old statistics makes 90-day-old decisions.
