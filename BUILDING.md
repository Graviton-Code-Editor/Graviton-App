# 🦾 Building Graviton

Prerequisites:

- NodeJS
- Git

Instructions to build Graviton from source code:

## 1 - Clone the source

Clone the git repository:

```shell
git clone https://github.com/Graviton-Code-Editor/Graviton-App.git --depth 1
```

There are 2 different branches:

- Master: daily source (default).
- Stable: this doesn't mean it's ready to be released as stable build , but it doesn't have that many bugs, it's more stable overall.
- 1.3.0: it refers to the old Graviton source code.

## 2 - Install dependencies

Go inside the folder:

```shell
cd Graviton-App
```

Install the dependencies:

```shell
npm install
```

## 3 - Developing (optional)

In case you just want to test it in dev mode, run:

```shell
npm start
```

If shows an empty dark screen just wait.

## 4 - Building the installer

For Windows, Linux(deb,AppImage,rpm) and MacOS:

```shell
npm run build
```

You can override the default platforms from the package.json.

#### Building another linux installers

If you want to build a specific linux package for your distro you can run:

```shell
npm run build:your_extension
```

For example, if you are an Arch Linux user, run:

```shell
npm run build:pacman
```

Here is the list of the supported extensions:

- snap
- pacman
- deb
- apk
- freebsd
- p5p
- rpm
- AppImage

Please keep in mind that not all the distros can build some packages. Anyway, Ubuntu can build a Debian package and an AppImage installer out of the box.

#### Building an out-packed

In case you want to test Graviton in a production build but don't want to create an installer, you can build an outpacked version, this builds faster than an installer.

Run:

```shell
npm run build:outpacked
```
