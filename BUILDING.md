# 🦾 Building Graviton

Prerequisites:
- NodeJS 
- Git

Instructions to build Graviton from the source:

## 1 - Downloading the source

Clone the git repository:
> $ git clone https://github.com/Graviton-Code-Editor/Graviton-App.git

There are 2 different branches:
* Master: daily source (default).
* Stable: this doesn't mean it's ready to be released as stable build , but it doesn't have that many bugs, it's more stable overall.
* 1.3.0: it refers to the old Graviton source code.

## 2 - Installing the dependencies

Go inside the folder:
> $ cd Graviton-App

Install the dependencies:
> $ npm install

## 3 - Building an installer 

### Testing (optional)

In case you just wanna test it, just run:
> $ npm start

### Building the installer:

For Windows, Linux(deb,AppImage,rpm) and MacOS:
> $ npm run build 

If graviton starts but its screen is black press Ctrl+r 
This is not going to happend when building.

#### Building another linux installers

If you want to build a specific linux package for your distro you can run: 
> $ npm run build:extension

For example if you are an Arch Linux user run
 > $ npm run build:pacman

 Here is the list of the supported extensions:
 * snap
 * pacman
 * deb
 * apk
 * freebsd 
 * p5p 
 * rpm
 * AppImage

Please keep in mind that not all the distros can build some packages.