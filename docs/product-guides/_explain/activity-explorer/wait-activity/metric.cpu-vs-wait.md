The share of active session time spent **on CPU** versus **in a wait**, over the selected window.

### How it's calculated

- Each ASH sample records whether the session was on CPU or waiting on an event at the sampling instant.
- The two percentages are the CPU-sample count and the wait-sample count divided by all samples in the window.

### Reading it

There is no universally "good" ratio — an OLTP system doing index lookups can healthily sit at high CPU, and a batch system streaming from disk will naturally show more IO wait. What matters is *your* baseline: a workload that flips from mostly-CPU to mostly-wait without a code change means something beneath it changed — storage latency, a lost index, or new contention. When wait dominates unexpectedly, the Top Wait Classes card names the culprit category.
