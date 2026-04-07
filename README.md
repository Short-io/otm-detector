# One Time Mail Detector

![NPM Version](https://img.shields.io/npm/v/otm-detector)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

The OTM Detector module is a lightweight module that allows you to detect one-time mail services by checking the MX (Mail Exchange) records of a given hostname. Most of similar modules have block list of one-time mail services, but this module uses a different approach to detect one-time mail services. It checks the MX records of the hostname to determine if it belongs to a one-time mail service. Usually such services purchase a lot of domains and use them as one-time mail services. This module is able to detect such services.
## Installation

Install otm-detector with npm

```bash
  npm install otm-detector
```
    
## Usage

To use the OTM Detector module in your project, require it and call the `getOneTimeMailInfo` function, passing the hostname as a parameter. The function returns an object with the following properties:

- `otmAllowed` (boolean) — `true` if the hostname belongs to a one-time mail service.
- `abuseEmail` (string | null) — abuse contact email for providers that do not allow registering burner accounts. You can report the domain to this address for violation of the provider's Terms of Service.

Import:
```javascript
import { getOneTimeMailInfo } from 'otm-detector';

const hostname = 'example.com';
const { otmAllowed, abuseEmail } = await getOneTimeMailInfo(hostname);

console.log(`Is ${hostname} a one-time mail service? ${otmAllowed}`);
if (abuseEmail) {
  console.log(`Report abuse to: ${abuseEmail}`);
}
```

Require:
```javascript
const { getOneTimeMailInfo } = require('otm-detector');

const hostname = 'example.com';
const { otmAllowed, abuseEmail } = await getOneTimeMailInfo(hostname);

console.log(`Is ${hostname} a one-time mail service? ${otmAllowed}`);
if (abuseEmail) {
  console.log(`Report abuse to: ${abuseEmail}`);
}
```

## FAQ

#### What is the purpose of this module?

Many services offer a limited free version of their product. While 99.9% of users create only one account, some malicious actors create thousands. The purpose of this module is to prevent such abuse.

#### What are the criteria for adding a service to this list?

We add a service to the list if it matches one of the following criteria:
- Provides one-off temporary emails without requiring registration.
- Allows the creation of a large number of aliases.
- Is heavily used to circumvent email validation limits.

#### What is out of scope for this module?

We do not add services to this list for the following reasons:
- Email proxy services.
- Secure email services.
- Sending SPAM.

#### How can I remove my service from the list?

We can remove your service from the blocklist and move it to the abuse contacts list if all of the following conditions are met:
- Your Terms of Service clearly state that using the service for burner accounts is forbidden.
- You provide an abuse email address to report burner accounts.
- You respond to abuse reports in a timely manner.

Please submit a pull request (PR) with an explanation.
## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request on the [GitHub repository](https://github.com/short-io/otm-detector).



## Related

We recommend using this module with existing burner email providers (for example, https://github.com/wesbos/burner-email-providers) to provide better results

## License

[MIT](https://choosealicense.com/licenses/mit/)


## Development

After editing `index.js` or `blocklist.json`, run `npm run build` to regenerate `blocklist.js` and `index.cjs`.

Do not edit `blocklist.js` or `index.cjs` directly — both are generated.

## Adding a new domain to the blocklist

The blocklist source of truth is [`blocklist.json`](./blocklist.json), which has three sections:

- `hosts` — exact MX hostnames to block, or wildcard patterns containing `*` (see below)
- `ips` — IPv4 addresses to block (used when the MX hostname itself is not on the list but resolves to a known temp-mail server)
- `abuseContacts` — MX hostname → abuse email; the domain is **not** blocked but `getOneTimeMailInfo` returns the abuse address so callers can report violations

The value of each `hosts`/`ips` entry is an optional source note (typically the temp-mail domain that led to its discovery), or `null` if there's nothing to record.

### Option 1: use the add-entry script (recommended)

For most temp-mail services, let the script resolve MX and A records for you and append them automatically:

```bash
npm run add-entry -- example-temp-mail.com
```

The script:
1. Resolves the domain's MX records
2. Resolves the A records of every MX host
3. Appends new entries to `hosts` and `ips` in `blocklist.json` (existing entries are skipped)
4. Regenerates `blocklist.js`

You still need to run `npm run build` afterwards if you want the `index.cjs` bundle refreshed, and `npm test` to make sure nothing broke.

Adding to `abuseContacts` is **not** supported by the script — edit `blocklist.json` directly.

### Option 2: edit `blocklist.json` manually

Add the entry to the appropriate section, then rebuild:

```bash
npm run build
npm test
```

### Wildcard host patterns

A `hosts` key may contain `*`, which acts as a glob matching any characters except `.` (DNS-label semantics — it does **not** span dots). This is useful for collapsing numbered MX clusters that share an obvious naming pattern. For example:

```json
{
  "hosts": {
    "recv*.erinn.biz": null
  }
}
```

matches `recv1.erinn.biz`, `recv42.erinn.biz`, and `recvfoo.erinn.biz`, but not `recv1.something.erinn.biz` or `xyzrecv1.erinn.biz`. The pattern is anchored at both ends. The generator compiles wildcard entries into a separate `OTM_HOST_PATTERNS` regex array; exact-match hosts continue to use a `Set` for O(1) lookup.

Use wildcards conservatively — only when the naming pattern is unambiguous and the risk of over-matching legitimate mail servers is low.
