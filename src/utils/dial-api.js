import { httpReq, buildI4gUrl, buildTwiMlUrl } from "./restUtil";

export const DialApi = {
    serviceName: 'alancall-5826',
    functionName: 'dial',
};

export function buildDialUrl(phoneNumber, xml) {
    return `https://${DialApi.serviceName}.twil.io/${DialApi.functionName}?phone=1${phoneNumber}&&xml=${xml}`;
}


export async function dialPhoneNumber(pn, poll) {
    const twiMLurl = buildTwiMlUrl(poll);
    const url = buildDialUrl(pn, twiMLurl);
    console.log("API url:", url);

    const data = await httpReq(url)
    console.log("Dialed:", pn);
    return data;
}
