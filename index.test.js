import test from "node:test";
import assert from "node:assert";
import { isOneTimeMail } from "./index.js";

const ENOTFOUND = new Error("ENOTFOUND");
ENOTFOUND.code = "ENOTFOUND";

const domains = [
  {
    domain: "google.com",
    mx: ["smtp.google.com"],
    a: ["64.233.180.26", "142.251.163.27"],
    result: false,
  },
  {
    domain: "belgianairways.com",
    mx: ["in.mail.tm"],
    result: true,
  },
  {
    domain: "uentiheunsthieunst.com",
    mx: ENOTFOUND,
    result: false,
  },
  {
    domain: "bad-ip.com",
    mx: ["mail.bad-ip.com"],
    result: true,
    a: ["167.172.1.68"],
  }
];

for (const domain of domains) {
  test(`Check if ${domain.domain} has ${domain.mx}`, async (t) => {
    assert.equal(
      await isOneTimeMail(domain.domain, {
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
