## Loading ISO alpha-3 country codes into the country table and updating the view

ISO.org seem to charge about £237 for the full list!
https://www.iso.org/obp/ui/#iso:pub:PUB500001:en

UN.org provide it for free, if we can map (reliably) by country name.
https://unstats.un.org/unsd/methodology/m49/overview/

Unfortunately, we can't map (reliably) by name; there are 27 mismatches (in hindsight).
```
cd ~
sudo apt-get install -y gawk
gawk '{print $9, $11}' FPAT="([^,]+)|(\"[^\"]+\")" OFS="," "UNSD — Methodology.csv" > UNSD_countries.csv
cat UNSD_countries.csv
```

So I'm going to use this list (copied to a text file):
http://www.nationsonline.org/oneworld/country_code_list.htm

Update the countries table (ISO use the column name `alpha_3_code` in their "sample" CSV file.)
```
\d observatory.countries
ALTER TABLE observatory.countries ADD COLUMN alpha_3_code CHAR(3);
\d observatory.countries
```

We need to update the corresponding view, because we need the `alpha_3_code` at the plugin level (and the plugin should only download views, by design).
```
DROP VIEW observatory.countries_view;
CREATE VIEW observatory.countries_view AS
SELECT co.country_id
 , co.lat
 , co.lng
 , co.name
 , co.alpha_3_code
 , COUNT(sa.sample_id) AS num_samples
FROM observatory.countries co
JOIN observatory.sites si ON si.country_id = co.country_id
JOIN observatory.samples sa ON sa.site_id = si.site_id
GROUP BY co.country_id
;

SELECT * FROM observatory.countries_view LIMIT 10;
```

Next, we need to import the codes from a file, matching on the country name.

Remove the columns that we don't need from the `country_code_list.txt` file.
```
cd ~
cut -d$'\t' -f2,3 country_code_list.txt > country_codes.tsv
cat country_codes.tsv
```


Copying the file to the server:
```
scp ~/country_codes.tsv lee@35.185.117.147:/home/lee/
```

Import the data:
```
ssh 35.185.117.147
sudo cp ~/country_codes.tsv /var/lib/postgresql/
sudo chown postgres:postgres /var/lib/postgresql/country_codes.tsv
ll /var/lib/postgresql/
psql --host=127.0.0.1 --port=5432 --dbname=observatory_dev1 --username=lee
CREATE TABLE observatory.tmp_country_codes (alpha_2_code char(2), alpha_3_code char(3));
COPY observatory.tmp_country_codes(alpha_2_code, alpha_3_code) FROM '/var/lib/postgresql/country_codes.tsv' DELIMITER E'\t' CSV HEADER;
SELECT * FROM observatory.tmp_country_codes;
SELECT country_id, name, alpha_3_code FROM observatory.countries;
UPDATE observatory.countries AS c
SET alpha_3_code = tcc.alpha_3_code
FROM observatory.tmp_country_codes tcc
WHERE c.country_id = tcc.alpha_2_code;
SELECT country_id, name, alpha_3_code FROM observatory.countries;
SELECT country_id, name, alpha_3_code FROM observatory.countries WHERE alpha_3_code IS NULL;
DROP TABLE observatory.tmp_country_codes;
\dt observatory.
```


## Loading GeoJSON polygons into the country table and updating the view

The GeoJSON for all the countries ("ADMIN" areas) can be sourced from here (found by Ben):
https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson

That file is about 24 MB and contains the country name (which we know can be unreliable for matching) and the ISO alpha-3 codes.

The python script `add_geojson_to_country_codes.py` was written to process that file and add the GeoJSON to the `country_codes.tsv` file, to make `country_codes_and_geojson.tsv`.

To run the script, simply change to the relevant directory and type:
```
python add_geojson_to_country_codes.py
``

Copy the file to the server:
```
scp country_codes_and_geojson.tsv lee@35.185.117.147:/home/lee/
```

The countries table and view were updated:
```
\d observatory.countries
ALTER TABLE observatory.countries ADD COLUMN geojson json;
\d observatory.countries
```
```
DROP VIEW observatory.countries_view;
CREATE VIEW observatory.countries_view AS
SELECT co.country_id
 , co.lat
 , co.lng
 , co.name
 , co.alpha_3_code
 , co.geojson
 , COUNT(sa.sample_id) AS num_samples
FROM observatory.countries co
JOIN observatory.sites si ON si.country_id = co.country_id
JOIN observatory.samples sa ON sa.site_id = si.site_id
GROUP BY co.country_id
;

SELECT * FROM observatory.countries_view LIMIT 10;
```

Import the data:
```
ssh 35.185.117.147
sudo cp country_codes_and_geojson.tsv /var/lib/postgresql/
sudo chown postgres:postgres /var/lib/postgresql/country_codes_and_geojson.tsv
ll /var/lib/postgresql/
psql --host=127.0.0.1 --port=5432 --dbname=observatory_dev1 --username=lee
CREATE TABLE observatory.tmp_country_codes_and_geojson (alpha_2_code char(2), alpha_3_code char(3), geojson json);
COPY observatory.tmp_country_codes_and_geojson(alpha_2_code, alpha_3_code, geojson) FROM '/var/lib/postgresql/country_codes_and_geojson.tsv' DELIMITER E'\t' CSV HEADER QUOTE '''' ESCAPE E'\\';
SELECT alpha_2_code, alpha_3_code, LEFT(geojson::text, 100) AS geojson_snippet FROM observatory.tmp_country_codes_and_geojson LIMIT 10;
SELECT country_id, name, alpha_3_code, LEFT(geojson::text, 100) AS geojson_snippet FROM observatory.countries_view;
UPDATE observatory.countries AS c
SET alpha_3_code = tccg.alpha_3_code, geojson = tccg.geojson
FROM observatory.tmp_country_codes_and_geojson tccg
WHERE c.country_id = tccg.alpha_2_code;
SELECT country_id, name, alpha_3_code, LEFT(geojson::text, 10) AS geojson_snippet FROM observatory.countries_view;
SELECT country_id, name, alpha_3_code, LEFT(geojson::text, 10) AS geojson_snippet FROM observatory.countries_view WHERE alpha_3_code IS NULL OR geojson IS NULL;
DROP TABLE observatory.tmp_country_codes_and_geojson;
\dt observatory.
```


## Loading colours into the regions table.

Colours have been written to `region_web_colours.tsv` in this directory.

Copy the file to the server:
```
scp region_web_colours.tsv lee@35.185.117.147:/home/lee/
```

Update the regions table and view:
```
\d observatory.regions
ALTER TABLE observatory.regions ADD COLUMN web_colour varchar(25);
\d observatory.regions
```
```
DROP VIEW observatory.regions_view;
CREATE VIEW observatory.regions_view AS 
SELECT re.region_id
 , re.lat
 , re.lng
 , re.name
 , re.description
 , re.web_colour
 , COUNT(sa.sample_id) AS num_samples
FROM observatory.regions re
JOIN observatory.sites si ON si.region_id = re.region_id
JOIN observatory.samples sa ON sa.site_id = si.site_id
GROUP BY re.region_id
;

SELECT * FROM observatory.regions_view LIMIT 10;
```

Note on dropping a column (if you change your mind):
```
observatory_dev1=# ALTER TABLE observatory.regions DROP COLUMN web_colour CASCADE;
NOTICE:  drop cascades to view observatory.regions_view
ALTER TABLE
```


Import the data:
```
ssh 35.185.117.147
sudo cp region_web_colours.tsv /var/lib/postgresql/
sudo chown postgres:postgres /var/lib/postgresql/region_web_colours.tsv
ll /var/lib/postgresql/
psql --host=127.0.0.1 --port=5432 --dbname=observatory_dev1 --username=lee
CREATE TABLE observatory.tmp_region_web_colours (region_id varchar(50), web_colour varchar(20));
COPY observatory.tmp_region_web_colours(region_id, web_colour) FROM '/var/lib/postgresql/region_web_colours.tsv' DELIMITER E'\t' CSV HEADER NULL AS '';
SELECT region_id, web_colour FROM observatory.tmp_region_web_colours;
SELECT region_id, web_colour FROM observatory.regions_view;
UPDATE observatory.regions AS r
SET web_colour = rwc.web_colour
FROM observatory.tmp_region_web_colours rwc
WHERE r.region_id = rwc.region_id;
SELECT region_id, web_colour FROM observatory.regions_view;
DROP TABLE observatory.tmp_region_web_colours;
\dt observatory.
```



