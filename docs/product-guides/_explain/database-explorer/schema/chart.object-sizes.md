A treemap of the database's objects sized by their storage footprint — the fastest answer to "where does the space live?"

### How to read it

- At the top level, each cell is an object **type group** (tables, indexes, collections, …) sized by the group's total. Click a group to drill into its individual objects.
- Inside a group, each cell is one object; very small objects (under a quarter percent of the group) roll up into a dashed **Other** cell so the long tail doesn't hide the picture.
- Objects reporting zero size are left out. If everything reports zero — common right after adding a database, before statistics have refreshed — the card says so rather than drawing an empty chart.

### Reading it

Two shapes are worth recognizing. A single dominant cell is concentration risk: one table carrying the database, worth watching in the trend charts. And an index group rivaling the table group in size means the database spends as much space on finding data as on storing it — sometimes justified, often a sign of redundant indexes worth an audit in the objects list below.
