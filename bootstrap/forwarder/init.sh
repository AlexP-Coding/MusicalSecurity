#!/bin/bash
# Setup Forwarder DNS
echo -e "nameserver 8.8.8.8\nnameserver 8.8.4.4" | sudo tee /etc/resolv.conf

# Installing dependencies
sudo apk add iptables
sudo apk add caddy
sudo apk add dbus avahi avahi-tools snort tcpdump tshark

# Allowing Forwarder to forward packets
sudo sysctl net.ipv4.ip_forward=1
sudo iptables -P FORWARD ACCEPT
sudo iptables -F FORWARD

# Configuring Forwarder as NAT
sudo iptables -t nat -F
sudo iptables -t nat -A POSTROUTING  -o eth0 -j MASQUERADE

# Adding CA certificate to VMs trusted certificates to allow HTTPS to the Web-server and API-server
sudo cp /bootstrap/ca/server.crt /usr/local/share/ca-certificates/musicmarkt-ca.cert
nohup sudo update-ca-certificates 0<&- &>/dev/null & # Hiding command output not to polute Vagrant log

# Boot up Caddy as a background process
nohup caddy start --config /bootstrap/forwarder/Caddyfile 0<&- &>/dev/null & # Hiding command output not to polute Vagrant log

# Start avahi-daemon and publish mDNS entries
sudo dbus-daemon --system
nohup sudo avahi-daemon --no-chroot 0<&- &>/dev/null &
sleep 3
nohup avahi-publish -a -R api-musicmarkt.local 192.168.56.10 0<&- &>/dev/null &
nohup avahi-publish -a -R musicmarkt.local 192.168.56.10 0<&- &>/dev/null &

# Configuring Firewall rules (at the end to allow for the Forwarder to gather dependencies)
sudo /bootstrap/forwarder/fw.sh

# Configuring Snort
sudo mkdir -p /snort/logs
nohup sudo snort -c /bootstrap/forwarder/nids.conf -K ascii -l /snort/logs 0<&- &>/dev/null &