#!/usr/bin/env bash

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
  
  ############################################
  ###### DETERMINE BACKUP TARGET PATHS #######
  ############################################
  
	THIS_BACKUP_TYPE=$1 # daily, monthly
  # The monthly naming scheme is the default.
  THIS_BACKUP_DIR_NAME="`date +\%Y-\%m-\%d`-$THIS_BACKUP_TYPE"
  if [ "$THIS_BACKUP_TYPE" = 'daily' ]; then
    THIS_BACKUP_DIR_NAME="`date +\%d`-$THIS_BACKUP_TYPE"
  fi
  THIS_BACKUP_DIR_PATH="$BACKUPS_DIR/$THIS_BACKUP_DIR_NAME/"
 
	echo "Making temporary backup directory in $THIS_BACKUP_DIR_PATH"
 
	if ! mkdir -p $THIS_BACKUP_DIR_PATH; then
		echo "Cannot create backup directory in $THIS_BACKUP_DIR_PATH. Exiting." 1>&2
		exit 1
	fi


  #########################
	### FIND BACKUP FILES ###
	#########################

  # TODO





  #################################################
	### MOVE BACKUP FILES TO THIS_BACKUP_DIR_NAME ###
	#################################################
  
  # TODO
  


  #################################################################
	###### TARBALL THIS_BACKUP_DIR_PATH & UPLOAD TO THE CLOUD #######
	#################################################################

  echo -e "\n\nTarballing and then uploading to the cloud"
  echo -e "--------------------------------------------\n"

  if ! tar -czf "$THIS_BACKUP_DIR_NAME".tar.gz -C $THIS_BACKUP_DIR_PATH .; then
    echo "[!!ERROR!!] Failed to compress database backups into one .tar.gz file"
  else
    rm -r $THIS_BACKUP_DIR_PATH
    mv "$THIS_BACKUP_DIR_NAME".tar.gz $BACKUPS_DIR
    echo -e "\nAll backups have been compressed into one .tar.gz file."
    
    if [ "$CLOUD_BUCKET_URI" != "" ]
    then
      if ! gsutil cp $BACKUPS_DIR/"$THIS_BACKUP_DIR_NAME".tar.gz $CLOUD_BUCKET_URI; then
        echo "[!!ERROR!!] Failed to copy .tar.gz file to $CLOUD_BUCKET_URI"
      else
        echo -e "\The .tar.gz file has been copied to $CLOUD_BUCKET_URI"
      fi
    fi  
    
  fi

  echo -e "\nDone."
  
}


########################
#### MONTHLY BACKUP ####
########################

# MONTHLY BACKUPS
DAY_OF_MONTH=`date +%d`
if [ $DAY_OF_MONTH -eq 1 ];
then
	perform_backups "monthly"
	exit 0
fi


########################
#### DAILY BACKUP ####
########################

# Delete daily backups DAYS_TO_KEEP days old or more
find $BACKUPS_DIR -maxdepth 1 -mtime +$DAYS_TO_KEEP -name "*-daily.tar.gz" -exec rm -rf '{}' ';'
# Delete log files DAYS_TO_KEEP days old or more
# Disabled, because the log files are only 1kB, and this would also remove logs for monthly backups.
#find $BACKUPS_DIR -maxdepth 1 -mtime +$DAYS_TO_KEEP -name "*.log" -exec rm -rf '{}' ';'
perform_backups "daily"
