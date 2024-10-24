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
    "prd-smtp.10minutemail.com",
    "emailfake.com",
    "mx1.forwardemail.net",
    "mx2.forwardemail.net",
    "mx2.den.yt",
    "route1.mx.cloudflare.net",
    "route2.mx.cloudflare.net",
    "route3.mx.cloudflare.net",
    "mx1-hosting.jellyfish.systems",
    "mx2-hosting.jellyfish.systems",
    "mx3-hosting.jellyfish.systems",
    "mx1.simplelogin.co",
    "mx2.simplelogin.co",
    "generator.email",
])
const OTM_IPS = new Set([
    "136.243.103.68",
    "137.184.243.159",
    "146.190.197.86",
    "15.204.213.223",
    "15.235.72.244",
    "15.235.72.245",
    "157.230.67.25",
    "164.90.254.47",
    "167.114.206.221",
    "167.172.1.68",
    "173.225.105.34",
    "194.31.59.229",
    "24.199.67.157",
    "51.222.102.161",
    "54.39.17.59",
    "54.39.193.199",
    "66.70.233.243", // openmail.pro
    "92.255.84.131",
    "96.126.99.62",
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