# Building Graviton

Instructions to build Graviton from the source:

## 1 - Downloading the source

Clone the git repository:
> $ git clone https://github.com/Graviton-Code-Editor/Graviton-App.git

## 2 - Installing the dependencies

Go inside the folder:
> $ cd Graviton-App

### Windows

Run as admin:
> $ npm --global --production install windows-build-tools

Install the dependencies:
> $ npm install

Rebuild node-pty:
> $ npm run rebuild

### Linux

You must have Python 2.7 installed.

Install the dependencies:
> $ npm install

Rebuild node-pty:
(You might need to run it a few times until it says "Rebuild completed")
> $ npm run rebuild


Install RPM dependencies:
> $ sudo apt-get install rpm


### MacOS

You must have Python 2.7 installed.

Install the dependencies:
> $ npm install

Rebuild node-pty:
(You might need to run it a few times until it says "Rebuild completed")
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
   

### MacOS

From a Macintosh: 
>  $ npm run build 
