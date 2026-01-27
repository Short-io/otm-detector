import test from "node:test";
import assert from "node:assert";
import { getOneTimeMailInfo } from "./index.js";

const ENOTFOUND = new Error("ENOTFOUND");
ENOTFOUND.code = "ENOTFOUND";

const domains = [
  {
    domain: "google.com",
    mx: ["smtp.google.com"],
    a: ["64.233.180.26", "142.251.163.27"],
    result: { otmAllowed: false, abuseEmail: null },
  },
  {
    domain: "belgianairways.com",
    mx: ["in.mail.tm"],
    result: { otmAllowed: true, abuseEmail: null },
  },
  {
    domain: "uentiheunsthieunst.com",
    mx: ENOTFOUND,
    result: { otmAllowed: false, abuseEmail: null },
  },
  {
    domain: "bad-ip.com",
    mx: ["mail.bad-ip.com"],
    result: { otmAllowed: true, abuseEmail: null },
    a: ["167.172.1.68"],
  },
  {
    domain: "forwardemail-user.com",
    mx: ["mx1.forwardemail.net"],
    a: ["1.2.3.4"],
    result: { otmAllowed: false, abuseEmail: "abuse@forwardemail.net" },
  },
];

for (const domain of domains) {
  test(`Check if ${domain.domain} has ${domain.mx}`, async (t) => {
    assert.deepStrictEqual(
      await getOneTimeMailInfo(domain.domain, {
        dns: {
          resolveMx: async () => {
            if (domain.mx instanceof Error) {
              throw domain.mx;
            }
            return domain.mx.map((exchange) => ({ exchange }));
          },
          resolve4: async (host) => {
            if (domain.a instanceof Error) {
              throw domain.a;
            }
            return domain.a;
          }
        },
      }),
      domain.result
    );
  });
}
