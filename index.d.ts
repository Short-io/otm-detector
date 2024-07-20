import dns from "node:dns/promises";

declare const OTM_HOSTS: Set<string>;

export declare const isOneTimeMail: (domain: string, options?: {
    dns?: typeof dns;
}) => Promise<boolean>;