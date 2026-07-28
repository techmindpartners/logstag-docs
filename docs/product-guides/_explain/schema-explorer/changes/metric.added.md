The number of objects that **appeared** in this schema during the selected window — tables, indexes, views, routines, or other tracked object types created since the previous inventory snapshot.

### How it's calculated

- An object present in the latest inventory snapshot but absent from the previous one is recorded as an addition.
- On SQL Server, an object dropped and recreated under the same name between snapshots is recorded honestly as a Removed **and** an Added event — the recreated object is not the same object.

### Reading it

Additions are usually the healthiest change type — migrations creating what they should. Cross-check unexpected additions against the Change History's User column; an addition without a recognized owner or deploy window is worth asking about.
