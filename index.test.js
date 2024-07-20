import test from "node:test";
import assert from "node:assert";
import { isOneTimeMail } from "./index.js";

const ENOTFOUND = new Error("ENOTFOUND");
ENOTFOUND.code = "ENOTFOUND";

const domains = [
  {
    domain: "google.com",
    mx: ["smtp.google.com"],
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
];

for (const domain of domains) {
  test(`Check if ${domain.domain} has ${domain.mx} as MX`, async (t) => {
    assert.equal(
      await isOneTimeMail(domain.domain, {
        dns: {
          resolveMx: async () => {
            if (domain.mx instanceof Error) {
              throw domain.mx;
            }
            return domain.mx.map((exchange) => ({ exchange }));
          },
        },
      }),
      domain.result
    );
  });
}
