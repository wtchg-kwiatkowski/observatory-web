https://wiki.postgresql.org/wiki/Automated_Backup_on_Linux
```
Here are some scripts which will backup all databases in a cluster individually, optionally only backing up the schema for a set list. The reason one might wish to use this over pg_dumpall is that you may only wish to restore individual databases from a backup, whereas pg_dumpall dumps a plain SQL copy into a single file. This also provides the option of specifying which databases you only want the schema of. The idea is to run these in a nightly cron job.

- pg_backup.config - The main configuration file. This should be the only file which needs user modifications.
- pg_backup.sh - The normal backup script which will go through each database and save a gzipped and/or a custom format copy of the backup into a date-based directory.
- pg_backup_rotated.sh - The same as above except it will delete expired backups based on the configuration.
```

https://wiki.postgresql.org/wiki/Talk:Automated_Backup_on_Linux
```
With the default installation postgres user is allowed to access but via socket no via localhost. A quick fix is to remove
-h "$HOSTNAME"
from the psql commands.
```

One way to get these config resources onto the observatory-db machine is to clone this config into your home directory.

To clone this repo into your home directory, log in to the observatory-db machine and type:
```
cd ~
git clone https://github.com/wtchg-kwiatkowski/observatory-web.git

```

To find the home directory of the existing user `postgres`, log in to the observatory-db machine and type:
`echo ~postgres`

At time of writing: `/var/lib/postgresql`

To set up the backups, log in to the observatory-db machine and type:
```
cd /var/lib/postgresql
sudo mkdir scripts backups
sudo chown postgres:postgres scripts backups
sudo cp ~/observatory-web/db_backup_resources/{pg_backup.config,pg_backup_rotated.sh,pg_backup.crontab} scripts/
sudo chown -R postgres:postgres scripts
sudo chmod u+x scripts/pg_backup_rotated.sh
sudo crontab -u postgres /var/lib/postgresql/scripts/pg_backup.crontab

```

To help check whether the cron job will run properly, you can run the job hourly instead of daily by directly modifying the crontab via `sudo crontab -u postgres -e`.

If ZIP_ALL_BACKUPS is disabled, backups will be created in subdirectories of `/var/lib/postgresql/backups/`, e.g. `/var/lib/postgresql/backups/2017-07-04-daily/`

If ZIP_ALL_BACKUPS is enabled, backups will be created as `.tar.gz` files in `/var/lib/postgresql/backups/`, e.g. `/var/lib/postgresql/backups/2017-07-04-daily.tar.gz`

For more info on how and which backups are made, see `/var/lib/postgresql/scripts/pg_backup_rotated.sh`.

As specified in the crontab, logs containing output from each cron job will saved in the backups directory and named with a timestamp, e.g. `2017-07-04T100001.log`


## Copying the backups to a Google Cloud bucket.
https://cloud.google.com/storage/docs/quickstart-gsutil

To check that gsutil is installed on the observatory-db machine, simply log in to the machine and type `gsutil`.

TODO: authenticate

If you try to configure the gsutil with `gsutil config`, you might see:
```
CommandException: OAuth2 is the preferred authentication mechanism with the Cloud SDK. Run "gcloud auth login" to configure authentication, unless you want to authenticate with an HMAC access key and secret, in which case run "gsutil config -a".
```

If you try to configure an authentication mechanism for the Google Cloud SDK using `gcloud auth login`, you might see:
```
You are running on a Google Compute Engine virtual machine.
It is recommended that you use service accounts for authentication.
```

To use a service account for authentication (the `set account` step should have already been done):

- Log in to the console and get the appropriate service account ID and key ID from https://console.cloud.google.com/iam-admin/serviceaccounts


```
sudo nano file_containing_key
gcloud config set account 107470729430-compute@developer.gserviceaccount.com
gcloud auth activate-service-account 107470729430-compute@developer.gserviceaccount.com --key-file file_containing_key
sudo rm file_containing_key
```

```
WARNING: .p12 service account keys are not recomended unless it is necessary for backwards compatability. Please switch to a newer .json service account key for this account.
ERROR: (gcloud.auth.activate-service-account) PyOpenSSL is not available. If you have already installed PyOpenSSL, you will need to enable site packages by setting the environment variable CLOUDSDK_PYTHON_SITEPACKAGES to 1. If that does not work, see https://developers.google.com/cloud/sdk/crypto for details or consider using .json private key instead.

```

Check the auth list. It should say "ACTIVE" after the credentialed account.
```
gcloud auth list
```


To create a bucket for the backups:
```
gsutil mb gs://observatory-db-backups/
```

Errors:
```
Creating gs://observatory-db-backups/...
AccessDeniedException: 403 Insufficient OAuth2 scope to perform this operation.
Acceptable scopes: https://www.googleapis.com/auth/cloud-platform
```



```
gsutil -m cp -r /var/lib/postgresql/backups gs://observatory-db-backups
```


## Checking the backups are valid.

One basic check would be to install PostgreSQL on your local machine, download the latest backup, uncompress and execute the relevant SQL file (or pg_restore the custom-format archive) and inspect the results.

```
sudo apt-get update
sudo apt-get install postgresql
tar -xzfv 2017-07-04-daily.tar.gz
tar -xzfv 2017-07-04-daily/observatory.sql.gz
psql -U postgres -a -f 2017-07-04-daily/observatory.sql
```
