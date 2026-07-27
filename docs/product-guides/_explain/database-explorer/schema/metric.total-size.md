The combined size of the database's objects, summed from the most recent size reading of each object in the selected window.

### How it's calculated

- The agent collects per-object size metrics on its schema-collection cadence; this tile sums the latest reading per object.
- It can differ slightly from the Overview tab's Database Size tile, which asks the engine for the database's own size figure — that number includes engine overhead the per-object sum does not.

### Reading it

Use it together with the treemap next to it: the tile says how much, the treemap says where. If Total Size grows while the object count stays flat, existing objects are growing — usually a handful of them, which the treemap makes obvious.
