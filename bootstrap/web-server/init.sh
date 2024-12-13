#!/bin/bash
# Defining Forwarder as default gateway
sudo route add default gw 192.168.2.10

# Installing dependencies
sudo apk add npm
cd /app/frontend
npm install

# Launching MusicMarkt frontend
nohup npm run dev 0<&- &>/dev/null &