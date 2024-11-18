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

To use the OTM Detector module in your project, require it and call the `isOneTimeMail` function, passing the hostname as a parameter. The function will return `true` if the hostname belongs to a one-time mail service, and `false` otherwise.

Import:
```javascript
import { isOneTimeMail } from 'otm-detector';

const hostname = 'example.com';
const isOTM = await isOneTimeMail(hostname);

console.log(`Is ${hostname} a one-time mail service? ${isOTM}`);
```

Require:
```javascript
const { isOneTimeMail } = require('otm-detector');

const hostname = 'example.com';
const isOTM = await isOneTimeMail(hostname);

console.log(`Is ${hostname} a one-time mail service? ${isOTM}`);
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

Please submit a pull request (PR) with an explanation.
## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request on the [GitHub repository](https://github.com/short-io/otm-detector).



## Related

We recommend using this module with existing burner email providers (for example, https://github.com/wesbos/burner-email-providers) to provide better results

## License

[MIT](https://choosealicense.com/licenses/mit/)


## Development

After editing `index.js`, run `npx rollup index.js --file index.cjs --format cjs` to generate a CommonJS module.

Do not edit `index.cjs` directly.
