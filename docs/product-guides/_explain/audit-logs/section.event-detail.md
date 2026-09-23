The full context for one recorded action, opened by selecting its row.

### How it's calculated

- Always shown: Time, User (email, falling back to user ID), Role (the user's role at the time of the action), Controller, Action, Duration in milliseconds, and an **Impersonating** badge when the action was performed through an impersonation session.
- Shown only when present: Entity (type and ID), Client IP, a query string block, a request body block, and a user agent string.
- Request body is parsed and pretty-printed as JSON when possible; sensitive values are sanitized before they're stored, so the panel never exposes secrets or monitored-database content — only what type of change was made.

### Reading it

Check the Impersonating badge before treating an action as the named user's own — it distinguishes direct activity from actions taken on a member's behalf during support or administrative access. Use Client IP and User Agent together when tracing where a request actually originated.
