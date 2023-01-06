
export const DialApi = {
    serviceName: 'alancall-5826',
    functionName: 'dial',
};

export function buildDialUrl(phoneNumber, xml) {
    return `https://${DialApi.serviceName}.twil.io/${DialApi.functionName}?phone=1${phoneNumber}&&xml=${xml}`;
}
