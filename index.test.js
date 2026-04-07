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
  {
    // Wildcard match: recv*.erinn.biz with a number that was never explicitly listed.
    domain: "wildcard-numeric.com",
    mx: ["recv5.erinn.biz"],
    result: { otmAllowed: true, abuseEmail: null },
  },
  {
    // Wildcard match: bare label (zero chars under `*`).
    domain: "wildcard-bare.com",
    mx: ["recv.erinn.biz"],
    result: { otmAllowed: true, abuseEmail: null },
  },
  {
    // Wildcard match: non-numeric label.
    domain: "wildcard-alpha.com",
    mx: ["recvfoo.erinn.biz"],
    result: { otmAllowed: true, abuseEmail: null },
  },
  {
    // Wildcard must not span dots — extra label between `recv` and the suffix.
    domain: "wildcard-cross-dot.com",
    mx: ["recv1.something.erinn.biz"],
    a: ["1.2.3.4"],
    result: { otmAllowed: false, abuseEmail: null },
  },
  {
    // Wildcard is anchored at the start — prefix before `recv` must not match.
    domain: "wildcard-prefix.com",
    mx: ["xyzrecv1.erinn.biz"],
    a: ["1.2.3.4"],
    result: { otmAllowed: false, abuseEmail: null },
  },
  {
    // Wildcard is anchored at the end — different suffix must not match.
    domain: "wildcard-suffix.com",
    mx: ["recv1.erinn.biz.evil.com"],
    a: ["1.2.3.4"],
    result: { otmAllowed: false, abuseEmail: null },
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
