What each role can do across Logstag.

### How it's calculated

- **Admin** and **SuperAdmin** hold every permission: managing members, billing, API keys, databases, agents, alerts, and integrations, plus viewing databases, alerts, billing, and audit logs.
- **DBA** holds ManageDatabases, ViewDatabases, ManageAlerts, and ViewAlerts — full control over monitored databases and alerting, but no access to members, billing, or audit logs.
- **Dev** holds ViewDatabases and ViewAlerts only — read access to monitoring, no management actions.
- **Billing** holds ManageBilling and ViewBilling only — access to billing screens and nothing else in the product.
- Roles are assigned per member from the Invite or Edit dialog. A member can only ever hold one role at a time.

### Reading it

Permission, not role name, is what actually gates a screen — for example Audit Logs is gated by the ViewAuditLogs permission, which today only Admin and SuperAdmin carry. Assign the narrowest role that covers what a member needs to do.
