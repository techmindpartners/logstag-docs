The combined size of the selected schema's objects, summed from the most recent size reading of each object in the selected window.

### How it's calculated

- The agent collects per-object size metrics on its schema-collection cadence; this tile sums the latest reading per object within the schema.
- The same tile on the Database Explorer's Schema tab covers the whole database; here it is scoped to one schema.

### Reading it

Read it with the treemap next to it: the tile says how much, the treemap says where. A schema growing while its object count stays flat means existing objects are growing — usually a handful, which the treemap makes obvious.
