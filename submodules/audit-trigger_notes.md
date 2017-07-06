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

As mentioned in the dev notes of db_backup_resources, one way to get these config resources onto the observatory-db machine is to clone this config into your home directory. To clone this repo into your home directory, log in to the observatory-db machine and type:
```
cd ~
git clone https://github.com/wtchg-kwiatkowski/observatory-web.git

```


Before executing `audit.sql`, make sure that the Observatory database is backed up and that the backups work.

See the dev notes in `db_backup_resources` on how to check that backups are working.

For more info on how and which audit logs are made, see `audit.sql`.


To execute the `audit.sql` script, log in to the observatory-db machine and type:
```
cd ~/observatory-web
git submodule update --init --recursive
sudo cp ~/observatory-web/submodules/audit-trigger/audit.sql /var/lib/postgresql/scripts/
sudo chown postgres:postgres /var/lib/postgresql/scripts/audit.sql
sudo -u postgres psql postgres
\i ~/scripts/audit.sql
\dt audit.
\q
```


