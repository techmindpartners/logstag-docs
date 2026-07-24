The longest time any single session spent waiting on a lock inside the time window. It is a **peak, not an average** — one bad wait sets this number.

### How it's calculated

- Each sample records every blocked session's accumulated wait time.
- The tile keeps the maximum across all sessions and all samples in the window.
- The value auto-scales to the largest sensible unit — `10.8 s` rather than `10800 ms`.

### Example

![Lock wait durations with the maximum highlighted](/img/explain/activity-explorer/blocking-chains/peak-bars.svg)

*Three blocked sessions in the window — the tile reports only the tallest bar, the single worst wait.*

### Reading it

Compare it against your application's command timeout (commonly 30 s). A longest block approaching that line means requests **failed**, not just slowed down. The tile turns red when the window is marked Critical.
