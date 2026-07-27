The wait classes that consumed the most active session time in the selected window, as a horizontal bar per class.

### How it's calculated

- Every ASH sample taken during a wait carries Oracle's **wait class** for that event — Oracle's own native taxonomy (`User I/O`, `Concurrency`, `Commit`, `Network`, and so on), not Logstag's shared five-category model used on the Wait Events tab.
- Each class's bar is its sample count (≈ seconds of active session time), with the percentage of all wait samples alongside.
- Samples taken on CPU belong to no wait class; when every sample was on CPU, this card reports no waits — that is a healthy result, not missing data.

### Reading it

This is the standard first cut of Oracle wait tuning: name the dominant class, then drill into its events. `User I/O` dominance points at storage or missing indexes; `Concurrency` at latch and lock contention; `Commit` at redo-log write latency; `Network` at round-trips to slow clients. The Top Wait Events card breaks the leading class into its specific events.
