import csv
import pymonetdb

# To avoid installing pymonetdb into the global environment:
'''
sudo apt-get install python-virtualenv
mkdir my_virtualenv
virtualenv my_virtualenv
cd my_virtualenv/bin
source activate
pip install pymonetdb
python ../../add_annotation_gene_names.py
deactivate
'''

# Panoptes parsed the GFF using server/Convertors/ParseAnnotation.py

## Settings
# Settings for gene data file.
input_file_path = '/home/lee/Panoptes/sourcedir/datasets/observatory/datatables/pf_genes/data'
input_column_name = 'gene_id'
input_column_name_to_replace = 'Name' # Setting to None will add a new column.
output_column_name = 'annotation_fname' # Not used when input_column_name_to_replace is not None.
output_empty_value = ''
output_empty_value_replacement = 'unnamed'
output_file_name_suffix = '.out.tsv'
output_rows_max = None
# Settings for annotations table.
monetdb_host = 'localhost'
monetdb_user = 'monetdb'
monetdb_pass = 'monetdb'
monetdb_dbname = 'observatory'
monetdb_tbname = 'annotation'
monetdb_id_colname = 'fid'
monetdb_name_colname = 'fname'
monetdb_where_clause = '(ftype = \'gene\' OR ftype = \'pseudogene\')' # Use any tautology for no clause, e.g. 1 = 1.
monetdb_spotcheck_id = 'PF3D7_0100100'

# Derived settings
output_file_path = input_file_path + output_file_name_suffix

print('Connecting to database ' + monetdb_dbname + ' on host ' + monetdb_host + ' as user ' + monetdb_user)
connection = pymonetdb.connect(hostname="localhost", username=monetdb_user, password=monetdb_pass, database=monetdb_dbname)
cursor = connection.cursor()

# Various eye-ball checks...
print('Columns from table ' + monetdb_tbname)
cursor.execute('SELECT name FROM sys.columns WHERE table_id = (SELECT id AS table_id FROM sys.tables WHERE name = \'' + monetdb_tbname + '\' AND schema_id = (SELECT id AS schema_id FROM sys.schemas WHERE name = \'' + monetdb_dbname + '\'))')
print(cursor.fetchall())
print('Selecting first 10 rows of table ' + monetdb_tbname)
cursor.execute('SELECT * FROM ' + monetdb_tbname + ' LIMIT 10')
print(cursor.fetchall())
print('Counting all rows in ' + monetdb_tbname + ' where ' + monetdb_where_clause)
cursor.execute('SELECT COUNT(*) FROM ' + monetdb_tbname + ' WHERE ' + monetdb_where_clause)
print(cursor.fetchall())
print('Counting rows in ' + monetdb_tbname + ' with distinct ' + monetdb_id_colname + ' where ' + monetdb_where_clause)
cursor.execute('SELECT COUNT(*) FROM (SELECT DISTINCT ' + monetdb_id_colname + ' FROM ' + monetdb_tbname + ' WHERE ' + monetdb_where_clause + ') AS tb')
print(cursor.fetchall())
print('Selecting first 10 rows of columns ' + monetdb_id_colname + ' and ' + monetdb_name_colname + ' where ' + monetdb_where_clause)
cursor.execute('SELECT ' + monetdb_id_colname + ', ' + monetdb_name_colname + ' FROM ' + monetdb_tbname + ' WHERE ' + monetdb_where_clause + ' LIMIT 10')
print(cursor.fetchall())

# Get all the ids and their corresponding names as a dictionary (associative array).
print('Storing all rows of columns ' + monetdb_id_colname + ' and ' + monetdb_name_colname + ' where ' + monetdb_where_clause)
cursor.execute('SELECT ' + monetdb_id_colname + ', ' + monetdb_name_colname + ' FROM ' + monetdb_tbname + ' WHERE ' + monetdb_where_clause)
monetdb_id_names = dict(cursor.fetchall())
print('Length of monetdb_id_names: ' + str(len(monetdb_id_names)))
print('Checking id ' + monetdb_spotcheck_id + ' is in monetdb_id_names: ' + monetdb_id_names[monetdb_spotcheck_id])


print('Reading from ' + input_file_path + ' and writing to ' + output_file_path)
with open(input_file_path, 'r') as input_file, open(output_file_path, 'w') as output_file:
    
    # Prepare the input_file_reader.
    input_file_reader = csv.reader(input_file, delimiter="\t")
    
    # Prepare the output_file_writer.
    output_file_writer = csv.writer(output_file, delimiter="\t", quoting=csv.QUOTE_NONE, escapechar="\\", quotechar="'")
    
    # Look for the input_column.
    input_file_header = next(input_file_reader, None)
    
    if input_file_header is None:
        print('Error: empty file at input_file_path ' + input_file_path)
        quit()
    
    input_column_index = None
    for column_index, column_name in enumerate(input_file_header):
        if column_name == input_column_name:
            input_column_index = column_index;
            print('input_column_name ' + input_column_name + ' found at column index ' + str(input_column_index))
            break
    if input_column_index is None:
        print('Error: input_column_name ' + input_column_name + ' is not in input_file_path ' + input_file_path)
        quit()
        
    input_column_index_to_replace = None
    if input_column_name_to_replace is not None:
        for column_index, column_name in enumerate(input_file_header):
            if column_name == input_column_name_to_replace:
                input_column_index_to_replace = column_index;
                print('input_column_name_to_replace ' + input_column_name_to_replace + ' found at column index ' + str(input_column_index_to_replace))
                break
        if input_column_index_to_replace is None:
            print('Error: input_column_name_to_replace ' + input_column_name_to_replace + ' is not in input_file_path ' + input_file_path)
            quit()

    # Write out the header row.
    if input_column_name_to_replace is None:
        output_file_writer.writerow(input_file_header + [output_column_name])
    else:
        output_file_writer.writerow(input_file_header)
    
    # Read in each line from the input_file.
    for input_index, input_line in enumerate(input_file_reader):

        input_value = input_line[input_column_index]
        
        if input_value not in monetdb_id_names:
            print('Error: input_value ' + input_value + ' is not in monetdb_id_names')
            quit()
        
        output_value = monetdb_id_names[input_value]
        if output_value == output_empty_value:
            output_value = output_empty_value_replacement

        # Write out the output row.
        if input_column_name_to_replace is None:
            output_file_writer.writerow(input_line + [output_value])
        else:
            output_line = input_line
            output_line[input_column_index_to_replace] = output_value
            output_file_writer.writerow(output_line)
            
        if output_rows_max is not None and input_index >= (output_rows_max - 1):
            print('Terminating at input_index ' + str(input_index) + ' input_value ' + input_value)
            quit()
