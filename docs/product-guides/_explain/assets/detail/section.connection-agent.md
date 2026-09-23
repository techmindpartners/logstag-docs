How the agent reaches this server, plus a live connectivity check.

### How it's calculated

- The panel's opening state follows the instance's own signals: no agent ID means first-time setup, an agent ID with an inactive instance means disconnected, and an agent ID with an active instance means connected and collapsed.
- The summary strip shows Hosting (Self-Hosted or Cloud, plus provider when cloud), Connection (Direct — Bridged is planned but disabled today), and Platform (Linux or Windows). Editing these regenerates the install command shown below them.
- "Run a connection test" starts an async check and polls its status roughly every 5 seconds for up to about 100 seconds before timing out. A passing test refreshes the instance, its configuration, and the header's Connected badge together, so all three agree without a manual reload.
- A disconnected instance never collapses this card — the retest prompt and guidance stay visible until a test passes.

### Reading it

If the instance shows Disconnected, re-run the install command before retesting — a stale registration token or an agent process that stopped running are the most common causes. A successful test is what flips the instance back to Connected; simply waiting does not.
