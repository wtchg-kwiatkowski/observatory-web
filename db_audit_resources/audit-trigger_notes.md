# Notes on development of the db audit logs

Used this web page as a starting point: https://wiki.postgresql.org/wiki/Audit_trigger
```
A more powerful audit trigger for PostgreSQL 9.1+ only is available [at the Audit Trigger for PostgreSQL 9.1plus snippet page](https://wiki.postgresql.org/wiki/Audit_trigger_91plus).
```

To see the version of PostgreSQL server installed, log into the machine and type:
`/usr/lib/postgresql/9.6/bin/postgres -V`

At time of writing: `postgres (PostgreSQL) 9.6.3`

Advice about configuring suitable roles: https://wiki.postgresql.org/wiki/Audit_trigger_91plus
```
If you want this audit log to be trustworthy, your app should run with a role that has at most USAGE to the audit schema and SELECT rights to audit.logged_actions. Most importantly, your app must not connect with a superuser role and must not own the tables it uses. Create your app's schema with a different user to the one your app runs as, and GRANT your app the minimum rights it needs.
```

To obtain the audit-trigger script:
```
You can obtain the latest version of the audit trigger [from GitHub](https://github.com/2ndQuadrant/audit-trigger).
```


https://github.com/2ndQuadrant/audit-trigger

https://github.com/2ndQuadrant/audit-trigger/blob/master/audit.sql

Added the submodule to the git repo:
```
mkdir submodules
cd submodules
git submodule add -b master https://github.com/2ndQuadrant/audit-trigger.git
```

To checkout the submodule:
```
git submodule update --init --recursive
```

At time or writing, there are logged issues (and unmerged PRs) around the problem of running the script on other schemas, which is what we want (ideally).
https://github.com/2ndQuadrant/audit-trigger/pull/20/files

Modifications (as suggested by that PR) have been applied to the version of the SQL script: `db_audit_resources/audit.sql`


As mentioned in the dev notes of db_backup_resources, one way to get these config resources onto the observatory-db machine is to clone this config into your home directory. To clone this repo into your home directory, log in to the observatory-db machine and type:
```
cd ~
git clone https://github.com/wtchg-kwiatkowski/observatory-web.git

```


Before executing `audit.sql`, make sure that the Observatory database is backed up and that the backups work.

See the dev notes in `db_backup_resources` on how to check that backups are working.

For more info on how and which audit logs are made, see `audit.sql`.

The audit triggers need to be applied to every table that needs to be audited.

From: https://wiki.postgresql.org/wiki/Audit_trigger_91plus
```
SELECT audit.audit_table('target_table_name');
The table will now have audit events recorded at a row level for every insert/update/delete, and at a statement level for truncate. Query text will always be logged.
```

Finer control (if required) can be achieved by:
```
If you want finer control use audit.audit_table(target_table regclass, audit_rows boolean, audit_query_text boolean, excluded_cols text[]) or CREATE TRIGGER the audit trigger yourself. For example:
SELECT audit.audit_table('target_table_name', 'true', 'false', '{version_col, changed_by, changed_timestamp}'::text[]);
... would create audit triggers on target_table_name that record each row change but omit the query text (the 'false' argument) and omit the version_col, changed_by and changed_timestamp columns from logged rows. An UPDATE that only changes ignored columns won't result in an audit record being created at all.
```

A specific audit trigger can be removed from a specific table by:
```
DROP TRIGGER audit_trigger_row ON target_table_name;
DROP TRIGGER audit_trigger_stm ON target_table_name;
```

We want a way to apply triggers to all tables that do not already have triggers applied.


To get a list of all the table names in a schema:
```
SELECT tablename
FROM pg_tables
WHERE schemaname = 'observatory'
  AND tablename NOT LIKE 'pg_%' 
  AND tablename NOT LIKE 'sql_%' 
ORDER BY tablename;
```

To create the audit triggers for specific tables:
```
SELECT audit.audit_table('countries');
\df countries
```

You should see a message like this:
```
NOTICE:  trigger "audit_trigger_row" for relation "observatory.countries" does not exist, skipping
CONTEXT:  SQL statement "DROP TRIGGER IF EXISTS audit_trigger_row ON observatory.countries"
PL/pgSQL function audit.audit_table(regclass,boolean,boolean,text[]) line 7 at EXECUTE
NOTICE:  trigger "audit_trigger_stm" for relation "observatory.countries" does not exist, skipping
CONTEXT:  SQL statement "DROP TRIGGER IF EXISTS audit_trigger_stm ON observatory.countries"
PL/pgSQL function audit.audit_table(regclass,boolean,boolean,text[]) line 8 at EXECUTE
NOTICE:  CREATE TRIGGER audit_trigger_row AFTER INSERT OR UPDATE OR DELETE ON observatory.countries FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true');
NOTICE:  CREATE TRIGGER audit_trigger_stm AFTER TRUNCATE ON observatory.countries FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true');
 audit_table 
-------------
 
(1 row)

```



To set up auditing, log in to the observatory-db machine and type:
```
cd ~/observatory-web

sudo cp ~/observatory-web/db_audit_resources/audit.sql /var/lib/postgresql/scripts/
sudo chown postgres:postgres /var/lib/postgresql/scripts/audit.sql
sudo -u postgres psql observatory
\i ~/scripts/audit.sql
\dt audit.
\dt observatory.
SELECT audit.audit_table('observatory.countries');
SELECT audit.audit_table('observatory.features');
SELECT audit.audit_table('observatory.featuretypes');
SELECT audit.audit_table('observatory.identified_strains');
SELECT audit.audit_table('observatory.identified_straintypes');
SELECT audit.audit_table('observatory.regions');
SELECT audit.audit_table('observatory.samples');
SELECT audit.audit_table('observatory.sampletypes');
SELECT audit.audit_table('observatory.sites');
```

To see the list of active triggers (There should be a `_row` trigger and a statement `_stm` trigger for each table.) :
```
SELECT nspname, relname, tgname, proname from pg_trigger
JOIN pg_proc ON pg_proc.oid = pg_trigger.tgfoid
JOIN pg_class ON pg_class.oid = pg_trigger.tgrelid
JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
WHERE tgname LIKE 'audit_trigger_%';
```

To exit the psql CLI type `\q` and enter.

To remove the audit and all logs for a schema (See above for dropping triggers.):
```
DROP SCHEMA audit CASCADE;
```
