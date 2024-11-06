'use strict';

var dns = require('node:dns/promises');
var { OTM_HOSTS, OTM_IPS } = require('./blocklist.js');

const isOneTimeMail = async (domain, options = {}) => {
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
};

exports.isOneTimeMail = isOneTimeMail;
