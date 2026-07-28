The number of objects whose **structure changed** during the selected window — same object, different definition.

### How it's calculated

- An object present in both consecutive inventory snapshots with differing structural metadata is recorded as modified.
- Only *structural* differences count: on MongoDB, a collection is modified when its index count or collection options change — document counts and sizes drifting does **not** produce change events. On SQL Server, modification is detected through a structural fingerprint of the object's definition.
- Opening a modified row shows the property-level differences — each changed property with its old and new value.

### Reading it

Modifications carry the most risk of the three types, because the object keeps its name while behaving differently — a column type change or a rebuilt index affects every query that touches it. The property-level diff in the row detail tells you exactly what to review.
