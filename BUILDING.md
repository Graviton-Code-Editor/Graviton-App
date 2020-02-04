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

For Windows, Linux and MacOS:
> $ npm run build 
