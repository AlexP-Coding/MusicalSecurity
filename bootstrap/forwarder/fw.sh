### IPTABLES RULES:

# eth0: mandatory NAT, eth1: internal, eth2: dmz, eth3: host-connected
# Note: eth0 rules account for eth0 as mandatory NAT interface for vagrant ssh into machine

## Input Rules ( -> )
echo "Applying INPUT rules"

# Rate-limit new connections to about 200 attempts per 30 seconds to prevent bruteforcing
sudo iptables -A INPUT -p tcp -m state --state NEW -m recent --set;
sudo iptables -A INPUT -p tcp -m state --state NEW -m recent --update --seconds 30 --hitcount 200 -j DROP;

# (vagrant -> db) (i: eth0; p: tcp) Receive msgs from: vagrant_host; to: ip unspecified, port 22
# sudo iptables -A INPUT -p tcp -i eth0 --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp -i eth0 --dport 22 --j ACCEPT;

# Allow posterior connection with Vagrant
sudo iptables -A INPUT -p tcp -i eth0 -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT;

# Handshake
# (web->fwd) (i: eth2; p: tcp) Receive msgs on: IP_fwd_dmz, port :443; from: IP_web_dmz, port unspecified
# sudo iptables -A INPUT -p tcp -i eth2 -s IP_web_dmz -d IP_fwd_dmz --dport 443 -j ACCEPT
sudo iptables -A INPUT -p tcp -i eth2 -s 192.168.2.20 -d 192.168.2.10 --dport 443 -j ACCEPT;

# (web->fwd) (i: eth2; p: tcp) Receive msgs on: IP_fwd_dmz, port unspecified; from: IP_web_dmz, port unspecified
# sudo iptables -A INPUT -p tcp -i eth2 -s IP_web_dmz -d IP_fwd_dmz -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A INPUT -p tcp -i eth2 -s 192.168.2.20 -d 192.168.2.10 -j ACCEPT;

# Handshake
# (api->fwd) (i: eth1; p: tcp) Receive msgs on: IP_fwd_internal, port :443; from: IP_api_internal, port unspecified
# sudo iptables -A INPUT -p tcp -i eth1 -s IP_api_internal -d IP_fwd_internal --dport 443 -j ACCEPT
sudo iptables -A INPUT -p tcp -i eth1 -s 192.168.1.20 -d 192.168.1.30 --dport 443 -j ACCEPT;

# (api->fwd) (i: eth1; p: tcp) Receive msgs on: IP_fwd_internal, port unspecified; from: IP_api_internal, port unspecified
# sudo iptables -A INPUT -p tcp -i eth1 -s IP_api_internal -d IP_fwd_internal -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A INPUT -p tcp -i eth1 -s 192.168.1.20 -d 192.168.1.30 -j ACCEPT;

# Handshake
# (host->fwd) (i: eth3; p: tcp) Receive msgs on: IP_fwd_dmz, port :443 (httpS); from: IP unspecified, port unspecified
# sudo iptables -A INPUT -p tcp -i eth3 -d IP_fwd_dmz --dport 443 -j ACCEPT
sudo iptables -A INPUT -p tcp -i eth3 -d 192.168.56.10 --dport 443 -j ACCEPT;

# (host->fwd) (i: eth3; p: tcp) Receive msgs on: IP_fwd_dmz, port :unspecified; from: ESTABLISHED IP unspecified, port unspecified
# sudo iptables -A INPUT -p tcp -i eth3 -d IP_fwd_dmz -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A INPUT -p tcp -i eth3 -d 192.168.56.10 -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT;

# Drop everything else
sudo iptables -A INPUT -j DROP;


### Output Rules ( -> )
echo "Applying OUTPUT rules"

# (host<-fwd) (p: tcp) Send messages from: fwd; to: ESTABLISHED host 
# sudo iptables -A OUTPUT -p tcp -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A OUTPUT -p tcp -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT;

# (web<-fwd) (p: tcp) Send msgs from: IP_fwd_dmz, port unspecified; to: IP_web_dmz, port 5000
# sudo iptables -A OUTPUT -p tcp -s IP_fwd_dmz -d IP_web_dmz -j ACCEPT
sudo iptables -A OUTPUT -p tcp -s 192.168.2.10 -d 192.168.2.20 --dport 5000 -j ACCEPT;

# (api<-fwd) (p: tcp) Send msgs from: IP_fwd_internal, port unspecified; to: IP_api_internal, port 4000
# sudo iptables -A OUTPUT -p tcp -s IP_fwd_internal -d IP_api_internal -j ACCEPT
sudo iptables -A OUTPUT -p tcp -s 192.168.1.30 -d 192.168.1.20 --dport 4000 -j ACCEPT;

# Drop everything else
sudo iptables -A OUTPUT -j DROP;
