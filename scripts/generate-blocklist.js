import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const jsonPath = resolve(repoRoot, "blocklist.json");
const jsPath = resolve(repoRoot, "blocklist.js");

const formatStringEntry = (value, note) => {
    const base = `    ${JSON.stringify(value)},`;
    return note ? `${base} // ${note}` : base;
};

const formatTupleEntry = (key, value) =>
    `    [${JSON.stringify(key)}, ${JSON.stringify(value)}],`;

export const generate = () => {
    const data = JSON.parse(readFileSync(jsonPath, "utf8"));

    const hosts = Object.keys(data.hosts ?? {}).sort();
    const ips = Object.keys(data.ips ?? {}).sort();
    const abuseKeys = Object.keys(data.abuseContacts ?? {}).sort();

    const lines = [];
    lines.push("// DO NOT EDIT DIRECTLY — generated from blocklist.json by scripts/generate-blocklist.js");
    lines.push("");
    lines.push("export const OTM_HOSTS = new Set([");
    for (const host of hosts) {
        lines.push(formatStringEntry(host, data.hosts[host]));
    }
    lines.push("]);");
    lines.push("");
    lines.push("export const abuseContacts = new Map([");
    for (const key of abuseKeys) {
        lines.push(formatTupleEntry(key, data.abuseContacts[key]));
    }
    lines.push("]);");
    lines.push("");
    lines.push("export const OTM_IPS = new Set([");
    for (const ip of ips) {
        lines.push(formatStringEntry(ip, data.ips[ip]));
    }
    lines.push("]);");
    lines.push("");

    writeFileSync(jsPath, lines.join("\n"));
    return { hostCount: hosts.length, ipCount: ips.length, abuseCount: abuseKeys.length };
};

if (import.meta.url === `file://${process.argv[1]}`) {
    const { hostCount, ipCount, abuseCount } = generate();
    console.log(
        `Wrote blocklist.js (${hostCount} hosts, ${ipCount} IPs, ${abuseCount} abuse contacts)`
    );
}
