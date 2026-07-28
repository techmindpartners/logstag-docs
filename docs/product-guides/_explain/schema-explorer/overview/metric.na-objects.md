The number of Oracle objects in this schema whose validity status is **N/A** — objects Oracle reports without a valid/invalid state. This tile appears for Oracle.

### How it's calculated

- Some object kinds carry no validity in `dba_objects` — synonyms are the common case, and partitioned indexes track usability separately per partition. The agent counts them as reported.

### Reading it

Informational, not a health signal: N/A means "validity does not apply," not "unknown problem." A stable non-zero is normal for schemas using synonyms or partitioning; per-partition index usability shows up in the object inventory's Status column instead.
