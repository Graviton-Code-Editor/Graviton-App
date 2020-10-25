# 🦾 Building Graviton

Prerequisites:

- NodeJS (LTS version)
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
npm install
```

## Developing (optional)

In case you just want to test it in development mode, run:

### Desktop

```shell
npm start
```

### Browser (experimental)

```shell
npm start:experimental:browser
```

If shows an empty dark screen just wait.

## Building

You can build Graviton as a browser app or as a desktop app, you probably want the second option.

### Browser

This will generate a static website, which includes the whole Graviton UI, Arctic, Night and Remote plugins by default.

Run:

```shell
npm run build:experimental:browser
```

### Desktop App

This will make a Desktop installer.

Default formats for each platform:

- Windows: 64 bits
- Linux: Deb and AppImage
- MacOS: DMG

Run:

```shell
npm run build
```

You can override the default outputs in the package.json, or just skip to the next section.

#### Building specific Linux installers

If you want to build a specific linux Installer for your distro you can run:

```shell
npm run build:whatever_package
```

For example, if you are an Arch Linux user, run:

```shell
npm run build:pacman
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
npm run build:outpacked
```
