# AppData Path

## Installation

```shell
npm install -S appdata-path
```

## Usage

```javascript
import getAppDataPath from "appdata-path";
// Or
// const getAppDataPath = require("appdata-path");

console.log(getAppDataPath());
/*
 * Linux:
 * "/home/demurgos/.config"
 * 
 * Mac:
 * "/Users/demurgos/Library/Application Support"
 * 
 * Windows:
 * "C:\Users\demurgos\AppData\Roaming"
 * 
 * System with custom `APPDATA` environment variable:
 * process.env["APPDATA"]
 * For example:
 * process.env["APPDATA"] = "/home/demurgos/apps"
 * => "/home/demurgos/apps"
 */

console.log(getAppDataPath("my-app"));
/*
 * Linux:
 * "/home/demurgos/.config/my-app"
 * 
 * Mac:
 * "/Users/demurgos/Library/Application Support/my-app"
 * 
 * Windows:
 * "C:\Users\demurgos\AppData\Roaming\my-app"
 * 
 * System with custom `APPDATA` environment variable:
 * path.join(process.env["APPDATA"], "my-app")
 * or (if `process.env["APPDATA"] === os.homedir()`)
 * path.join(process.env["APPDATA"], ".my-app")
 * For example:
 * process.env["APPDATA"] = "/home/demurgos/apps"
 * => "/home/demurgos/apps/my-app"
 * process.env["APPDATA"] = "/home/demurgos"
 * => "/home/demurgos/.my-app"
 */

```

## API

### `getAppDataPath(app?: string): string`

Returns the absolute system-dependant path for the place where applications
should store their data for the current user.
If you pass the name of your app directory or file as an argument,
it will return the absolute path for the place where you should store the
data of your application. It will prefix you file / directory name by a dot
if the AppData directory happens to also be the user's home, otherwise it
will just use it as is. See the examples above.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

## License

See [LICENSE.md](./LICENSE.md).
