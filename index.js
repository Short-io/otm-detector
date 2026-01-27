import dns from "node:dns/promises";
import { OTM_HOSTS, OTM_IPS, abuseContacts } from './blocklist.js';

export const getOneTimeMailInfo = async (domain, options = {}) => {
    const otmDns = options.dns || dns;
    try {
        const records = await otmDns.resolveMx(domain)
        if (records.length === 0) {
            return { otmAllowed: false, abuseEmail: null }
        }
        if (records.some((record) => OTM_HOSTS.has(record.exchange))) {
            return { otmAllowed: true, abuseEmail: null }
        }
        const mxHost = records[0].exchange
        const mxAddresses = await otmDns.resolve4(mxHost)
        if (mxAddresses.some((address) => OTM_IPS.has(address))) {
            return { otmAllowed: true, abuseEmail: null }
        }
        const abuseEmail = abuseContacts.get(mxHost) || null;
        return { otmAllowed: false, abuseEmail };
    } catch (e) {
        if (e.code === "ENOTFOUND") {
            return { otmAllowed: false, abuseEmail: null }
        }
        throw e
    }
};
