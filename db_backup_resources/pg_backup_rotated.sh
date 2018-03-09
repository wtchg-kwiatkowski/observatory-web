#!/bin/bash
 
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
        CONFIG_FILE_PATH="${SCRIPTPATH}/pg_backup.config"
fi
 
if [ ! -r ${CONFIG_FILE_PATH} ] ; then
        echo "Could not load config file from ${CONFIG_FILE_PATH}" 1>&2
        exit 1
fi
 
source "${CONFIG_FILE_PATH}"
 
###########################
#### PRE-BACKUP CHECKS ####
###########################
 
# Make sure we're running as the required backup user
if [ "$RUN_AS_USER" != "" -a "$(id -un)" != "$RUN_AS_USER" ]; then
	echo "This script must be run as $RUN_AS_USER. Exiting." 1>&2
	exit 1
fi
 
 
###########################
### INITIALISE DEFAULTS ###
###########################

if [ ! $DB_USER ]; then
	DB_USER="postgres"
fi
 
 
###########################
#### START THE BACKUPS ####
###########################
 
function perform_backups()
{
	THIS_BACKUP_TYPE=$1 # daily, weekly, monthly
  
  # The monthly naming scheme is the default.
  THIS_BACKUP_DIR_NAME="`date +\%Y-\%m-\%d`-$THIS_BACKUP_TYPE"
  
  WEEKNUMBER=$((($(date +%-d)-1)/7+1))
  
  if [ "$THIS_BACKUP_TYPE" = 'weekly' ]; then

    THIS_BACKUP_DIR_NAME="`date +\%A`$WEEKNUMBER-$THIS_BACKUP_TYPE"

  elif [ "$THIS_BACKUP_TYPE" = 'daily' ]; then

    THIS_BACKUP_DIR_NAME="`date +\%d`-$THIS_BACKUP_TYPE"

  fi
  
  
	THIS_BACKUP_DIR_PATH="$BACKUPS_DIR/$THIS_BACKUP_DIR_NAME/"
 
	echo "Making backup directory in $THIS_BACKUP_DIR_PATH"
 
	if ! mkdir -p $THIS_BACKUP_DIR_PATH; then
		echo "Cannot create backup directory in $THIS_BACKUP_DIR_PATH. Exiting." 1>&2
		exit 1
	fi
 
	#######################
	### GLOBALS BACKUPS ###
	#######################
 
	echo -e "\n\nPerforming globals backup"
	echo -e "--------------------------------------------\n"
 
	if [ $ENABLE_GLOBALS_BACKUPS = "yes" ]
	then
		    echo "Globals backup"
 
		    if ! pg_dumpall -g -U "$DB_USER" | gzip > $THIS_BACKUP_DIR_PATH"globals".sql.gz.in_progress; then
		            echo "[!!ERROR!!] Failed to produce globals backup" 1>&2
		    else
		            mv $THIS_BACKUP_DIR_PATH"globals".sql.gz.in_progress $THIS_BACKUP_DIR_PATH"globals".sql.gz
		    fi
	else
		echo "None"
	fi
 
 
	###########################
	### SCHEMA-ONLY BACKUPS ###
	###########################
 
	for SCHEMA_ONLY_DB in ${SCHEMA_ONLY_LIST//,/ }
	do
	        SCHEMA_ONLY_CLAUSE="$SCHEMA_ONLY_CLAUSE or datname ~ '$SCHEMA_ONLY_DB'"
	done
 
	SCHEMA_ONLY_QUERY="select datname from pg_database where false $SCHEMA_ONLY_CLAUSE order by datname;"
 
	echo -e "\n\nPerforming schema-only backups"
	echo -e "--------------------------------------------\n"
 
	SCHEMA_ONLY_DB_LIST=`psql -U "$DB_USER" -At -c "$SCHEMA_ONLY_QUERY" postgres`
 
	echo -e "The following databases were matched for schema-only backup:\n${SCHEMA_ONLY_DB_LIST}\n"
 
	for DATABASE in $SCHEMA_ONLY_DB_LIST
	do
	        echo "Schema-only backup of $DATABASE"
 
	        if ! pg_dump -Fp -s -U "$DB_USER" "$DATABASE" | gzip > $THIS_BACKUP_DIR_PATH"$DATABASE"_SCHEMA.sql.gz.in_progress; then
	                echo "[!!ERROR!!] Failed to backup database schema of $DATABASE" 1>&2
	        else
	                mv $THIS_BACKUP_DIR_PATH"$DATABASE"_SCHEMA.sql.gz.in_progress $THIS_BACKUP_DIR_PATH"$DATABASE"_SCHEMA.sql.gz
	        fi
	done
 
 
	###########################
	###### FULL BACKUPS #######
	###########################
 
	for SCHEMA_ONLY_DB in ${SCHEMA_ONLY_LIST//,/ }
	do
		EXCLUDE_SCHEMA_ONLY_CLAUSE="$EXCLUDE_SCHEMA_ONLY_CLAUSE and datname !~ '$SCHEMA_ONLY_DB'"
	done
 
	FULL_BACKUP_QUERY="select datname from pg_database where not datistemplate and datallowconn $EXCLUDE_SCHEMA_ONLY_CLAUSE order by datname;"
 
	echo -e "\n\nPerforming full backups"
	echo -e "--------------------------------------------\n"
 
	for DATABASE in `psql -U "$DB_USER" -At -c "$FULL_BACKUP_QUERY" postgres`
	do
		if [ $ENABLE_PLAIN_BACKUPS = "yes" ]
		then
			echo "Plain backup of $DATABASE"
 
			if ! pg_dump -Fp -U "$DB_USER" "$DATABASE" | gzip > $THIS_BACKUP_DIR_PATH"$DATABASE".sql.gz.in_progress; then
				echo "[!!ERROR!!] Failed to produce plain backup database $DATABASE" 1>&2
			else
				mv $THIS_BACKUP_DIR_PATH"$DATABASE".sql.gz.in_progress $THIS_BACKUP_DIR_PATH"$DATABASE".sql.gz
			fi
		fi
 
		if [ $ENABLE_CUSTOM_BACKUPS = "yes" ]
		then
			echo "Custom backup of $DATABASE"
 
			if ! pg_dump -Fc -U "$DB_USER" "$DATABASE" -f $THIS_BACKUP_DIR_PATH"$DATABASE".custom.in_progress; then
				echo "[!!ERROR!!] Failed to produce custom backup database $DATABASE"
			else
				mv $THIS_BACKUP_DIR_PATH"$DATABASE".custom.in_progress $THIS_BACKUP_DIR_PATH"$DATABASE".custom
			fi
		fi
 
    if [ $ENABLE_DIRECTORY_BACKUPS = "yes" ]
 		then
 			echo "Directory backup of $DATABASE"
  
 			if ! pg_dump -Fd -U "$DB_USER" "$DATABASE" -f $THIS_BACKUP_DIR_PATH"$DATABASE".directory.in_progress; then
 				echo "[!!ERROR!!] Failed to produce directory backup database $DATABASE"
 			else
 				mv $THIS_BACKUP_DIR_PATH"$DATABASE".directory.in_progress $THIS_BACKUP_DIR_PATH"$DATABASE".directory
 			fi
 		fi
 
	done
 
	echo -e "\nAll database backups complete!"


  ##############################
	###### .tar.gz & CLOUD #######
	##############################
 
  echo -e "\n\nPerforming further actions"
	echo -e "--------------------------------------------\n"

  if [ $TGZ_EACH_SET_OF_BACKUPS = "yes" ]
  then
    if ! tar -czf "$THIS_BACKUP_DIR_NAME".tar.gz -C $THIS_BACKUP_DIR_PATH .; then
      echo "[!!ERROR!!] Failed to compress database backups into one .tar.gz file"
    else
      rm -r $THIS_BACKUP_DIR_PATH
      mv "$THIS_BACKUP_DIR_NAME".tar.gz $BACKUPS_DIR
      echo -e "\nAll database backups have been compressed into one .tar.gz file."
      
      if [ $COPY_BACKUP_TO_CLOUD_BUCKET = "yes" ] && [ $CLOUD_BUCKET_URI ]
      then
        if ! gsutil cp $BACKUPS_DIR/"$THIS_BACKUP_DIR_NAME".tar.gz $CLOUD_BUCKET_URI; then
          echo "[!!ERROR!!] Failed to copy .tar.gz file to $CLOUD_BUCKET_URI"
        else
          echo -e "\The .tar.gz file has been copied to $CLOUD_BUCKET_URI"
        fi
      fi  
      
    fi

  else

    if [ $COPY_BACKUP_TO_CLOUD_BUCKET = "yes" ] && [ $CLOUD_BUCKET_URI ]
    then
      if ! gsutil -m cp -r $THIS_BACKUP_DIR_PATH $CLOUD_BUCKET_URI; then
        echo "[!!ERROR!!] Failed to copy backup directory to $CLOUD_BUCKET_URI"
      else
        echo -e "\nBackup directory has been copied to $CLOUD_BUCKET_URI"
      fi
    fi  

  fi

	echo -e "\nDone."
  
}
 
# MONTHLY BACKUPS
 
DAY_OF_MONTH=`date +%d`
 
if [ $DAY_OF_MONTH -eq 1 ];
then
	# Delete all expired monthly directories
	# find $BACKUPS_DIR -maxdepth 1 -name "*-monthly.tar.gz" -exec rm -rf '{}' ';'
 
	perform_backups "monthly"
 
	exit 0
fi
 
# WEEKLY BACKUPS
 
DAY_OF_WEEK=`date +%u` #1-7 (Monday-Sunday)
EXPIRED_DAYS=`expr $((($WEEKS_TO_KEEP * 7) + 1))`
 
if [ $DAY_OF_WEEK = $DAY_TO_PERFORM_WEEKLY_BACKUP ];
then
	# Delete all expired weekly directories
	find $BACKUPS_DIR -maxdepth 1 -mtime +$EXPIRED_DAYS -name "*-weekly.tar.gz" -exec rm -rf '{}' ';'
 
	perform_backups "weekly"
 
	exit 0
fi
 
# DAILY BACKUPS
 
# Delete daily backups DAYS_TO_KEEP days old or more
find $BACKUPS_DIR -maxdepth 1 -mtime +$DAYS_TO_KEEP -name "*-daily.tar.gz" -exec rm -rf '{}' ';'

# Delete log files DAYS_TO_KEEP days old or more
find $BACKUPS_DIR -maxdepth 1 -mtime +$DAYS_TO_KEEP -name "*.log" -exec rm -rf '{}' ';'
 
perform_backups "daily"
