The statement's traffic against the shared buffer cache — the memory all sessions share for regular table and index data.

### Rows

- **Cache hits in period** — block requests served from memory.
- **Hit %** — hits as a share of all block accesses.
- **Read in period** — blocks that had to come from disk.
- **Written in period / Dirtied in period** — blocks this statement wrote or modified, where the engine reports them.

### Availability

PostgreSQL reports these natively per statement. For SQL Server and Oracle, Logstag maps the nearest equivalents — logical and physical read counters — onto the hit and read rows; the write and dirtied rows are PostgreSQL-specific and show a dash elsewhere.

### Reading it

Hit % is the headline: hot statements should live in the high nineties. A low hit rate with a large Read count is the statement paying disk price on every run — and if the Object Sizes treemap shows its table dwarfing memory, no amount of query tuning substitutes for an index that narrows the working set.
