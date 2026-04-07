// DO NOT EDIT DIRECTLY
'use strict';Object.defineProperty(exports,Symbol.toStringTag,{value:'Module'});const dns=require('node:dns/promises');// DO NOT EDIT DIRECTLY — generated from blocklist.json by scripts/generate-blocklist.js

const OTM_HOSTS = new Set([
    "_dc-mx.4ca75f70edcf.okyre.com", // okyre.com
    "_dc-mx.5e5e17bc6c36.tempmail.cc", // tempmail.cc
    "email-fake.com",
    "emailfake.com",
    "generator.email",
    "hi.mail.cx",
    "in.mail.tm",
    "mail.anonaddy.me",
    "mail.cmail.asia", // cmail.asia
    "mail.incognitomail.co",
    "mail.mailinator.com",
    "mail.onetimemail.org",
    "mail.pmail.asia", // pmail.asia
    "mail.t-mail.asia", // t-mail.asia
    "mail.tempmailt.com", // tempmailt.com
    "mail.umail.asia", // umail.asia
    "mail.wabblywabble.com",
    "mail.wallywatts.com",
    "mail2.anonaddy.me",
    "mail2.mailinator.com",
    "mailinator.com",
    "mx.mail-data.net",
    "mx1-hosting.jellyfish.systems",
    "mx1.emaildbox.pro",
    "mx1.privateemail.com",
    "mx1.simplelogin.co",
    "mx2-hosting.jellyfish.systems",
    "mx2.den.yt",
    "mx2.emaildbox.pro",
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

const OTM_HOST_PATTERNS = [
    /^recv[^.]*\.erinn\.biz$/, // recv*.erinn.biz
];

const abuseContacts = new Map([
    ["mx1.forwardemail.net", "abuse@forwardemail.net"],
    ["mx2.forwardemail.net", "abuse@forwardemail.net"],
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
    "167.172.1.68", // tempmail.cc
    "167.71.194.110",
    "173.225.105.34",
    "194.31.59.229",
    "209.38.189.190",
    "23.239.2.211",
    "24.199.67.157",
    "46.101.111.206",
    "5.252.35.241", // znemail.com
    "51.222.102.161",
    "51.79.254.220", // umail.asia
    "51.91.252.134", // mailp.org
    "54.39.17.59",
    "54.39.193.199",
    "66.70.233.243", // openmail.pro
    "92.255.56.148", // mail.letterguard.net
    "92.255.84.131",
    "96.126.99.62",
]);const isOtmHost = (host) =>
    OTM_HOSTS.has(host) || OTM_HOST_PATTERNS.some((pattern) => pattern.test(host));

const getOneTimeMailInfo = async (domain, options = {}) => {
    const otmDns = options.dns || dns;
    try {
        const records = await otmDns.resolveMx(domain);
        if (records.length === 0) {
            return { otmAllowed: false, abuseEmail: null }
        }
        if (records.some((record) => isOtmHost(record.exchange))) {
            return { otmAllowed: true, abuseEmail: null }
        }
        const mxHost = records[0].exchange;
        const mxAddresses = await otmDns.resolve4(mxHost);
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
};exports.getOneTimeMailInfo=getOneTimeMailInfo;//# sourceMappingURL=index.cjs.map
