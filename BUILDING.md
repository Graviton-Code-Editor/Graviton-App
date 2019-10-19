# 🦾 Building Graviton

Prerequisites:
- NodeJS installed
- Git installed

Instructions to build Graviton from the source:

## 1 - Downloading the source

Clone the git repository:
> $ git clone https://github.com/Graviton-Code-Editor/Graviton-App.git

There are 2 different branches:
* Master: daily source (maybe unstable).
* Stable: this doesn't mean it's ready to be released as stable build , but it doesn't have that many bugs, it's more stable overall.

## 2 - Installing the dependencies

Go inside the folder:
> $ cd Graviton-App

### Windows

Run as admin:
> $ npm --global --production install windows-build-tools

Install the dependencies:
> $ npm install

Rebuild a dependency:
> $ npm run rebuild

### Linux

(Tested on ubuntu)

You must have Python 2.7 installed.

Install the dependencies:
> $ npm install

Rebuild a dependency:
> $ npm run rebuild

### MacOS

You must have Python 2.7 installed.

Install the dependencies:
> $ npm install

Rebuild a dependency:
> $ npm run rebuild

## 3 - Building 

### Testing

In case you just wanna test it, run:

> $ npm start

### Windows

- From a Windows machine:

> $ npm run build 

- From a Windows or Linux machine for 32-bits Windows:

> $ npm run build:win32

- From a Linux machine with Wine: 

>  $ npm run build:win 

### Linux

- From a Linux machine: 

>  $ npm run build 

This will build an AppImage, Debian and RPM packages by default. You can change that on the package.json.

If you want to build an specific package for your distribution, try this command (it might not be added yet):

>  $ npm run build:packageExtensionHere

For example if you want to build this for your Ubuntu machine type this:

>  $ npm run build:deb

You might need some dependencies to build in some formats.

   
### MacOS

- From a Macintosh: 

>  $ npm run build 
