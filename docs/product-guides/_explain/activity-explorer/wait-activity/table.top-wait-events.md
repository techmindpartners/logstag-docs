The individual wait events that consumed the most active session time in the selected window — the event-level detail behind the wait-class bars.

### Columns

- **Event** — the Oracle event name, exactly as Oracle reports it. This is the string to look up in Oracle documentation.
- **Wait class** — the class the event belongs to.
- **Active s** — active session time attributed to the event (ASH sample count, ≈ seconds).
- **Avg in-progress wait** — the average age, in microseconds, of this event's waits *at the moment they were sampled*, for samples where the wait was still running.
- **Completed** — how many sampled waits of this event had already finished when sampled.
- **Completed sum** — the summed duration of those completed waits, in microseconds.

### How it's calculated

- Aggregated from ASH samples in the window; ranked by active session time. The card shows the top events, not an exhaustive list.
- The in-progress and completed columns exist because Oracle fills a wait's duration in only after it ends — a long wait shows up in the in-progress column while it runs, and moves its time into the completed sum only once done.

### Reading it

Rank by Active s and treat the top two or three rows as the story of the window. A large Active s with a small Completed sum means few, long waits still in flight — one stuck resource. A large Active s built from a large Completed count means many short waits — a throughput pattern, usually tuned in the application or schema rather than by hunting a single session.
