#!/bin/bash
# Defining Forwarder as default gateway
sudo route add default gw 192.168.1.30

# Adding CA certificate to VMs trusted certificates to allow HTTPS to the database-server
sudo cp /bootstrap/ca/server.crt /usr/local/share/ca-certificates/musicmarkt-ca.cert
nohup sudo update-ca-certificates 0<&- &>/dev/null & # Hiding command output not to polute Vagrant log

# Installing dependencies
sudo apk add npm
cd /app/backend
npm install
npx prisma generate

# Launching MusicMarkt API with request logging flag enabled
# Replacing development .env with production .env
[ ! -f .env-prod ] || mv -f .env-prod .env
nohup node server.js -l 0<&- &>/dev/null &