# Notes on development of the automated db backups

Used this web page as a starting point: https://wiki.postgresql.org/wiki/Automated_Backup_on_Linux
```
Here are some scripts which will backup all databases in a cluster individually, optionally only backing up the schema for a set list. The reason one might wish to use this over pg_dumpall is that you may only wish to restore individual databases from a backup, whereas pg_dumpall dumps a plain SQL copy into a single file. This also provides the option of specifying which databases you only want the schema of. The idea is to run these in a nightly cron job.

- pg_backup.config - The main configuration file. This should be the only file which needs user modifications.
- pg_backup.sh - The normal backup script which will go through each database and save a gzipped and/or a custom format copy of the backup into a date-based directory.
- pg_backup_rotated.sh - The same as above except it will delete expired backups based on the configuration.
```

Removed the $HOSTNAME to avoid specifying a password, as suggested here: https://wiki.postgresql.org/wiki/Talk:Automated_Backup_on_Linux
```
With the default installation postgres user is allowed to access but via socket no via localhost. A quick fix is to remove
-h "$HOSTNAME"
from the psql commands.
```


Got these config resources onto the observatory-db machine by cloning the repo into a home directory.

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

For more info on how and which backups are made, see: 
- `/var/lib/postgresql/scripts/pg_backup.config`
- `/var/lib/postgresql/scripts/pg_backup_rotated.sh`
- `/var/lib/postgresql/scripts/pg_backup.crontab`

To help check whether the cron job will run properly, you can run the job hourly instead of daily by directly modifying the crontab via `sudo crontab -u postgres -e`.


## Notes on copying the backup files to a Google Cloud bucket

Used this web page as a starting point: https://cloud.google.com/storage/docs/quickstart-gsutil

The observatory-db instance needs to have its Storage permission set to `Read Write` (not `Read Only`).

Changes to access scope currently require the instance to be restarted with the new permissions, which changes the IP of the machine.


### Notes on setting up a service account for authentication on the observatory-db machine.

If you try to configure the gsutil with `gsutil config`, you might see:
```
CommandException: OAuth2 is the preferred authentication mechanism with the Cloud SDK. Run "gcloud auth login" to configure authentication, unless you want to authenticate with an HMAC access key and secret, in which case run "gsutil config -a".
```

If you try to configure an authentication mechanism for the Google Cloud SDK using `gcloud auth login`, you might see:
```
You are running on a Google Compute Engine virtual machine.
It is recommended that you use service accounts for authentication.
```

To set up a service account for authentication, first log in to the [console](https://console.cloud.google.com/iam-admin/serviceaccounts) and get the appropriate service account ID and key ID.

Temporarily provide the observatory-db machine with the key by pasting it into a temporary file (e.g. `file_containing_key`) and doing this:
```
sudo nano file_containing_key
gcloud config set account 107470729430-compute@developer.gserviceaccount.com
gcloud auth activate-service-account 107470729430-compute@developer.gserviceaccount.com --key-file file_containing_key
sudo rm file_containing_key
```

This warning and error message was then shown.
```
WARNING: .p12 service account keys are not recomended unless it is necessary for backwards compatability. Please switch to a newer .json service account key for this account.
ERROR: (gcloud.auth.activate-service-account) PyOpenSSL is not available. If you have already installed PyOpenSSL, you will need to enable site packages by setting the environment variable CLOUDSDK_PYTHON_SITEPACKAGES to 1. If that does not work, see https://developers.google.com/cloud/sdk/crypto for details or consider using .json private key instead.

```

Check the auth list. It should say "ACTIVE" after the credentialed account.
```
gcloud auth list
```


### Notes on creating a cloud bucket and copying files to it

To create a cloud bucket via the web console:
- Log in to the Google Cloud console and create a bucket for the backups from https://console.cloud.google.com/storage/browser
- Name: observatory-db-backups
- Default storage class: Coldline
- Coldline location: European Union (any region)
- Press "Create"

To check that gsutil is installed on the observatory-db machine, simply log in to the machine and type `gsutil`.

When the service account has been set up and the instance has `Read Write` permissions, you could also create a bucket by typing `gsutil mb gs://observatory-db-backups/`.

For the relevant options to specify the class and location, etc., type `gsutil help mb`.


To copy all of the backup files to the cloud bucket, log in to the observatory-db machine and type:
```
gsutil -m cp -r /var/lib/postgresql/backups/* gs://observatory-db-backups
```


The `pg_backup_rotated.sh` script only copies the current backup (either a .tgz or a directory) to the cloud bucket, which is specified in `pg_backup.config`.


This sort of error message appears when either the service account on the `observatory-db` instance has not been set up properly, or the instance lacks Read Write storage permissions.
```
Copying file:///var/lib/postgresql/backups/test.txt [Content-Type=text/plain]...
AccessDeniedException: 403 Insufficient OAuth2 scope to perform this operation. 
Acceptable scopes: https://www.googleapis.com/auth/cloud-platform
CommandException: 1 file/object could not be transferred.
```



## Checking the backups are valid.

One basic check would be to install PostgreSQL on your local machine, download the latest backup, uncompress and execute the relevant SQL file (or pg_restore the custom-format archive) and inspect the results.

To install PostgreSQL locally on Ubuntu:
```
sudo apt-get update
sudo apt-get install postgresql
sudo -u postgres psql postgres
\password 
  Enter new password: specify_a_password_for_postgres_here
  Enter it again: specify_a_password_for_postgres_here
\q
```

To extract and restore one of the backup files:
```
tar -xzf 2017-07-04-daily.tgz
gunzip observatory.sql.gz
sudo -u postgres psql postgres
\i observatory.sql
\list
\q
```



