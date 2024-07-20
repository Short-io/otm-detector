## Module: OTM Detector

The OTM Detector module is a lightweight module that allows you to detect one-time mail services by checking the MX (Mail Exchange) records of a given hostname.
Most of similar modules have block list of one-time mail services, but this module uses a different approach to detect one-time mail services. It checks the MX records of the hostname to determine if it belongs to a one-time mail service. Usually such services purchase a lot of domains and use them as one-time mail services. This module is able to detect such services.

### Installation

To install the OTM Detector module, use the following command:

```bash
npm install otm-detector
```

### Usage

To use the OTM Detector module in your project, require it and call the `isOneTimeMail` function, passing the hostname as a parameter. The function will return `true` if the hostname belongs to a one-time mail service, and `false` otherwise.

```javascript
import { isOneTimeMail } from 'otm-detector';

const hostname = 'example.com';
const isOTM = await isOneTimeMail(hostname);

console.log(`Is ${hostname} a one-time mail service? ${isOTM}`);
```

### Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request on the [GitHub repository](https://github.com/short-io/otm-detector).

### License

This module is licensed under the [MIT License](https://opensource.org/licenses/MIT).
