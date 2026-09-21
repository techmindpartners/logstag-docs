How many distinct databases appear among the loaded occurrences for this template.

### How it's calculated

- Client-side unique count of `databaseName` over the header page of occurrences (up to 100 rows from `queryAlertsByCode`).
- Same time and instance scope as Occurrences. Can undercount when more than 100 rows span additional databases.

### Reading it

A single-database group often shows the name in the hint. Widen the window or clear instance filters if you expect broader coverage than the tile shows.
