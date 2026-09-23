Agent version and how often this instance is collected.

### How it's calculated

- Shown only once an agent has connected; before that, the card says there is no collection configuration to show yet.
- **Agent version** and **Status** (Active/Inactive) come from the agent's own reporting. **Last seen** is a relative timestamp of the agent's most recent check-in.
- **Collection interval** shows the High, Medium, and Low frequency intervals in seconds or minutes — these control how often different classes of metrics are gathered for this instance.
- **Update channel** shows the agent's update channel, with "(checks off)" appended when automatic update checks are disabled for it.

### Reading it

An Inactive status with a recent Last seen usually means the agent process stopped cleanly rather than lost connectivity — cross-check against the Connection & Agent section above before assuming a network issue.
