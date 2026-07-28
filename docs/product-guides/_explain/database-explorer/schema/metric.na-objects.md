The number of Oracle objects whose validity status is **N/A** — objects Oracle reports without a valid/invalid state. This tile appears for Oracle databases.

### How it's calculated

- Some object kinds carry no validity in `dba_objects` — synonyms are the common case, and partitioned indexes track usability separately per partition. The agent counts them as reported.

### Reading it

This tile is informational, not a health signal: N/A means "validity does not apply," not "unknown problem." A stable non-zero here is the normal state for databases using synonyms or partitioning. For partitioned indexes specifically, the object inventory's Status column is where per-partition usability shows up.
