import test from "node:test";
import assert from "node:assert";
import { isOneTimeMail } from "./index.js";

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
];

for (const domain of domains) {
  test(`Check if ${domain.domain} has ${domain.mx.join(", ")} as MX`, async (t) => {
    assert.equal(
      await isOneTimeMail(domain.domain, { dns: {
        resolveMx: async () => domain.mx.map((exchange) => ({ exchange })),
      }}),
      domain.result
    );
  });
}
