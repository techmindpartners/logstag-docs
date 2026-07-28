The number of **user principals** with permissions on this schema — identities that can log in, as opposed to roles that only group privileges.

### How it's calculated

- The agent collects principals from the engine's own catalogs: PostgreSQL roles that can log in, SQL Server database users, Oracle users, MongoDB users from the `usersInfo` command.
- Counted from the most recent permissions snapshot for this schema.

### Reading it

Compare it against your team's size plus the service accounts you know about. A count that outgrows that sum means credentials are accumulating — former staff, one-off debugging accounts, or copies of service users. The table below names each one.
