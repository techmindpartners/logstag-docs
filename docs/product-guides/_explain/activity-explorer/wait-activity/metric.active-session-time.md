The total time sessions spent **actively working** — on CPU or in a wait — during the selected window, derived from Oracle's Active Session History (ASH).

### How it's calculated

- Oracle samples every active session roughly once per second into `v$active_session_history`; each sample represents about one second of active session time.
- **Active session time = the number of ASH samples in the window.** One session active for 60 seconds contributes ~60; three sessions active for 20 seconds each contribute the same.
- The Logstag agent exports the ASH buffer once a minute, reading a trailing five-minute slice each time.

### Requirements

ASH is part of Oracle's Diagnostics Pack. This tab has data when the database edition and the `control_management_pack_access` parameter permit it (Enterprise and Free editions qualify; Standard, Express, and Personal do not). Without it, the tab reports no ASH data — that is a licensing state, not a collection failure.

### Reading it

This is Oracle's own measure of database load, in units of "session-seconds of work." Divide it by the window length to get average active sessions — the number Oracle tuning literature compares against CPU count. The CPU vs Wait split tells you whether that time was productive or spent waiting.
