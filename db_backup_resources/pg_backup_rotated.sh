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
if [ "$BACKUP_USER" != "" -a "$(id -un)" != "$BACKUP_USER" ] ; then
	echo "This script must be run as $BACKUP_USER. Exiting." 1>&2
	exit 1
fi
 
 
###########################
### INITIALISE DEFAULTS ###
###########################

if [ ! $USERNAME ]; then
	USERNAME="postgres"
fi;
 
 
###########################
#### START THE BACKUPS ####
###########################
 
function perform_backups()
{
	BACKUP_TYPE=$1 # daily, weekly, monthly
  BACKUP_DIR_NAME="`date +\%Y-\%m-\%d`-$BACKUP_TYPE/"
	BACKUP_DIR_PATH=$BACKUP_DIR"$BACKUP_DIR_NAME/"
 
	echo "Making backup directory in $BACKUP_DIR_PATH"
 
	if ! mkdir -p $BACKUP_DIR_PATH; then
		echo "Cannot create backup directory in $BACKUP_DIR_PATH. Go and fix it!" 1>&2
		exit 1;
	fi;
 
	#######################
	### GLOBALS BACKUPS ###
	#######################
 
	echo -e "\n\nPerforming globals backup"
	echo -e "--------------------------------------------\n"
 
	if [ $ENABLE_GLOBALS_BACKUPS = "yes" ]
	then
		    echo "Globals backup"
 
		    if ! pg_dumpall -g -U "$USERNAME" | gzip > $BACKUP_DIR_PATH"globals".sql.gz.in_progress; then
		            echo "[!!ERROR!!] Failed to produce globals backup" 1>&2
		    else
		            mv $BACKUP_DIR_PATH"globals".sql.gz.in_progress $BACKUP_DIR_PATH"globals".sql.gz
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
 
	SCHEMA_ONLY_DB_LIST=`psql -U "$USERNAME" -At -c "$SCHEMA_ONLY_QUERY" postgres`
 
	echo -e "The following databases were matched for schema-only backup:\n${SCHEMA_ONLY_DB_LIST}\n"
 
	for DATABASE in $SCHEMA_ONLY_DB_LIST
	do
	        echo "Schema-only backup of $DATABASE"
 
	        if ! pg_dump -Fp -s -U "$USERNAME" "$DATABASE" | gzip > $BACKUP_DIR_PATH"$DATABASE"_SCHEMA.sql.gz.in_progress; then
	                echo "[!!ERROR!!] Failed to backup database schema of $DATABASE" 1>&2
	        else
	                mv $BACKUP_DIR_PATH"$DATABASE"_SCHEMA.sql.gz.in_progress $BACKUP_DIR_PATH"$DATABASE"_SCHEMA.sql.gz
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
 
	for DATABASE in `psql -U "$USERNAME" -At -c "$FULL_BACKUP_QUERY" postgres`
	do
		if [ $ENABLE_PLAIN_BACKUPS = "yes" ]
		then
			echo "Plain backup of $DATABASE"
 
			if ! pg_dump -Fp -U "$USERNAME" "$DATABASE" | gzip > $BACKUP_DIR_PATH"$DATABASE".sql.gz.in_progress; then
				echo "[!!ERROR!!] Failed to produce plain backup database $DATABASE" 1>&2
			else
				mv $BACKUP_DIR_PATH"$DATABASE".sql.gz.in_progress $BACKUP_DIR_PATH"$DATABASE".sql.gz
			fi
		fi
 
		if [ $ENABLE_CUSTOM_BACKUPS = "yes" ]
		then
			echo "Custom backup of $DATABASE"
 
			if ! pg_dump -Fc -U "$USERNAME" "$DATABASE" -f $BACKUP_DIR_PATH"$DATABASE".custom.in_progress; then
				echo "[!!ERROR!!] Failed to produce custom backup database $DATABASE"
			else
				mv $BACKUP_DIR_PATH"$DATABASE".custom.in_progress $BACKUP_DIR_PATH"$DATABASE".custom
			fi
		fi
 
    if [ $ENABLE_DIRECTORY_BACKUPS = "yes" ]
 		then
 			echo "Directory backup of $DATABASE"
  
 			if ! pg_dump -Fd -U "$USERNAME" "$DATABASE" -f $BACKUP_DIR_PATH"$DATABASE".directory.in_progress; then
 				echo "[!!ERROR!!] Failed to produce directory backup database $DATABASE"
 			else
 				mv $BACKUP_DIR_PATH"$DATABASE".directory.in_progress $BACKUP_DIR_PATH"$DATABASE".directory
 			fi
 		fi
 
	done
 
	echo -e "\nAll database backups complete!"
  
  if [ $ZIP_ALL_BACKUPS = "yes" ]
  then
    tar -czf "$BACKUP_DIR_NAME".tar.gz $BACKUP_DIR && rm -R $BACKUP_DIR
    echo -e "\nAll database backups have been compressed into one file."
  fi
}
 
# MONTHLY BACKUPS
 
DAY_OF_MONTH=`date +%d`
 
if [ $DAY_OF_MONTH -eq 1 ];
then
	# Delete all expired monthly directories
	find $BACKUP_DIR -maxdepth 1 -name "*-monthly" -exec rm -rf '{}' ';'
 
	perform_backups "monthly"
 
	exit 0;
fi
 
# WEEKLY BACKUPS
 
DAY_OF_WEEK=`date +%u` #1-7 (Monday-Sunday)
EXPIRED_DAYS=`expr $((($WEEKS_TO_KEEP * 7) + 1))`
 
if [ $DAY_OF_WEEK = $DAY_OF_WEEK_TO_KEEP ];
then
	# Delete all expired weekly directories
	find $BACKUP_DIR -maxdepth 1 -mtime +$EXPIRED_DAYS -name "*-weekly" -exec rm -rf '{}' ';'
 
	perform_backups "weekly"
 
	exit 0;
fi
 
# DAILY BACKUPS
 
# Delete daily backups 7 days old or more
find $BACKUP_DIR -maxdepth 1 -mtime +$DAYS_TO_KEEP -name "*-daily" -exec rm -rf '{}' ';'
 
perform_backups "daily"