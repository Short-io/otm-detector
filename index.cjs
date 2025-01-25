// DO NOT EDIT DIRECTLY
'use strict';Object.defineProperty(exports,Symbol.toStringTag,{value:'Module'});const dns=require('node:dns/promises');const OTM_HOSTS = new Set([
    "recv6.erinn.biz",
    "recv7.erinn.biz",
    "recv8.erinn.biz",
    "recv1.erinn.biz",
    "recv100.erinn.biz",
    "recv101.erinn.biz",
    "recv2.erinn.biz",
    "recv3.erinn.biz",
    "recv4.erinn.biz",
    "email-fake.com",
    "emailfake.com",
    "emailfake.com",
    "generator.email",
    "in.mail.tm",
    "mail.wabblywabble.com",
    "mail.wallywatts.com",
    "mail.mailinator.com",
    "mail.onetimemail.org",
    "mail2.mailinator.com",
    "mailinator.com",
    "mx.mail-data.net",
    "mx1-hosting.jellyfish.systems",
    "mx1.emaildbox.pro",
    "mx1.forwardemail.net",
    "mx1.privateemail.com",
    "mx1.simplelogin.co",
    "mx2-hosting.jellyfish.systems",
    "mx2.den.yt",
    "mx2.emaildbox.pro",
    "mx2.forwardemail.net",
    "mx2.privateemail.com",
    "mx2.simplelogin.co",
    "mx3-hosting.jellyfish.systems",
    "mx3.emaildbox.pro",
    "mx4.emaildbox.pro",
    "mx5.emaildbox.pro",
    "prd-smtp.10minutemail.com",
    "route1.mx.cloudflare.net",
    "route2.mx.cloudflare.net",
    "route3.mx.cloudflare.net",
    "tempm.com",
]);

const OTM_IPS = new Set([
    "116.202.9.167",
    "136.243.103.68",
    "137.184.243.159",
    "146.190.197.86",
    "15.204.213.223",
    "15.235.72.244",
    "15.235.72.245",
    "157.230.67.25",
    "161.35.252.140",
    "164.90.254.47",
    "167.114.206.221",
    "167.172.1.68",
    "173.225.105.34",
    "194.31.59.229",
    "209.38.189.190",
    "23.239.2.211",
    "24.199.67.157",
    "46.101.111.206",
    "51.222.102.161",
    "54.39.17.59",
    "54.39.193.199",
    "66.70.233.243", // openmail.pro
    "92.255.84.131",
    "96.126.99.62",
]);const isOneTimeMail = async (domain, options = {}) => {
    const otmDns = options.dns || dns;
    try {
        const records = await otmDns.resolveMx(domain);
        if (records.length === 0) { // this email is invalid, but we are not a validator
            return false
        }
        if (records.some((record) => OTM_HOSTS.has(record.exchange))) {
            return true
        }
        // check first record for new
        const mxHost = records[0].exchange;
        const mxAddresses = await otmDns.resolve4(mxHost);
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
};exports.isOneTimeMail=isOneTimeMail;//# sourceMappingURL=index.cjs.map
