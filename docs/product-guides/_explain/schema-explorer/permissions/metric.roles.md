The number of **role principals** with permissions on this schema — groupings that hold privileges and pass them to their members, rather than identities that log in.

### How it's calculated

- The agent collects roles from the engine's catalogs: PostgreSQL roles without login, SQL Server database roles, Oracle roles, MongoDB roles from the `rolesInfo` command.
- Counted from the most recent permissions snapshot for this schema.

### Reading it

Healthy setups have few, well-named roles and many members. Many roles with one member each is permission management by copy-paste — every access review gets harder. Click a role in the table to see its members and what it inherits.
