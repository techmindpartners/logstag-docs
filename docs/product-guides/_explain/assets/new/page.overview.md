A three-step wizard that registers a database server and walks through agent installation and connection verification.

### How it's calculated

- Reaching this page requires the **ManageDatabases** permission, the same gate as the rest of Assets — Admin, SuperAdmin, and DBA hold it by default.
- **Step 1 — Configure**: pick an engine, an instance name (required, unique within the organization), an environment (defaults to Production when left blank), and an optional owner. Submitting creates the instance record before any agent exists.
- **Step 2 — Install agent**: choose hosting type (Self-Hosted or Cloud, with AWS RDS and Huawei Cloud active and Azure/GCP marked as coming soon), platform (Linux or Windows), and connection type — Direct is the only connection type available today; Bridged is shown but disabled. These choices build the copyable install command. A separate "Generate Token" action creates the one-time authentication token the install command needs; it can be regenerated if the original expires or is lost.
- **Step 3 — Connected**: starting a connection test polls its status roughly every 5 seconds; a successful result advances the wizard automatically and finishing returns to the Assets list.

### Reading it

The instance record exists as soon as Step 1 completes, even if setup is abandoned afterward — it will show as Disconnected in the Assets list until the agent installs and a connection test passes. Re-run the wizard's install step from the asset's own Connection & Agent section if setup needs to be redone later.
