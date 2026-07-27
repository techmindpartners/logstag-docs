The summed duration of waits that **finished** within the sampled window, shown in microseconds. It is a reference figure, deliberately secondary to Active session time.

### How it's calculated

- Each ASH sample carries `time_waited` — the duration of the wait, filled in only once the wait has **completed**. While a wait is still in progress, Oracle reports it as zero.
- This tile sums those completed-wait durations across the window's samples.

### Why it's "reference only"

Summing `time_waited` systematically undercounts: the longest, most interesting waits are precisely the ones still in progress when sampled, and they contribute zero. That is why Logstag measures activity by **sample count** (Active session time) instead, and keeps this sum visible only as a cross-check. If the completed-wait sum is small while wait-side Active session time is large, long in-flight waits are dominating — usually the signal to look at the Top Wait Events card's in-progress column.
