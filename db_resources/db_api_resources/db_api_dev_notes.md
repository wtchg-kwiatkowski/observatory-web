

## Getting the version of PostgreSQL

To see the version of PostgreSQL:
```
sudo -u postgres psql postgres
SELECT version();
\q
```

At time of writing: locally `9.5.7`; remotely `9.6.3`.


## Connecting to a remote PostgreSQL server

https://www.postgresql.org/docs/9.5/static/auth-pg-hba-conf.html
```
19.1. The pg_hba.conf File
Client authentication is controlled by a configuration file, which traditionally is named pg_hba.conf and is stored in the database cluster's data directory. (HBA stands for host-based authentication.) A default pg_hba.conf file is installed when the data directory is initialized by initdb. It is possible to place the authentication configuration file elsewhere, however; see the hba_file configuration parameter.

The general format of the pg_hba.conf file is a set of records, one per line. Blank lines are ignored, as is any text after the # comment character. Records cannot be continued across lines. A record is made up of a number of fields which are separated by spaces and/or tabs. Fields can contain white space if the field value is double-quoted. Quoting one of the keywords in a database, user, or address field (e.g., all or replication) makes the word lose its special meaning, and just match a database, user, or host with that name.

Each record specifies a connection type, a client IP address range (if relevant for the connection type), a database name, a user name, and the authentication method to be used for connections matching these parameters. The first record with a matching connection type, client address, requested database, and user name is used to perform authentication. There is no "fall-through" or "backup": if one record is chosen and the authentication fails, subsequent records are not considered. If no record matches, access is denied.
```


https://www.postgresql.org/docs/9.5/static/runtime-config-file-locations.html#GUC-HBA-FILE
```
hba_file (string)
Specifies the configuration file for host-based authentication (customarily called pg_hba.conf). This parameter can only be set at server start.
[...]
In a default installation, none of the above parameters are set explicitly. Instead, the data directory is specified by the -D command-line option or the PGDATA environment variable, and the configuration files are all found within the data directory.
```

To find the location of the data directory:
```
sudo -u postgres psql postgres
SHOW data_directory;
\q
```

At time of writing: `/var/lib/postgresql/9.5/main`


https://www.postgresql.org/docs/9.5/static/auth-methods.html#AUTH-PASSWORD
```
The password-based authentication methods are md5 and password. These methods operate similarly except for the way that the password is sent across the connection, namely MD5-hashed and clear-text respectively.

If you are at all concerned about password "sniffing" attacks then md5 is preferred. Plain password should always be avoided if possible. However, md5 cannot be used with the db_user_namespace feature. If the connection is protected by SSL encryption then password can be used safely (though SSL certificate authentication might be a better choice if one is depending on using SSL).

PostgreSQL database passwords are separate from operating system user passwords. The password for each database user is stored in the pg_authid system catalog. Passwords can be managed with the SQL commands CREATE USER and ALTER ROLE, e.g., CREATE USER foo WITH PASSWORD 'secret'. If no password has been set up for a user, the stored password is null and password authentication will always fail for that user.
```

Note: passwords are stored in the PostgreSQL database as MD5 hashes.


The `pg_hba.conf` file will need to allow the web app host to connect to the observatory database using a password (which can be md5-hashed over the wire), e.g.:
```
sudo nano /etc/postgresql/9.5/main/pg_hba.conf
```
```
host  observatory lee,benj  104.199.5.137/32  md5
```

To test this locally, you could comment out the other local methods, e.g.:
```
# "local" is for Unix domain socket connections only
######local   all             all                                     peer
# IPv4 local connections:
######host    all             all             127.0.0.1/32            md5
# IPv6 local connections:
######host    all             all             ::1/128                 md5
# Allow replication connections from localhost, by a user with the
# replication privilege.
#local   replication     postgres                                peer
#host    replication     postgres        127.0.0.1/32            md5
#host    replication     postgres        ::1/128                 md5
host  observatory lee,benj  127.0.0.1/32  md5

```

Note: don't comment out the`local all postgres peer` entry, which allows the postgres user to access all databases locally.


Restart the PostgreSQL server: `sudo service postgresql restart`


To test the local connection (as suggested above):
```
psql --host 127.0.0.1 --dbname observatory --username lee
```

To check the local logs:
```
tail -f -n100 /var/log/postgresql/postgresql-9.5-main.log
```

Note: the remote version is different, i.e. `tail -f -n100 /var/log/postgresql/postgresql-9.6-main.log`


The following error log is purportedly common and harmless, according to http://www.postgresql-archive.org/Incomplete-startup-packet-help-needed-td5199030.html
```
[unknown]@[unknown] LOG:  incomplete startup packet
```




The observatory-db machine already contains the following line in its `/etc/postgresql/9.6/main/pg_hba.conf` file:
```
host all all 163.1.206.129/32 md5
```

To allow the Panoptes machine to connect to the observatory db, we also need to add this line to `/etc/postgresql/9.6/main/pg_hba.conf`:
```
host observatory lee,benj 104.199.5.137/32 md5
```

Note: that increases the value of having a fixed IP address for the Panoptes machine.

The db server needs restarting after that edit:
```
sudo service postgresql restart
```

The observatory-db machine already contains the following lines in its `/etc/postgresql/9.6/main/postgresql.conf` file:
```
listen_addresses = '*'
port = 5432
```

To test the connection to a remote machine:
```
psql --host=35.185.117.147 --port=5432 --dbname=observatory --username=lee
```

Note: we can connect from the Panoptes machine (e.g. 104.199.5.137) but not a BDI network machine (163.1.206.129).

To install `psql`, which Lee did on the Panoptes machine:
```
sudo apt-get install postgresql-client
```


Typical time-out error:
```
psql: could not connect to server: Connection timed out
	Is the server running on host "35.185.117.147" and accepting
	TCP/IP connections on port 5432?
```

To check whether a machine's port is open:
```
telnet 35.185.117.147 5432
```

If the port is not open, you will see (after a wait):
```
Trying 35.185.117.147...
telnet: Unable to connect to remote host: Connection timed out
```

If the port is open, you will see:
```
Trying 35.185.117.147...
Connected to 35.185.117.147.
Escape character is '^]'.
```

To test whether the port is being listened to on the remote machine:
```
ssh 35.185.117.147
netstat -an | grep 5432
```

If the port is being listened to, you will see:
```
  tcp        0      0 0.0.0.0:5432            0.0.0.0:*               LISTEN     
  tcp6       0      0 :::5432                 :::*                    LISTEN     
  unix  2      [ ACC ]     STREAM     LISTENING     17728    /var/run/postgresql/.s.PGSQL.5432
```

To create a firewall rule:
- https://console.cloud.google.com/networking/firewalls
Name: allow5432
Direction of traffic: Ingress
Action on match: allows
Targets: Specified target tags
Target tags: obs-db
Source filter: IP ranges
IP ranges: 163.1.206.129/32 104.199.5.137/32
Protocols and ports: tcp:5432

Press "Create"

There was already a rule to allow all ports to the obs-db from 163.1.206.129.


To enable a port on a remote machine for specific IPs:
```
ssh 35.185.117.147
sudo iptables -A INPUT -p tcp --dport 5432 -s 163.1.206.129 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 5432 -s 104.199.5.137 -j ACCEPT
```

I don't know why yet, but you don't need to enable the port on your local machine for a specific remote IP, e.g.:
```
sudo iptables -A INPUT -p tcp --dport 5432 -s 35.185.117.147 -j ACCEPT
```

To view the iptables, enter `sudo iptables -S`
```
-P INPUT ACCEPT
-P FORWARD ACCEPT
-P OUTPUT ACCEPT
-N sshguard
-A INPUT -j sshguard
-A INPUT -s 163.1.206.129/32 -p tcp -m tcp --dport 5432 -j ACCEPT
-A INPUT -s 104.199.5.137/32 -p tcp -m tcp --dport 5432 -j ACCEPT
```

This would prevent phppgadmin from working:
```
sudo iptables -A INPUT -p tcp --dport 5432 -j DROP
```

To remove a rule:
```
sudo iptables -L --line-numbers
sudo iptables -D INPUT 3
```

To create a firewall rule:
- https://console.cloud.google.com/networking/firewalls
Name: postgres-egress
Direction of traffic: Egress
Action on match: allows
Targets: Specified target tags
Target tags: obs-db
Source filter: IP ranges
IP ranges: 163.1.206.129/32
Protocols and ports: tcp:5432



Since port 5432 is blocked by the firewall of the BDI, one way to test connections to the Obs-db from a machine behind the BDI firewall is by using SSH tunneling:
http://www.uptimemadeeasy.com/networking/connect-blocked-ports-ssh-tunneling/

To see which local ports are being used, enter `netstat -ntl`.
If you see `0.0.0.0:5432` under `Local Address`, then that port is already being listened to locally; probably by a local PostgreSQL server.

Stop your local PostgreSQL to avoid getting confused:
```
sudo service postgresql stop
psql --host=127.0.0.1 --port=5432 --dbname=observatory --username=lee
  psql: could not connect to server: Connection refused
  	Is the server running on host "127.0.0.1" and accepting
  	TCP/IP connections on port 5432?
```

You could tunnel between ports 5432 and 5432 on both machines, but using a different port avoids accidentally mistaking the remote machine for the local machine.

Tunnel localhost port 5555 to the remote port 5432, which will exist as long as that connection is open:
```
ssh -l lee 35.185.117.147 -L 5555:localhost:5432
```

Open another terminal and test the connection:
```
netstat -ntl | grep 5555
psql --host=localhost --port=5555 --dbname=observatory --username=lee
```




## Failed attempt at LDAP authentication ("The ldaps URL scheme (direct SSL connection) is not supported.")

https://www.postgresql.org/docs/9.5/static/auth-methods.html#AUTH-LDAP

```
19.3.7. LDAP Authentication

This authentication method operates similarly to password except that it uses LDAP as the password verification method. LDAP is used only to validate the user name/password pairs. Therefore the user must already exist in the database before LDAP can be used for authentication.

LDAP authentication can operate in two modes. In the first mode, which we will call the simple bind mode, the server will bind to the distinguished name constructed as prefix username suffix. Typically, the prefix parameter is used to specify cn=, or DOMAIN\ in an Active Directory environment. suffix is used to specify the remaining part of the DN in a non-Active Directory environment.

In the second mode, which we will call the search+bind mode, the server first binds to the LDAP directory with a fixed user name and password, specified with ldapbinddn and ldapbindpasswd, and performs a search for the user trying to log in to the database. If no user and password is configured, an anonymous bind will be attempted to the directory. The search will be performed over the subtree at ldapbasedn, and will try to do an exact match of the attribute specified in ldapsearchattribute. Once the user has been found in this search, the server disconnects and re-binds to the directory as this user, using the password specified by the client, to verify that the login is correct. This mode is the same as that used by LDAP authentication schemes in other software, such as Apache mod_authnz_ldap and pam_ldap. This method allows for significantly more flexibility in where the user objects are located in the directory, but will cause two separate connections to the LDAP server to be made.

[...]

Here is an example for a simple-bind LDAP configuration:

host ... ldap ldapserver=ldap.example.net ldapprefix="cn=" ldapsuffix=", dc=example, dc=net"

When a connection to the database server as database user someuser is requested, PostgreSQL will attempt to bind to the LDAP server using the DN cn=someuser, dc=example, dc=net and the password provided by the client. If that connection succeeds, the database access is granted.

Here is an example for a search+bind configuration:

host ... ldap ldapserver=ldap.example.net ldapbasedn="dc=example, dc=net" ldapsearchattribute=uid

When a connection to the database server as database user someuser is requested, PostgreSQL will attempt to bind anonymously (since ldapbinddn was not specified) to the LDAP server, perform a search for (uid=someuser) under the specified base DN. If an entry is found, it will then attempt to bind using that found information and the password supplied by the client. If that second connection succeeds, the database access is granted.

Here is the same search+bind configuration written as a URL:

host ... ldap ldapurl="ldap://ldap.example.net/dc=example,dc=net?uid?sub"

Some other software that supports authentication against LDAP uses the same URL format, so it will be easier to share the configuration.

Tip: Since LDAP often uses commas and spaces to separate the different parts of a DN, it is often necessary to use double-quoted parameter values when configuring LDAP options, as shown in the examples.

```


To test an LDAP connection where `421` is your LDAP user cn (different to your LDAP uid and mail) (NB: to test locally, you will currently need VPN access for this URL, and perhaps `127.0.0.1	localhost alpha.malariagen.net alpha.well.ox.ac.uk` in your `/etc/hosts` file.):
```
ldapsearch -H ldaps://sso1.malariagen.net:636/ -x -D "cn=421,ou=users,ou=people,dc=malariagen,dc=net" -W -b dc=malariagen,dc=net mail
```


Note: when specifying an ldap URI in `pg_hba.conf`, you can't use the scheme `ldaps://`, instead [it was hoped] you have to use `ldap://` together with the option `ldaptls=1`.

Add the following line at the end of the file `/etc/postgresql/9.5/main/pg_hba.conf` (note the space separators in ldapbasedn), where 421 is the cn of the authenticating LDAP user. You also have to specify the password here, which is bad. [TODO: find a method that doesn't expose the password in plaintext, e.g. in logs]:
```
host observatory all 0.0.0.0/0 ldap ldapserver=sso1.malariagen.net ldapport=636 ldaptls=1 ldapbinddn="dc=malariagen, dc=net" ldapbasedn="cn=421, ou=users, ou=people, dc=malariagen, dc=net" ldapsearchattribute=uid ldapbindpasswd=[argh]
```

For the purposes of testing LDAP authentication, you can comment out the other entries in `pg_hba.conf` file, e.g.:
```
# "local" is for Unix domain socket connections only
########local   all             all                                     peer
# IPv4 local connections:
########host    all             all             127.0.0.1/32            md5
# IPv6 local connections:
########host    all             all             ::1/128                 md5
```

Note: don't comment out the`local all postgres peer` entry, which allows the postgres user to access all databases locally.


E.g.
```
sudo nano /etc/postgresql/9.5/main/pg_hba.conf
```


There needs to be a corresponding role in PostgreSQL:
```
sudo -u postgres psql postgres
SELECT rolname FROM pg_roles;
CREATE ROLE lee LOGIN;
\q
```

To find `postgresql.conf`:
```
locate postgresql.conf
```

At time of writing: local `/etc/postgresql/9.5/main/postgresql.conf`

```
listen_addresses = '*'
```

E.g.
```
cd /etc/postgresql/9.5/main/
sudo cp postgresql.conf postgresql.conf.bkp.orig
sudo nano postgresql.conf
```



Restart the PostgreSQL server: `sudo service postgresql restart`



Check that you can log in using your LDAP uid (or whatever corresponds to `ldapsearchattribute=uid`):
```
psql --host 127.0.0.1 --dbname observatory --username lee
```

```
lee@lee-90210:/etc/postgresql/9.5/main$ psql --host 127.0.0.1 --dbname observatory --username lee
Password for user lee: 
psql: FATAL:  LDAP authentication failed for user "lee"
FATAL:  LDAP authentication failed for user "lee"
```

Failed login attempts will be recorded in more detail in the logs, e.g.:
```
2017-07-12 12:41:13 BST [3312-1] lee@observatory LOG:  could not receive data from client: Connection reset by peer
2017-07-12 12:41:20 BST [3313-1] lee@observatory LOG:  could not start LDAP TLS session: Can't contact LDAP server
2017-07-12 12:41:20 BST [3313-2] lee@observatory FATAL:  LDAP authentication failed for user "lee"
2017-07-12 12:41:20 BST [3313-3] lee@observatory DETAIL:  Connection matched pg_hba.conf line 102: "host observatory all 0.0.0.0/0 ldap ldapserver=sso1.malariagen.net ldapport=636 ldaptls=1 ldapbinddn="dc=malariagen, dc=net" ldapbasedn="cn=421, ou=users, ou=people, dc=malariagen, dc=net" ldapsearchattribute=uid ldapbindpasswd=REDACTED"
2017-07-12 12:41:20 BST [3314-1] lee@observatory LOG:  could not start LDAP TLS session: Can't contact LDAP server
2017-07-12 12:41:20 BST [3314-2] lee@observatory FATAL:  LDAP authentication failed for user "lee"
2017-07-12 12:41:20 BST [3314-3] lee@observatory DETAIL:  Connection matched pg_hba.conf line 102: "host observatory all 0.0.0.0/0 ldap ldapserver=sso1.malariagen.net ldapport=636 ldaptls=1 ldapbinddn="dc=malariagen, dc=net" ldapbasedn="cn=421, ou=users, ou=people, dc=malariagen, dc=net" ldapsearchattribute=uid ldapbindpasswd=REDACTED"
```




If you don't specify the host, PostgreSQL will assume that you are connecting locally and you might get this error:
```
psql: FATAL:  no pg_hba.conf entry for host "[local]", user "lee", database "observatory", SSL off
```


Check that you can't log in:
```
psql --dbname observatory --username user_does_not_exist
```


If you see this sort of error message, then PostgreSQL is still using password rather than LDAP to authenticate:
```
FATAL:  password authentication failed for user "lee"
```

If LDAP authentication is being attempted but the authentication failed, you'd see this instead:
```
FATAL:  LDAP authentication failed for user "lee"
```




## Failed attempt to use ldap_to_postgres user map 

https://www.postgresql.org/docs/9.5/static/auth-username-maps.html
```
19.2. User Name Maps
When using an external authentication system like Ident or GSSAPI, the name of the operating system user that initiated the connection might not be the same as the database user he needs to connect as. In this case, a user name map can be applied to map the operating system user name to a database user. To use user name mapping, specify map=map-name in the options field in pg_hba.conf. This option is supported for all authentication methods that receive external user names. Since different mappings might be needed for different connections, the name of the map to be used is specified in the map-name parameter in pg_hba.conf to indicate which map to use for each individual connection.

```


To locate the pg_hba.conf file:
```
sudo -u postgres psql postgres
SHOW hba_file;
\q
```

At time of writing: `/etc/postgresql/9.5/main/pg_ident.conf`

Add the following line to the file `/etc/postgresql/9.5/main/pg_ident.conf`:
```
ldap_to_postgres 421 lee
```

E.g.
```
sudo nano /etc/postgresql/9.5/main/pg_ident.conf
```

Error message in log after trying to use `map=ldap_to_postgres` in `pg_hba.conf` file for ldap authentication method:
```
LOG:  authentication option "map" is only valid for authentication methods ident, peer, gssapi, sspi, and cert
```

## Setting up sftp folders for George to upload images and html to

There is already a folder that exists:
```
ssh 104.199.5.137
ll /mnt/disks/ssd0/source-dev/datasets/observatory/doc
```

The files are owned by www-data.

First to give George an account and allow him to see anything created by `www-data`:
```
sudo adduser george
sudo usermod -aG www-data george
groups george
```

We want any files created in the directory to have their group set to the same group as the parent directory.

Change the group owner to www-data:
```
cd /mnt/disks/ssd0/source-dev/datasets/observatory/
sudo chown ben_jeffery_well:www-data doc
sudo chmod g+s doc
```

Make a symlink for George:
```
cd /home/george
sudo ln -s /mnt/disks/ssd0/source-dev/datasets/observatory/doc /home/george/dev_obs_doc
```

Put George's public key on the server (recieved as file).
```
ssh 104.199.5.137
sudo mkdir .ssh
cd .ssh
sudo nano authorized_keys
```

Paste the public key into there, and save.

```
sudo chmod 0600 authorized_keys
sudo chown george:george authorized_keys
cd ..
sudo chown george:george .ssh
sudo chmod 0700 .ssh
```

Instructions to George:
```
Open a file browser > Connect to server...
sftp://104.199.5.137/home/george
Password: [redacted]
In the directory `dev_obs_doc` (I've symlinked for you), you should be able to see and create more HTML files.
I haven't solved the problem of providing you with a link to a folder of images that you can use yet... Looks more problematic than I imagined.
```




