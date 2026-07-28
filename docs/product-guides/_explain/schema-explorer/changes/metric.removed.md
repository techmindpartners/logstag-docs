The number of objects that **disappeared** from this schema during the selected window.

### How it's calculated

- An object present in the previous inventory snapshot but gone from the latest one is recorded as a removal.
- On SQL Server, a drop-and-recreate under the same name records as a Removed plus an Added pair rather than a modification.

### Reading it

Removals deserve the fastest review of the three types: a dropped table or index is either a planned cleanup or an incident, and nothing in between. If a removal surprises you, the object's last-known definition is preserved in the change record — open the row detail before anyone recreates it from memory.
