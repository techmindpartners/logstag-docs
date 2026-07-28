A treemap of the selected schema's objects sized by their storage footprint — the fastest answer to "where does this schema's space live?"

### How to read it

- At the top level, each cell is an object **type group** (tables, indexes, …) sized by the group's total within this schema. Click a group to drill into its individual objects.
- Inside a group, each cell is one object; very small objects (under a quarter percent of the group) roll up into a dashed **Other** cell so the long tail doesn't hide the picture.
- Objects reporting zero size are left out. If everything reports zero — common right after adding a database, before statistics have refreshed — the card says so rather than drawing an empty chart.

### Reading it

A single dominant cell is concentration risk: one table carrying the schema. An index group rivaling the table group means as much space is spent finding data as storing it — sometimes justified, often redundant indexes worth an audit in the objects list below.
