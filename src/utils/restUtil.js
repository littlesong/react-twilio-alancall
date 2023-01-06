const http = require('axios');
const endpointBaseUrl = 'https://sr3hx06os2.execute-api.us-east-1.amazonaws.com/Prod';
//const endpointBaseUrl = 'https://geno.eazylogic.com/v1';
const _app = 'geno-alancall-phone';

const i4gBaseUrl = 'https://gl0.mygreenaward.com/pub/ac';
//const i4gBaseUrl = 'http://localhost:57283/pub/ac';

export function buildI4gUrl(path) {
    return `${i4gBaseUrl}${path}`
}

export function buildTwiMlUrl(poll) {
    return buildI4gUrl(`/twiml/${poll.id}`);
}

export const genoReq = async (path, method = "get", body = undefined, app = _app, baseUrl = endpointBaseUrl, headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-tag': new Date().toISOString(),
    Authorization: '<anon>',
}) => {
    const url = new URL(baseUrl + path);

    const queryParams = { ...url.searchParams };
    if (app) queryParams.app = app;

    const config = {
        timeout: 5000,
        method,
        url: baseUrl + path,
        headers,
        params: queryParams,
    };

    if (body) {
        config.data = body;
    }

    console.debug('---------- Request -------------');
    console.debug(JSON.stringify(config, null, 3));
    const result = await http(config);
    console.debug(`========== Response ${result.status}===========`);
    console.debug(result.headers);
    console.debug(result.data);
    return result;
};

export const httpReq = async (url, method = "get", body, headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
}) => {
    const config = {
        timeout: 5000,
        method,
        url,
        headers,
    };

    if (body) {
        config.data = body;
    }

    //    console.debug('---------- Request -------------');
    ///  console.debug(JSON.stringify(config, null, 3));
    const result = await http(config);
    console.debug(`========== Response ${result.status}===========`);
    console.debug(result.headers);
    console.debug(result.data);

    if (result.status >= 400) {
        console.error("httpReq error", result.status, result.data)
        throw Error(result.data)
    } else {
        return result.data;
    }
};
