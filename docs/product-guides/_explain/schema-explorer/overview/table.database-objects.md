The selected schema's object inventory — every table, index, view, and routine the agent has collected for it, searchable and sortable, largest first by default.

### Columns

- **Name** — the object's name, with a type icon.
- **Type** — the object type badge (table, index, view, procedure, function, trigger, sequence, collection — whichever the engine supports).
- **Status** — object validity where the engine reports it: Oracle objects and index partitions show valid/unusable states, and a warning marker appears when an object's statistics are more than 90 days old.
- **Rows** — the row count, where collected.
- **Size** — the object's storage footprint.

The list can be searched by name, filtered by type, and paginated; column visibility choices persist in your browser.

### How it's calculated

- Rows come from the agent's schema inventory, scoped to this schema — the same collection that feeds the count tiles above.
- Row counts and sizes are the most recent readings; a stale-statistics warning means the figures may lag reality.

### Reading it

Sort by Size for the giants and by Rows for indexing-review candidates. On Oracle, watch for unusable index partitions after bulk loads — they silently stop serving queries until rebuilt. The stale-statistics marker matters most: an optimizer working from 90-day-old statistics makes 90-day-old decisions.
