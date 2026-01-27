import dns from "node:dns/promises";

interface OtmResult {
    otmAllowed: boolean;
    abuseEmail: string | null;
}

export declare const getOneTimeMailInfo: (domain: string, options?: {
    dns?: typeof dns;
}) => Promise<OtmResult>;
