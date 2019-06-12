#!/bin/bash

# clone the repository
git clone http://github.com/garden/tree

# generate HTTPS credentials
cd tree
openssl genrsa -aes256 -out https.key 1024
openssl req -new -nodes -key https.key -out https.csr
openssl x509 -req -days 365 -in https.csr -signkey https.key -out https.crt
cp https.key{,.orig}
openssl rsa -in https.key.orig -out https.key

# start the server in HTTPS mode
cd web
sudo node ../server.js 443 'yes' >> ../node.log &

# here is how to stop the server
for pid in `ps aux | grep 'node ../server.js' | awk '{print $2}'` ; do
  sudo kill -9 $pid 2> /dev/null
done

exit 0