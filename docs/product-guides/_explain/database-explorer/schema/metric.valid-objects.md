The number of Oracle objects whose status is **VALID** — compiled, usable, and serving queries. This tile appears for Oracle databases.

### How it's calculated

- Oracle tracks a validity status for every object in `dba_objects`; the agent collects the count of VALID objects with the schema inventory.

### Reading it

In a healthy database this number equals the object total, making the tile pleasantly boring. Its real job is to be the denominator: when Valid drops while Invalid rises, a dependency change just broke compiled objects — and the two tiles together tell you how many.
