Narrows the Sensitive Tables list by search text, engine, and schema.

### How it's calculated

- **Search** matches database, table, or instance name, debounced as you type.
- **Engine** is a multi-select chip; unclassified engines are shown but labelled "Not classified yet".
- **Schema** is a multi-select chip populated only with schemas already present in the inventory — it can't be used to browse schemas that have no classified table.
- **Clear filters** resets all of the above. The topbar instance filter and the table's own header-menu filters (Database, Encryption, Risk) apply on top of this row. Filter state is kept in the URL, so a filtered view is shareable.

### Reading it

Combine Engine and Schema to scope a review to one part of the estate before sorting the table by Risk. A cleared filter row still respects the topbar instance selection.
