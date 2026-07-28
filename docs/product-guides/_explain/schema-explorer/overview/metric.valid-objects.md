The number of Oracle objects in this schema whose status is **VALID** — compiled, usable, and serving queries. This tile appears for Oracle.

### How it's calculated

- Oracle tracks a validity status for every object in `dba_objects`; the agent collects the count of VALID objects with the schema inventory.

### Reading it

In a healthy schema this equals the object total. Its job is to be the denominator: when Valid drops while Invalid rises, a dependency change just broke compiled objects in this schema — the two tiles together say how many, and the Changes tab says what changed.
