Electron Notarize
-----------

> Notarize your Electron apps seamlessly

## Installation

```bash
# npm
npm i electron-notarize --save-dev

# yarn
yarn add electron-notarize --dev
```

## What is app "notarization"?

From apple's docs, the definition of a "notarized app"

> A notarized app is a macOS app that was uploaded to Apple for processing before it was distributed. When you export a notarized app from Xcode, it code signs the app with a Developer ID certificate and staples a ticket from Apple to the app. The ticket confirms that you previously uploaded the app to Apple.

> On macOS 10.14 and later, the user can launch notarized apps when Gatekeeper is enabled. When the user first launches a notarized app, Gatekeeper looks for the app’s ticket online. If the user is offline, Gatekeeper looks for the ticket that was stapled to the app.

Basically Apple are going to make this a hard requirement soon, may as well get
on the train early.

## API

### Method: `notarize(opts): Promise<void>`

* `options` Object
  * `appBundleId` String - The app bundle identifier your Electron app is using.  E.g. `com.github.electron`
  * `appPath` String - The absolute path to your `.app` file
  * `appleId` String - The username of your apple developer account
  * `appleIdPassword` String - The password for your apple developer account

#### Safety when using `appleIdPassword`

1. Never hard code your password into your packaging scripts, use an environment
variable at a minimum.
2. It is possible to provide a keychain reference instead of your actual password.  E.g.

```js
const password = `@keychain:"Application Loader: ${appleId}"`;
```

#### Example Usage

```js
import { notarize } from 'electron-notarize';

async function packageTask () {
  // Package your app here, and code side with hardened runtime
  await notarize({
    appBundleId,
    appPath,
    appleId,
    appleIdPassword,
  });
}
```
