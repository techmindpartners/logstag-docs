The number of principals whose privileges on this schema classify as **full access** — read, write, and structural control together.

### How it's calculated

- Logstag classifies each principal's collected privilege flags into a level; a principal holding the full read-write-execute spread for the engine lands here.
- Counted from the most recent permissions snapshot.

### Reading it

This is the tile to keep small. Every principal counted here can read the data, change the data, and change the structure — each one is a full-blast credential if leaked. The classic finding is an application service account with full access when it needs read-write at most; the table below shows exactly which flags earn each principal its level.
