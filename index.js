import dns from "node:dns/promises";
const OTM_HOSTS = new Set([
    "in.mail.tm",
    "mail.onetimemail.org",
    "mx.mail-data.net",
    "mx1.emaildbox.pro",
    "mx2.emaildbox.pro",
    "mx3.emaildbox.pro",
    "mx4.emaildbox.pro",
    "mx5.emaildbox.pro",

])
const OTM_IPS = new Set([
    "167.172.1.68",
    "54.39.193.199",
    "164.90.254.47",
    "167.114.206.221",
    "15.204.213.223",
])
export const isOneTimeMail = async (domain, options = {}) => {
    const otmDns = options.dns || dns;
    try {
        const records = await otmDns.resolveMx(domain)
        if (records.length === 0) { // this email is invalid, but we are not a validator
            return false
        }
        if (records.some((record) => OTM_HOSTS.has(record.exchange))) {
            return true
        }
        // check first record for new
        const mxHost = records[0].exchange
        const mxAddresses = await otmDns.resolve4(mxHost)
        if (mxAddresses.some((address) => OTM_IPS.has(address))) {
            return true
        }
        return false;
    } catch (e) {
        if (e.code === "ENOTFOUND") {
            return false
        }
        throw e
    }
};