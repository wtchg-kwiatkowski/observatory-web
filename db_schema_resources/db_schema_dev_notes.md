

## Setting up a clone of an existing Observatory db and web app

I don't want to mess up the existing Observatory db and web app, so I'm going to create a dispensable clone.

### How to clone a database in PostgreSQL

If the database is idle, you can do this:
```
ssh 35.185.117.147
psql -d postgres -U lee
  psql (9.6.3)
  Type "help" for help.

  postgres=# 

CREATE DATABASE observatory_dev1 WITH TEMPLATE observatory OWNER lee;
```

To terminate activity (CAREFUL!):
```
SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity 
WHERE pg_stat_activity.datname = 'observatory' AND pid <> pg_backend_pid();
```

To quit psql, enter `\q`.


### How to clone a dataset in Panoptes

```
ssh 104.199.5.137
cd /mnt/disks/ssd0/source-dev/datasets/
sudo cp -r observatory observatory_dev1
sudo chmod -R ug=rwX,o-rwx observatory_dev1/
sudo chown -R www-data:www-data observatory_dev1/
logout
ssh 104.199.5.137
ll /mnt/disks/ssd0/source-dev/datasets/
```

Prevent the studies plugin from running again on this dataset. (To be superceded.)
```
rm -rf /mnt/disks/ssd0/source-dev/datasets/observatory_dev1/pre/studies
```

Check you have web access (otherwise might need to find and edit `PanoptesAuthDb`.

http://104.199.5.137:9000/panoptes/observatory_dev1

Edit the name of the dataset using the Admin tool, e.g. `nameBanner: Observatory (dev1)`, to help us distinguish the clones.

Try reimporting everything to check that works.



## Getting the tables and columns right



### Fixing the regions issue.


To look at the new `regions` source in the existing Panoptes `Pf60` dataset `samples` table:

On the server:
```
ssh 104.199.5.137
cd /mnt/disks/ssd0/source-prod/datasets/Pf60/datatables/samples/
```

On the web: https://www.malariagen.net/panoptes/Pf60

The `Pf60_Internal` dataset has the `SubContinentName` enabled, so I'll use this instead:
https://www.malariagen.net/panoptes/Pf60_Internal

(Checked these were the same as `Pf60` dataset.)

#### Getting the region data

To get the region IDs and Names (there are no region Lat Longs yet):
```
New tab > Samples
Pick columns: {SubContinentcode; SubContinentName} > Use > Download data > Pf60_Sample_SubContinents.txt
```

To dedupe the records:
```
head -1 Pf60_Sample_SubContinents.txt > regions_header.txt
sed '1d' Pf60_Sample_SubContinents.txt > sample_regions.txt
sort sample_regions.txt | uniq > regions.txt
cat regions.txt
```

#### Getting the site-region relationship

To get the `site.region` relationships:
```
New tab > Samples
Pick columns: {Site; SubContinentcode} > Use > Download data > Pf60_Sample_Site_SubContinents.txt
```

To dedupe the records:
```
head -1 Pf60_Sample_Site_SubContinents.txt > site_regions_header.txt
sed '1d' Pf60_Sample_Site_SubContinents.txt > sample_site_regions.txt
sort sample_site_regions.txt | uniq > site_regions.txt
cat site_regions.txt
```

#### Removing the old country-region relationship

To remove the `region_id` column from the `countries` table:
```
ssh 35.185.117.147
psql --host=127.0.0.1 --port=5432 --dbname=observatory_dev1 --username=lee
\d observatory.countries
  Table "observatory.countries"
  Column   |         Type          | Modifiers 
  ------------+-----------------------+-----------
  country_id | character varying(3)  | not null
  name       | text                  | not null
  lat        | double precision      | not null
  lng        | double precision      | not null
  region_id  | character varying(50) | 
  Indexes:
  "countries_pkey" PRIMARY KEY, btree (country_id)
  Foreign-key constraints:
  "regions" FOREIGN KEY (region_id) REFERENCES observatory.regions(region_id) DEFERRABLE INITIALLY DEFERRED
  Referenced by:
  TABLE "observatory.sites" CONSTRAINT "country" FOREIGN KEY (country_id) REFERENCES observatory.countries(country_id) DEFERRABLE INITIALLY DEFERRED
  Triggers:
  audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON observatory.countries FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true')
  audit_trigger_stm AFTER TRUNCATE ON observatory.countries FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true')

ALTER TABLE observatory.countries DROP COLUMN region_id;
\d observatory.countries
```


#### Importing the regions

Here's the current `regions` table (currently unpopulated):
```
\d observatory.regions
Table "observatory.regions"
Column    |         Type          | Modifiers 
-------------+-----------------------+-----------
region_id   | character varying(50) | not null
lat         | double precision      | not null
lng         | double precision      | not null
name        | character varying(50) | not null
description | text                  | 
Indexes:
"region_pkey" PRIMARY KEY, btree (region_id)
Triggers:
audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON observatory.regions FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true')
audit_trigger_stm AFTER TRUNCATE ON observatory.regions FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true')
```

I don't have lat lngs for regions yet, so I'm going to skip that.

Are there currently any default values for lat lngs?
```
SELECT column_name, column_default FROM information_schema.columns WHERE table_name='regions';
  column_name | column_default 
  -------------+----------------
  region_id   | 
  lat         | 
  lng         | 
  name        | 
  description | 
```
(Nope.)

I can either set defaults for the columns, or upload bogus values.
Uploading bogus values would better represent the ideal situation.

##### Adding bogus lat lngs to the data file

```
awk '$0=$0"\t0\t0"' regions.txt > regions_with_bogusCoords.txt
cat regions_with_bogusCoords.txt
```

##### Copying the file to the server

```
scp regions_with_bogusCoords.txt lee@35.185.117.147:/home/lee/
```

#### Importing the regions data from the file

```
ssh 35.185.117.147
sudo mv ~/regions_with_bogusCoords.txt /var/lib/postgresql/
sudo chown postgres:postgres /var/lib/postgresql/regions_with_bogusCoords.txt
ll /var/lib/postgresql/
psql --host=127.0.0.1 --port=5432 --dbname=observatory_dev1 --username=lee
SELECT * FROM observatory.regions;
COPY observatory.regions(region_id, name, lat, lng) FROM '/var/lib/postgresql/regions_with_bogusCoords.txt' DELIMITER E'\t' CSV;
SELECT * FROM observatory.regions;

```

### Adding the `region_id` to the `sites` table

To add the `region_id` to the `sites` table:
```
\d observatory.sites
ALTER TABLE observatory.sites ADD COLUMN region_id VARCHAR(50) REFERENCES observatory.regions (region_id);
\d observatory.sites
  Table "observatory.sites"
  Column   |         Type          | Modifiers 
  ------------+-----------------------+-----------
  site_id    | character varying(50) | not null
  name       | text                  | not null
  country_id | character varying(3)  | not null
  lat        | double precision      | not null
  lng        | double precision      | not null
  region_id  | character varying(50) | 
  Indexes:
  "sites_pkey" PRIMARY KEY, btree (site_id)
  "site_lat_lng" UNIQUE CONSTRAINT, btree (lat, lng)
  Foreign-key constraints:
  "country" FOREIGN KEY (country_id) REFERENCES observatory.countries(country_id) DEFERRABLE INITIALLY DEFERRED
  "sites_region_id_fkey" FOREIGN KEY (region_id) REFERENCES observatory.regions(region_id)
  Referenced by:
  TABLE "observatory.samples" CONSTRAINT "site" FOREIGN KEY (site_id) REFERENCES observatory.sites(site_id) DEFERRABLE INITIALLY DEFERRED
  Triggers:
  audit_trigger_row AFTER INSERT OR DELETE OR UPDATE ON observatory.sites FOR EACH ROW EXECUTE PROCEDURE audit.if_modified_func('true')
  audit_trigger_stm AFTER TRUNCATE ON observatory.sites FOR EACH STATEMENT EXECUTE PROCEDURE audit.if_modified_func('true')

```

### Importing the site-region data from the file

The `site_id` field is not the same as the `sites.name`.

Copy the file to the server:
```
scp site_regions.txt lee@35.185.117.147:/home/lee/

```

Import the data:
```
ssh 35.185.117.147
sudo mv ~/site_regions.txt /var/lib/postgresql/
sudo chown postgres:postgres /var/lib/postgresql/site_regions.txt
ll /var/lib/postgresql/
psql --host=127.0.0.1 --port=5432 --dbname=observatory_dev1 --username=lee
CREATE TABLE observatory.tmp_site_regions (site_name text, region_id varchar(50));
COPY observatory.tmp_site_regions(site_name, region_id) FROM '/var/lib/postgresql/site_regions.txt' DELIMITER E'\t' CSV;
SELECT * FROM observatory.tmp_site_regions;
SELECT site_id, name, region_id FROM observatory.sites;
UPDATE observatory.sites AS s
SET region_id = sr.region_id
FROM observatory.tmp_site_regions sr
WHERE s.name = sr.site_name;
SELECT site_id, name, region_id FROM observatory.sites;
DROP TABLE observatory.tmp_site_regions;
\dt observatory.
```



## Getting the views right

Based on Ben's gist: https://gist.github.com/benjeffery/c18271260bcfd8e9a929d39080297850

regions:
```
CREATE VIEW observatory.regions_view AS 
SELECT re.region_id
 , re.lat
 , re.lng
 , re.name
 , re.description
 , COUNT(sa.sample_id) AS num_samples
FROM observatory.regions re
JOIN observatory.sites si ON si.region_id = re.region_id
JOIN observatory.samples sa ON sa.site_id = si.site_id
GROUP BY re.region_id
;

SELECT * FROM observatory.regions_view;

\dv observatory.
```


countries:
```
CREATE VIEW observatory.countries_view AS
SELECT co.country_id
 , co.lat
 , co.lng
 , co.name
 , COUNT(sa.sample_id) AS num_samples
FROM observatory.countries co
JOIN observatory.sites si ON si.country_id = co.country_id
JOIN observatory.samples sa ON sa.site_id = si.site_id
GROUP BY co.country_id
;

SELECT * FROM observatory.countries_view;

\dv observatory.
```


sites:
```
CREATE VIEW observatory.sites_view AS
SELECT si.site_id
 , si.lat
 , si.lng
 , si.name
 , COUNT(sa.sample_id) AS num_samples
FROM observatory.sites si
JOIN observatory.samples sa ON sa.site_id = si.site_id
GROUP BY si.site_id
;

SELECT * FROM observatory.sites_view;

\dv observatory.
```




features:
```
CREATE VIEW observatory.features_view AS
SELECT fe.feature_id
 , fe.name
 , fe.category
 , fe.description
FROM observatory.features fe
;

SELECT * FROM observatory.features_view;

\dv observatory.
```



samples:
```
CREATE VIEW observatory.samples_view AS
SELECT sa.sample_id
 , si.site_id
 , si.name AS site
 , co.country_id
 , co.name AS country
 , re.region_id
 , re.name AS region
 , si.lat AS site_lat
 , si.lng AS site_lng
 , co.lat AS country_lat
 , co.lng AS country_lng
 , re.lat AS region_lat
 , re.lng AS region_lng
 , sa.sampling_date
 , sa.process_type
 , sa.run_accessions
FROM observatory.samples sa
JOIN observatory.sites si ON si.site_id = sa.site_id
JOIN observatory.countries co ON co.country_id = si.country_id
JOIN observatory.regions re ON re.region_id = si.region_id
GROUP BY (sa.sample_id, si.site_id, co.country_id, re.region_id)
;

SELECT sample_id, region FROM observatory.samples_view LIMIT 10;

\dv observatory.
```

Tables from studies importer plugin: studies; study_people; study_publications.

Tables from previously supplied data: variants.























