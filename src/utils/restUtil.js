const http = require('axios');

const i4gBaseUrl = 'https://gl0.mygreenaward.com/pub/ac';

export function buildI4gUrl(path) {
    return `${i4gBaseUrl}${path}`
}

export function buildTwiMlUrl(poll) {
    return buildI4gUrl(`/twiml/${poll.id}`);
}

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
