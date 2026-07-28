The number of principals whose privileges on this schema classify as **read-only** — they can query, and nothing else.

### How it's calculated

- Logstag classifies each principal's collected privilege flags into a level; principals holding select-style privileges without write or structural flags land here.
- Counted from the most recent permissions snapshot.

### Reading it

A healthy number here is a good sign — it means reporting tools, analysts, and dashboards were given the least privilege that works. If this tile is near zero while Full Access is not, read-only consumers are probably borrowing write-capable credentials, which is the finding worth fixing first.
