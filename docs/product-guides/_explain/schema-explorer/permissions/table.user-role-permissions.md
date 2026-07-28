Every user and role with permissions on this schema, with a privilege matrix showing what each can do. Click a row for the full principal detail — granted privileges, role memberships and members, and grant metadata where collected.

### Columns

- **User/Role** — the principal's name.
- **Type** — User (can log in) or Role (groups privileges).
- **Select / Insert / Update / Delete / Truncate / Execute** — the common privilege matrix: a check means the principal holds that privilege somewhere in this schema.

The matrix is **schema-level**: it answers "can this principal do X in this schema," not which individual table each grant sits on. Engines also expose engine-specific privileges beyond these six (ownership and control flags, grant options); the common matrix keeps engines comparable, and the principal detail shows the fuller picture.

### Source by engine

| Engine | Source |
| --- | --- |
| PostgreSQL | `pg_roles` with ACLs from the schema's objects, plus role membership from `pg_auth_members` |
| SQL Server | `sys.database_principals` and `sys.database_permissions` (schema- and object-level grants), with role membership from `sys.database_role_members` |
| Oracle | `dba_users`, `dba_roles`, and object grants from `dba_tab_privs` |
| MongoDB | the `usersInfo` and `rolesInfo` commands — the database is the schema scope |

On Oracle, a principal's detail also lists **instance-wide system privileges** where collected — including `ANY`-style privileges and admin options, which reach beyond this schema and deserve the closest review.

### How it's calculated

- The agent collects permissions with the schema inventory: roughly every 10 minutes on PostgreSQL and MongoDB, every 4 hours on SQL Server and Oracle with default intervals. The table shows the most recent snapshot.

### Reading it

Read it column-first: the Delete and Execute columns are where surprises live. Then read row-first for any principal you don't recognize — its detail shows where the access comes from (direct grant vs inherited role), which is the difference between revoking one grant and restructuring a role.
