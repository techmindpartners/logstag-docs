The number of Oracle objects whose status is **INVALID** — objects that failed compilation or were invalidated by a change to something they depend on. This tile appears for Oracle databases.

### How it's calculated

- Oracle marks views, procedures, packages, and similar compiled objects INVALID when their dependencies change; the agent collects the count from `dba_objects` with the schema inventory.

### Reading it

Zero is the target. Oracle often recompiles an invalid object automatically on next use, so a transient non-zero after a deployment can self-heal — but objects that stay invalid are broken code paths waiting for a caller. Cross-reference the Changes tab for what changed right before the number rose, and recompile or fix what remains.
