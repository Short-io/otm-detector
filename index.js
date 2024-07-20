import dns from "node:dns/promises";
const OTM_HOSTS = new Set([
    "in.mail.tm",
    "mail.onetimemail.org",
])
export const isOneTimeMail = async (domain, options = {}) => {
    const otmDns = options.dns || dns;
    const records = await otmDns.resolveMx(domain)
    return records.some((record) => OTM_HOSTS.has(record.exchange))
};