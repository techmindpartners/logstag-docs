The number of Oracle objects in this schema whose status is **INVALID** — objects that failed compilation or were invalidated by a change to something they depend on. This tile appears for Oracle.

### How it's calculated

- Oracle marks views, procedures, packages, and similar compiled objects INVALID when their dependencies change; the agent collects the count from `dba_objects` with the schema inventory.

### Reading it

Zero is the target. A transient non-zero after a deployment can self-heal — Oracle often recompiles on next use — but objects that stay invalid are broken code paths waiting for a caller. The Changes tab shows what changed right before the number rose; recompile or fix what remains.
