const request = (url, method, params) => {
    const options = { method };
    let targetUrl = url;

    if (method === 'GET') {
        targetUrl += `?${new URLSearchParams(params)}`;
    } else {
        options.body = params;
    }

    return fetch(targetUrl, options);
};

const blind = async (url, method, params) => {
    const timeout = 1;
    const start = new Date();
    await request(url, method, params);
    const elapsed = new Date() - start;
    return elapsed > timeout * 1000;
};

const conditional = async (url, method, params, condition) => {
    const response = await request(url, method, params);
    const html = await response.text();
    return html.includes(condition);
};

class Requester {
    constructor(url, method, condition) {
        this.url = url;
        this.method = method;
        this.condition = condition;
        this._request = condition ? conditional : blind;
    }

    request(url, method, params, condition) {
        return this._request(url, method, params, condition);
    }
}

module.exports = Requester;
