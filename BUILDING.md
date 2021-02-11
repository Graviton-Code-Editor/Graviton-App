# 🦾 Building Graviton

Prerequisites:

- NodeJS (LTS version)
- yarn
- Git
- **❗ IMPORTANT ❗** -> https://www.npmjs.com/package/node-gyp#installation

## Getting the source

Clone the git repository:

```shell
git clone https://github.com/Graviton-Code-Editor/Graviton-App.git --depth 1
```

**Important**: There are 3 different branches:

- `master`: Daily changes (default)
- `stable`: Stable branch, but, does't mean it's released
- `1.3.0`: Old Graviton Source Code

## Setuping

Go inside the folder:

```shell
cd Graviton-App
```

Install the dependencies:

```shell
yarn
```

## Developing (optional)

In case you just want to test it in development mode, run:

### Desktop

This will open the app's window:

```shell
yarn start
```

If shows an empty dark screen wait some seconds and if Graviton doesn't load try reloading the window (Ctrl+R).

### Browser (experimental)

This will launch a web server in port 7500 (http://localhost:7500):

```shell
yarn start:experimental:browser
```

### Self-hosted server (experimental)

This will launch a web server in port 7500 (http://localhost:7500):

```shell
yarn start:experimental:server
```

## Building

You can build Graviton as a browser app or as a desktop app, you probably want the second option.

### Browser

This will generate a static website, which includes the whole Graviton UI, Arctic, Night and Remote plugins by default.

Run:

```shell
yarn build:experimental:browser
```

### Desktop App

This will make a Desktop installer.

Default formats for each platform:

- Windows: 64 bits
- Linux: Deb and AppImage
- MacOS: DMG

Run:

```shell
yarn build
```

You can override the default outputs in the package.json, or just skip to the next section.

#### Building specific Linux installers

If you want to build a specific linux Installer for your distro you can run:

```shell
yarn build:electron --info platform=X
```

For example, if you are an Arch Linux user, run:

```shell
yarn build:electron --info platform=arch
```

Here is the list of the supported packages:

- snap
- pacman
- deb
- apk
- freebsd
- p5p
- rpm
- AppImage

Please keep in mind that any distribution can build for every platform. For example, you can build for AppImage and Deb in Debian-based distros, like Ubuntu.

#### Building out-packed

In case you want to test Graviton in a production build but don't want to create an installer, you can build an outpacked version, this builds faster than an installer.

Run:

```shell
yarn build:electron --info outpacked=true
```

### Server binary

This will make a Graviton Server binary.

Compiling:

```shell
yarn build:server
```

Packaging:

```shell
yarn package:server
```

## API Documentation

To generate a static website with documentation about the plugins API, run:

```shell
yarn build:docs
```
