How many sessions were stuck waiting behind a blocker in the window. This is the human-impact number — each one is a request going nowhere.

### How it's calculated

- Counts distinct sessions observed in a blocked state across all chains.
- A session that is blocked *and* blocking others (amber in the table) is counted once.
- Root blockers are not counted — they are running; everyone else is waiting.

### Example

![Which sessions in a chain are counted](/img/explain/activity-explorer/blocking-chains/counted.svg)

*Two blocked sessions here: 67 waits on 52 while also blocking 71. The root blocker itself is never counted.*

### Reading it

Read it together with **Active Chains**: many blocked sessions in one chain means a single hot resource; one blocked session per chain means scattered contention. Growth here while Active Chains stays flat means a queue is forming behind one blocker.
