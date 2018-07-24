## Intro

There were some preliminary notes in ../cms_dev_notes.md

The UpdraftPlus Backups plugin for the WordPress CMS is configured to generate file and database backups every day, and retain them for 31 days.

To see/edit the settings.
Log in to the WordPress admin.
Go to Settings > UpdraftPlus Backups > Settings

The backup files appear on the server, in this directory /var/www/wp/wp-content/updraft
which Nginx has been configured to hide.

We want to rename the files (the plugin does not provide configuration options for file names) so that:

```
backup_2018-07-09-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-db.gz
backup_2018-07-09-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-others.zip
backup_2018-07-09-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-plugins.zip
backup_2018-07-09-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-themes.zip
backup_2018-07-09-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-uploads.zip
```
...Become bundled in to one file: 09-daily.tar.gz

If the day is 01, then:
```
backup_2018-07-01-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-db.gz
backup_2018-07-01-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-others.zip
backup_2018-07-01-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-plugins.zip
backup_2018-07-01-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-themes.zip
backup_2018-07-01-1546_MalariaGEN_Analytics_Blog_78d32fc6b810-uploads.zip
```
...Become bundled in to one file: 2018-07-01-monthly.tar.gz

(This naming convention follows the same approach in effect for the observatory database (PostgreSQL) backups.)

Setting the time for the backups is annoyingly not available in the free version of the UpdraftPlus plugin.

Worse than this, even if the backup is scheduled via a WordPress plugin, it might not run on time.

https://updraftplus.com/faqs/why-am-i-getting-warnings-about-my-site-not-having-enough-visitors/
```
UpdraftPlus is a WordPress plugin; as such, it relies on WordPress running and handing it the opportunity to do something.
```

One suggested solution is:
```
Sign up with a facility like http://uptimerobot.com/, https://www.pingdom.com/free/ or http://www.easycron.com/tutorials/how-to-set-up-cron-job-for-updraftplus to get some more automated visits to your website.
```

I've signed up to `uptimerobot.com` and set a "monitor" for the domain, every 12 hours, and it should notify me (LH) if that address gives a non-200 response.
The free account allows 50 "monitors".

This might be some guarantee that the backup is generated, but it still doesn't help determine the time at which it gets generated.

We should be able to handle missing backups in the cron script.


## Set up a cron job to run a source-controlled script every day

look for the backups from YESTERDAY
bundle them
upload them to the cloud.


Required for the crontab:
Where to put the Bash script? (The crontab will point to the script.)
Where to put the log files? (The crontab will divert output to the log files.)

For reference, the crontab for the PostgreSQL backups is (12 Jul 2018):
```
@daily /var/lib/postgresql/scripts/pg_backup_rotated.sh >> /var/lib/postgresql/backups/`date +\%Y-\%m-\%dT\%H-\%M-\%S`.log 2>&1
```

I don't want to pollute the `/var/www/wp/wp-content/updraft` directory, or store scripts in that potentially world-viewable directory.

The user than runs the script will need to have permission to create and delete things in the directory.

Since these scripts will need to be downloaded from a Git repo, probably into my home directory, this seems like a reasonable starting place. (It can be moved later.)

(Super-users will have access, in any case.)

`wp_backup.crontab`
```
@daily /home/leehartoxford/observatory-web/cms_resources/cms_backup_resources/wp_backup.sh >> /home/leehartoxford/backups/`date +\%Y-\%m-\%dT\%H-\%M-\%S`.log 2>&1
```

Note that the logs will be stored in the same directory as the backups, but we won't upload the log files.


## Write a script to perform the backup.

- wp_backup.config - specifies the values for variables and options, used by the script
- wp_backup.sh - the script, which performs specific actions depending on the config and other context
- wp_backup.crontab - the specification for the cron job, to schedule the regular running of the script

(These were based on the db_backup_resources for backing up the PostgreSQL database, which in turn were based on https://wiki.postgresql.org/wiki/Automated_Backup_on_Linux)


## Install and test the script

### Set the necessary storage permissions, access scope

The analytics-wp instance needs to have its Storage permission set to `Read Write` (not `Read Only`).

Changes to access scope currently require the instance to be restarted with the new permissions, which changes the IP of the machine.



### Get the backup script and resources onto the machine

Get these config resources onto the analytics-wp machine by cloning the repo into a home directory.

To clone this repo into your home directory, log in to the observatory-db machine and type:
```
cd /home/leehartoxford
git clone https://github.com/wtchg-kwiatkowski/observatory-web.git
```

You'll need to provide a username and password, because the repo is private.


### Setting up the backup script

To set up the backups, log in to the analytics-wp machine (e.g. SSH via VM instance web terminal) and type:
```
cd /home/leehartoxford
mkdir wp_backups
sudo chown leehartoxford:www-data /var/www/wp/wp-content/updraft
sudo chmod g+w /var/www/wp/wp-content/updraft
sudo chmod u+x /home/leehartoxford/observatory-web/cms_resources/cms_backup_resources/wp_backup.sh
sudo crontab -u leehartoxford /home/leehartoxford/observatory-web/cms_resources/cms_backup_resources/wp_backup.crontab
```

The script will need to run as a user that can remove old backups from `/var/www/wp/wp-content/updraft/`, which usually only `www-data` can do.
We don't want the script to run as `www-data`, because we don't want `www-data` to be running the `gsutil` command, which it can't do naturally.

For more info on how and which backups are made, see: 
- `observatory-web/cms_resources/cms_backup_resources/wp_backup.config`
- `observatory-web/cms_resources/cms_backup_resources/wp_backup.sh`
- `observatory-web/cms_resources/cms_backup_resources/wp_backup.crontab`

To help check whether the cron job will run properly, you can run the job hourly instead of daily by directly modifying the crontab via:
```
sudo crontab -u leehartoxford -e
```

For example, this would run hourly:
```
@hourly /home/leehartoxford/observatory-web/cms_resources/cms_backup_resources/wp_backup.sh >> /home/leehartoxford/wp_backups/`date +\%Y-\%m-\%dT\%H-\%M-\%S`.log 2>&1
```

This would run at 10 minutes past the hour:
```
10 * * * * /home/leehartoxford/observatory-web/cms_resources/cms_backup_resources/wp_backup.sh >> /home/leehartoxford/wp_backups/`date +\%Y-\%m-\%dT\%H-\%M-\%S`.log 2>&1
``

This would run at 10 or 20 minutes past:
```
10,20 * * * * /home/leehartoxford/observatory-web/cms_resources/cms_backup_resources/wp_backup.sh >> /home/leehartoxford/wp_backups/`date +\%Y-\%m-\%dT\%H-\%M-\%S`.log 2>&1
``

This would run every 10 minutes:
```
*/10 * * * * /home/leehartoxford/observatory-web/cms_resources/cms_backup_resources/wp_backup.sh >> /home/leehartoxford/wp_backups/`date +\%Y-\%m-\%dT\%H-\%M-\%S`.log 2>&1
``

This would run every half hour:
```
*/30 * * * * /home/leehartoxford/observatory-web/cms_resources/cms_backup_resources/wp_backup.sh >> /home/leehartoxford/wp_backups/`date +\%Y-\%m-\%dT\%H-\%M-\%S`.log 2>&1
``


### Set up a service account for authentication on the analytics-wp machine.

To set up a service account for authentication, first log in to the [console](https://console.cloud.google.com/iam-admin/serviceaccounts).
Select the appropriate project (`Malariagen Analytics`) and get the appropriate service account ID and key ID.

Actions > Create Key > Key type: JSON

You'll be prompted to save the key file (e.g. `malariagen-analytics-534f6d95a652.json`) locally.

Warning:
```
malariagen-analytics-[...unique...].json allows access to your cloud resources, so store it securely.
```

Open the file and find the client_email address, e.g. `907962496813-compute@developer.gserviceaccount.com`
(This is the same as the `Service account` in the VM instance details.)

Temporarily provide the analytics-wp machine with the key by pasting it into a temporary file (e.g. `file_containing_key`) and doing this:
```
cd ~
sudo nano file_containing_key
gcloud config set account 907962496813-compute@developer.gserviceaccount.com
gcloud auth activate-service-account 907962496813-compute@developer.gserviceaccount.com --key-file file_containing_key
sudo rm file_containing_key
```

Check the auth list. It should say "ACTIVE" after the credentialed account.
```
gcloud auth list
```

### Set up the Cloud repository

In theory, we could now create a bucket by typing `gsutil mb gs://analytics-wp-backups/`.

[Based on ../db_resources/db_backup_dev_notes.md 12 Jul 2018]
To create a cloud bucket via the web console:
- Log in to the Google Cloud console and create a bucket for the backups from https://console.cloud.google.com/storage/browser
- Project: Malariagen Analytics [The PostgreSQL backups are in ssdtest. 12 Jul 2018]
- Name: analytics-wp-backups
- Default storage class: Coldline
- Coldline location: European Union (any region)
- Press "Create"


### Test the upload works by manually copying a file from the backup directory to the cloud

Log in to the analytics-wp machine and type:
```
touch /home/leehartoxford/wp_backups/upload.test
ll /home/leehartoxford/wp_backups/
gsutil -m cp -r /home/leehartoxford/wp_backups/*.test gs://analytics-wp-backups
```

The backup script might need to use the full path to gsutil instead:
```
whereis gsutil
  gsutil: /snap/bin/gsutil
```


You might see this error:
```
Copying file:///home/leehartoxford/wp_backups/upload.test [Content-Type=application/octet-stream]...
AccessDeniedException: 403 Insufficient OAuth2 scope to perform this operation. 
Acceptable scopes: https://www.googleapis.com/auth/cloud-platform
CommandException: 1 file/object could not be transferred.
```

Which might mean you will need the `Storage` `Read and Write` Cloud API access scope.
rather than `Allow default access`, which only gives the `Storage` `Read` acesss.

Changing this will mean `You must stop the VM instance to edit its API access scopes`.
Stop the VM > Edit > Access scopes: Set access for each API > Storage: Read Write.
Start the VM. 

If you try to connect and receive:
```
Connection Failed
We are unable to connect to the VM on port 22. Learn more about possible causes of this issue.
```
...you might just need to wait!

To check the boot status without SSH, it might help to 
VM instances > vm (wp) > Details > Logs > Serial port 1 (console)
In the past, it has taken a while to get past this step (but eventually does, < 1hr).
```
Starting Initial cloud-init job (metadata service crawler)...
```

If the upload test works, you should see something like:
```
Copying file:///home/leehartoxford/wp_backups/upload.test [Content-Type=application/octet-stream]...
/ [1/1 files][    0.0 B/    0.0 B]                                              
Operation completed over 1 objects.
```

And, if you log in to the Google Cloud website and look at the Storage > Browser > analytics-wp-backups
you should see something like:
```
upload.test	0 B	application/octet-stream	Coldline	7/13/18, 3:37 PM
```



### Making an ad hoc backup of the WordPress files

Assuming the WordPress Updraft plugin has produced a backup.
```
ll /var/www/wp/wp-content/updraft/
```

(The upload to cloud step is optional.)


Note that the date of our backup is a day ahead of the actual backup,
because that is what would usually happen. (We would back up yesterday's files.)

```
cd /var/www/wp/wp-content/updraft
tar -cvzf /home/leehartoxford/wp_backups/10-daily.tar.gz backup_2018-07-09-1218_MalariaGEN_Analytics_Blog_*.*
gsutil -m cp -r /home/leehartoxford/wp_backups/10-daily.tar.gz gs://analytics-wp-backups
```

There might be different backups from different times on the same day.
Each set will share the same time and unique Id in the file names.

Log in to the Google Cloud website and look at the Storage > Browser > analytics-wp-backups
Download the file, and check the contents of the tar.gz

(Note that the file is uploaded as a `.tar.gz`, but downloads as a `.tar`)


### Test the backup script

The backup files are expected to be in the directory `/var/www/wp/wp-content/updraft/`
The backup files are expected to have yesterday's date, be owned by `www-data`, e.g.:
```
-rw-r--r--  1 www-data www-data   153510 Jul 23 11:26 backup_2018-07-22-1226_MalariaGEN_Analytics_Blog_3067e1eb7e1d-db.gz
-rw-r--r--  1 www-data www-data   646154 Jul 23 11:26 backup_2018-07-22-1226_MalariaGEN_Analytics_Blog_3067e1eb7e1d-others.zip
-rw-r--r--  1 www-data www-data 13010292 Jul 23 11:26 backup_2018-07-22-1226_MalariaGEN_Analytics_Blog_3067e1eb7e1d-plugins.zip
-rw-r--r--  1 www-data www-data  2300588 Jul 23 11:26 backup_2018-07-22-1226_MalariaGEN_Analytics_Blog_3067e1eb7e1d-themes.zip
-rw-r--r--  1 www-data www-data  3619481 Jul 23 11:26 backup_2018-07-22-1226_MalariaGEN_Analytics_Blog_3067e1eb7e1d-uploads.zip
```

NOTE: When there have been more than one Updraft backup in the same day, all files from all backup events on that day will be included.

The `wp_backup.config` file specifies the pattern matching for the file names, e.g.:
```
FILENAME_GLOB_PATTERN=backup_????-??-??-????_MalariaGEN_Analytics_Blog_????????????-*.*
```

You can test that the pattern matches using something like:
```
cd /var/www/wp/wp-content/updraft/
ls backup_????-??-??-????_MalariaGEN_Analytics_Blog_????????????-*.*
```

To find all files that match that glob pattern that were modified 1 day ago:
```
find /var/www/wp/wp-content/updraft/backup_????-??-??-????_MalariaGEN_Analytics_Blog_????????????-*.* -type f -mtime 1
```

If none of the files in the directory match the specified glob pattern
(or if there aren't any files in the directory), then the script should log that error.

One way to test the script (albeit a risky method) is to install it as above (under `Setting up the backup script`), and change the crontab to suit your needs.
Then wait for the clock to strike.
The crontab file shows where the output log file will be written (probably in `/home/lee/wp_backups/`).

An example error, due the backup script running as `www-data`, but `www-data` cannot use the `gsutil` command.
```
leehartoxford@wp:~/wp_backups$ cat 2018-07-24T12-30-01.log
Tarballing and then uploading to the cloud

FILE_COUNT: 5

THIS_TARBALL_PATH: /home/leehartoxford/wp_backups/24-daily.tar.gz

Backup files have been combined into one .tar.gz file.

/home/leehartoxford/observatory-web/cms_resources/cms_backup_resources/wp_backup.sh: line 90: gsutil: command not found
[!!ERROR!!] Failed to copy .tar.gz file to gs://analytics-wp-backups
Done.
```

Switch to the www-data user to see why it can't use the gsutil command:
```
leehartoxford@wp:~/wp_backups$ sudo -u www-data bash
www-data@wp:~/wp_backups$ gsutil
2018/07/24 12:52:24.591437 cmd_run.go:700: WARNING: cannot create user data directory: cannot create "/var/www/snap/google-cloud-sdk/45": mkdir /var/www/snap: permission denied
cannot create user data directory: /var/www/snap/google-cloud-sdk/45: Permission denied
```

(It would be risky to allow `www-data` to run the `gsutil` command!)

Enter `exit` to stop impersonating `www-data`.



To prevent the cron job running again, you can remove it:
```
sudo crontab -u leehartoxford -e
```
(Remove the offending line and save.)


To install the crontab again:
```
sudo crontab -u leehartoxford /home/leehartoxford/observatory-web/cms_resources/cms_backup_resources/wp_backup.crontab
```

## Snapshot the instance

The first snap shot was be taken after everything was set up except the cron job to copy WP backups to the cloud, and any custom development (e.g. of the RSS feed).

Guide:
https://cloud.google.com/compute/docs/disks/create-snapshots

Log in to the machine (e.g. SSH via VM instance web terminal)

Determine the disk mountpoint
```
sudo lsblk
```
```
NAME    MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
loop0     7:0    0 86.6M  1 loop /snap/core/4650
loop2     7:2    0 86.9M  1 loop /snap/core/4917
loop3     7:3    0 48.4M  1 loop /snap/google-cloud-sdk/41
loop4     7:4    0 48.9M  1 loop /snap/google-cloud-sdk/42
loop5     7:5    0 48.9M  1 loop /snap/google-cloud-sdk/43
sda       8:0    0   10G  0 disk 
├─sda1    8:1    0  9.9G  0 part /
├─sda14   8:14   0    4M  0 part 
└─sda15   8:15   0  106M  0 part /boot/efi
```

Stop Nginx
```
sudo service nginx stop
```


Freeze the disk
```
sudo fsfreeze -f /
```

Take the snapshot
Google Cloud > Project: Malariagen Analytics
Compute Engine > Snapshots

Description
```
Ubuntu, Nginx, MariaDB, PHP, WordPress, security, before WP backups to cloud
```


```
Caution: If you attempt to create a snapshot from a persistent disk and the snapshotting process fails, you won't be able to delete the original persistent disk until you have cleaned up the failed snapshot. This failsafe helps to prevent the accidental deletion of source data in the event of an unsuccessful backup.
```

```
wp-2018-07-12t1040	wp	Jul 12, 2018, 10:40:10 AM	10 GB	1.77 GB
```

[Is there actually any utility in putting a timestamp in the snapshop name?]


Unfreeze the disk
```
sudo fsfreeze -u /
```

Start Nginx
```
sudo service nginx start
```


## Restore a snapshot

https://cloud.google.com/compute/docs/disks/restore-and-delete-snapshots

VM instances > Create Instance 

Name: wp2
region: europe-west1
zone: europe-west1-d
Machine type: micro 1 shared vCPU, 0.6 GB
Boot disk > Change > Snapshots > wp-2018-07-12t1040
Boot disk type: Standard persistent disk
Size: 10 GB

Service account: Compute Engine default service account
Access scopes: Set access for each API
Storage: Read Write
Allow HTTP traffic
Allow HTTPS traffic

Create


Remember that the snapshot disk is frozen, and Nginx is stopped.

After restoring the snapshot

Unfreeze the disk
```
sudo fsfreeze -u /
```

Start Nginx
```
sudo service nginx start
```


#################






















