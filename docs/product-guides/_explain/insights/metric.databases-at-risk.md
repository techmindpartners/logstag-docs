How many distinct databases have at least one finding in the current scope.

### How it's calculated

- Counts distinct databases across all findings that match the topbar instance and time filters.
- Counts every state (Active, Dismissed, and No longer detected), and ignores the status tabs and the chip filters below. Switching tabs does not change this number.
- A finding counts toward the selected window if it was active at any point in it.

### Reading it

This is the blast radius, not a severity score: one database with ten findings counts once. Filter the list to Active to see which of these databases still have open work.
