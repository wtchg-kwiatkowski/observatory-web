#!/bin/bash

# Allow this script to use /snap/bin/gsutil
PATH="$PATH":/snap/bin

###########################
####### LOAD CONFIG #######
###########################

while [ $# -gt 0 ]; do
        case $1 in
                -c)
                        CONFIG_FILE_PATH="$2"
                        shift 2
                        ;;
                *)
                        ${ECHO} "Unknown Option \"$1\"" 1>&2
                        exit 2
                        ;;
        esac
done

if [ -z $CONFIG_FILE_PATH ] ; then
        SCRIPTPATH=$(cd ${0%/*} && pwd -P)
        CONFIG_FILE_PATH="${SCRIPTPATH}/wp_backup.config"
fi

if [ ! -r ${CONFIG_FILE_PATH} ] ; then
        echo "Could not load config file from ${CONFIG_FILE_PATH}" 1>&2
        exit 1
fi

source "${CONFIG_FILE_PATH}"


###########################
#### CHECK RUN_AS_USER ####
###########################

# Make sure we're running as the required backup user
if [ "$RUN_AS_USER" != "" -a "$(id -un)" != "$RUN_AS_USER" ]; then
	echo "This script must be run as $RUN_AS_USER. Exiting." 1>&2
	exit 1
fi

#######################
#### MAIN FUNCTION ####
#######################

function perform_backups()
{
  ## Determine the name for the tarball.
	THIS_BACKUP_TYPE=$1 # daily, monthly
  # The monthly naming scheme is the default.
  THIS_TARBALL_FILENAME="`date +\%Y-\%m-\%d`-$THIS_BACKUP_TYPE".tar.gz
  if [ "$THIS_BACKUP_TYPE" = 'daily' ]; then
    THIS_TARBALL_FILENAME="`date +\%d`-$THIS_BACKUP_TYPE".tar.gz
  fi
  THIS_TARBALL_PATH="$BACKUPS_FERRY_DIR/$THIS_TARBALL_FILENAME"

  # NOTE: When there have been more than one Updraft backup in the same day, 
  # all files from all backup events on that day will be included.

  FILE_COUNT=$(find $BACKUPS_SOURCE_DIR -name "$FILENAME_GLOB_PATTERN" -type f -daystart -mtime $DAYS_AGO | wc -l)
  if [ "$FILE_COUNT" -eq 0 ]; then
    echo -e "[!!ERROR!!] No files matching FILENAME_GLOB_PATTERN modified $DAYS_AGO DAYS_AGO (-daystart) were found in BACKUPS_SOURCE_DIR\n"
    echo -e "FILENAME_GLOB_PATTERN: $FILENAME_GLOB_PATTERN\n"
    echo -e "BACKUPS_SOURCE_DIR: $BACKUPS_SOURCE_DIR\n"
    exit 1
  fi

  ###################################################################
	### TARBALL THE RELEVANT BACKUP FILES FROM BACKUPS_SOURCE_DIR   ###
  ### AND STORE IN THIS_BACKUP_DIR_PATH, THEN UPLOAD TO THE CLOUD ###
	###################################################################

  echo -e "Tarballing and then uploading to the cloud...\n"
  echo -e "FILE_COUNT: $FILE_COUNT\n"
  echo -e "THIS_TARBALL_PATH: $THIS_TARBALL_PATH\n"

  # Note: https://unix.stackexchange.com/questions/92346/why-does-find-mtime-1-only-return-files-older-than-2-days
  # Credit: https://stackoverflow.com/questions/10730199/linux-all-files-of-folder-modified-yesterday
  # Credit: https://stackoverflow.com/questions/5891866/find-files-and-tar-them-with-spaces

  FIND_THEN_TAR=`cd $BACKUPS_SOURCE_DIR; find . -name "$FILENAME_GLOB_PATTERN" -type f -daystart -mtime $DAYS_AGO -print0 | tar --remove-files -czf $THIS_TARBALL_PATH --null -T -`
  if ! $FIND_THEN_TAR; then
    echo "[!!ERROR!!] Failed to combine database backups into one .tar.gz file"
  else
    echo -e "Backup files have been combined into one .tar.gz file.\n"
    if [ "$CLOUD_BUCKET_URI" != "" ]
    then
      if ! gsutil cp $THIS_TARBALL_PATH $CLOUD_BUCKET_URI; then
        echo "[!!ERROR!!] Failed to copy .tar.gz file to $CLOUD_BUCKET_URI"
      else
        echo -e "The .tar.gz file has been copied to $CLOUD_BUCKET_URI\n"
      fi
    fi

  fi

  echo -e "Done.\n"

}


########################
#### MONTHLY BACKUP ####
########################

# MONTHLY BACKUPS
DAY_OF_MONTH=`date +%d`
if [ $DAY_OF_MONTH -eq 2 ]; then
	perform_backups "monthly"
	exit 0
fi


########################
#### DAILY BACKUP ####
########################

# Delete daily backups DAYS_TO_KEEP days old or more
find $BACKUPS_FERRY_DIR -maxdepth 1 -mtime +$DAYS_TO_KEEP -name "*-daily.tar.gz" -exec rm -rf '{}' ';'
# Delete log files DAYS_TO_KEEP days old or more
# Disabled, because the log files are only 1kB, and this would also remove logs for monthly backups.
#find $BACKUPS_DIR -maxdepth 1 -mtime +$DAYS_TO_KEEP -name "*.log" -exec rm -rf '{}' ';'
perform_backups "daily"
