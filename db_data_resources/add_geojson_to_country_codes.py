import urllib2
import csv
import json

# Credit: https://stackoverflow.com/questions/956867/how-to-get-string-objects-instead-of-unicode-from-json
def json_load_byteified(file_handle):
    return _byteify(
        json.load(file_handle, object_hook=_byteify),
        ignore_dicts=True
    )
def _byteify(data, ignore_dicts = False):
    # if this is a unicode string, return its string representation
    if isinstance(data, unicode):
        return data.encode('utf-8')
    # if this is a list of values, return list of byteified values
    if isinstance(data, list):
        return [ _byteify(item, ignore_dicts=True) for item in data ]
    # if this is a dictionary, return dictionary of byteified keys and values
    # but only if we haven't already byteified it
    if isinstance(data, dict) and not ignore_dicts:
        return {
            _byteify(key, ignore_dicts=True): _byteify(value, ignore_dicts=True)
            for key, value in data.iteritems()
        }
    # if it's anything else, return it in its original form
    return data


# Get the list of country codes
country_codes = []
country_codes_file_reader = csv.reader(open("country_codes.tsv"), delimiter="\t")
country_codes_file_header = country_codes_file_reader.next()
for alpha_2_code, alpha_3_code in country_codes_file_reader:
    country_codes.append({'alpha_2_code': alpha_2_code, 'alpha_3_code': alpha_3_code})
print 'len(country_codes): ' + str(len(country_codes))

# Get the GeoJSON features
request = urllib2.Request('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
geojson_file = urllib2.urlopen(request)
features = json_load_byteified(geojson_file)['features']

# Open the output file for writing.
with open('country_codes_and_geojson.tsv', 'w') as output_file:
    output_file_writer = csv.writer(output_file, delimiter="\t", quoting=csv.QUOTE_NONE, escapechar="\\", quotechar="'")
    
    # Write the header, plus a new geojson column.
    output_file_writer.writerow(country_codes_file_header + ['geojson'])
    
    # Loop through the GeoJSON features
    for feature in features:
        # Get the alpha-3 country code for this GeoJSON feature
        geojson_country_code = str(feature['properties']['ISO_A3'])
        print geojson_country_code + ' ' + str(feature['properties']['ADMIN'])
        
        # Loop through the list of country codes
        for i in range(len(country_codes)):

            # If we have a match, then write out the complete record.
            if country_codes[i]['alpha_3_code'] == geojson_country_code:
                output_file_writer.writerow([country_codes[i]['alpha_2_code'], country_codes[i]['alpha_3_code'], json.dumps(feature)])
                # Remove the matched country code from the list 
                del country_codes[i]
                # Stop looping through the list
                break

    # Write out the records for the country codes that we don't have geojson for.
    print 'Unmatched codes: ' + str(list(o['alpha_3_code'] for o in country_codes))
    for i in range(len(country_codes)):
        output_file_writer.writerow([country_codes[i]['alpha_2_code'], country_codes[i]['alpha_3_code'], None])

