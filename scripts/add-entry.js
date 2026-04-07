import dns from "node:dns/promises";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { generate } from "./generate-blocklist.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const jsonPath = resolve(repoRoot, "blocklist.json");

const usage = () => {
    console.error("Usage: node scripts/add-entry.js <domain>");
    console.error("");
    console.error("Resolves the domain's MX records and the A records of each MX host,");
    console.error("then appends them to blocklist.json with <domain> as the source note.");
    console.error("Adding to abuseContacts is not supported — edit blocklist.json directly.");
};

const sortObject = (obj) => {
    const sorted = {};
    for (const key of Object.keys(obj).sort()) {
        sorted[key] = obj[key];
    }
    return sorted;
};

const main = async () => {
    const args = process.argv.slice(2);
    if (args.length !== 1) {
        usage();
        process.exit(1);
    }
    const domain = args[0].trim().toLowerCase();
    if (!domain) {
        usage();
        process.exit(1);
    }

    let mxRecords;
    try {
        mxRecords = await dns.resolveMx(domain);
    } catch (e) {
        if (e.code === "ENOTFOUND" || e.code === "ENODATA") {
            console.error(`No MX records found for ${domain} (${e.code})`);
            process.exit(1);
        }
        throw e;
    }

    if (!mxRecords.length) {
        console.error(`No MX records found for ${domain}`);
        process.exit(1);
    }

    const mxHosts = mxRecords.map((r) => r.exchange.toLowerCase());
    const ipResults = new Map();
    for (const host of mxHosts) {
        try {
            const ips = await dns.resolve4(host);
            ipResults.set(host, ips);
        } catch (e) {
            if (e.code === "ENOTFOUND" || e.code === "ENODATA") {
                console.warn(`  ! Could not resolve A records for ${host} (${e.code})`);
                ipResults.set(host, []);
                continue;
            }
            throw e;
        }
    }

    const data = JSON.parse(readFileSync(jsonPath, "utf8"));
    data.hosts ??= {};
    data.ips ??= {};
    data.abuseContacts ??= {};

    const addedHosts = [];
    const skippedHosts = [];
    for (const host of mxHosts) {
        if (Object.prototype.hasOwnProperty.call(data.hosts, host)) {
            skippedHosts.push(host);
        } else {
            data.hosts[host] = domain;
            addedHosts.push(host);
        }
    }

    const addedIps = [];
    const skippedIps = [];
    for (const ips of ipResults.values()) {
        for (const ip of ips) {
            if (Object.prototype.hasOwnProperty.call(data.ips, ip)) {
                skippedIps.push(ip);
            } else {
                data.ips[ip] = domain;
                addedIps.push(ip);
            }
        }
    }

    data.hosts = sortObject(data.hosts);
    data.ips = sortObject(data.ips);
    data.abuseContacts = sortObject(data.abuseContacts);

    writeFileSync(jsonPath, JSON.stringify(data, null, 2) + "\n");

    console.log(`Resolved ${domain}:`);
    for (const host of mxHosts) {
        const ips = ipResults.get(host) ?? [];
        console.log(`  MX ${host} -> ${ips.length ? ips.join(", ") : "(no A records)"}`);
    }
    console.log("");
    if (addedHosts.length) console.log(`Added hosts: ${addedHosts.join(", ")}`);
    if (skippedHosts.length) console.log(`Already known hosts: ${skippedHosts.join(", ")}`);
    if (addedIps.length) console.log(`Added IPs: ${addedIps.join(", ")}`);
    if (skippedIps.length) console.log(`Already known IPs: ${skippedIps.join(", ")}`);
    if (!addedHosts.length && !addedIps.length) {
        console.log("Nothing new to add.");
        return;
    }

    const { hostCount, ipCount } = generate();
    console.log("");
    console.log(`Regenerated blocklist.js (${hostCount} hosts, ${ipCount} IPs)`);
};

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
