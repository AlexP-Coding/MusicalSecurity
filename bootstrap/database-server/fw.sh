### IPTABLES RULES:

# Note: eth0 rules account for eth0 as mandatory NAT interface for Vagrant ssh into machine (only has port-forwarding 2222 (Host) -> 22 (Guest))


## Input Rules ( -> )
echo "Applying INPUT rules"

# (vagrant -> db) (i: eth0; p: tcp) Receive msgs from: vagrant_host; to: ip unspecified, port 22
# sudo iptables -A INPUT -p tcp -i eth0 --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp -i eth0 --dport 22 -j ACCEPT;

# Allow posterior connection with Vagrant
sudo iptables -A INPUT -p tcp -i eth0 -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT;

# Handshake
# (api -> db) (i: eth1; p: tcp) Receive msgs on: IP_db_internal, port 3306; from: IP_api_internal, port unspecified
# sudo iptables -A INPUT -p tcp -i eth1 -s IP_api_internal -d IP_db_internal --dport 3306 -j ACCEPT
sudo iptables -A INPUT -p tcp -i eth1 -s 192.168.1.20 -d 192.168.1.10 --dport 3306 -j ACCEPT;

# (api -> db) (i: eth1; p: tcp) Receive msgs on: IP_db_internal, port unspecified; from: ESTABLISHED IP_api_internal, port unspecified
# sudo iptables -A INPUT -p tcp -i eth1 -s IP_api_internal -d IP_db_internal -j ACCEPT
sudo iptables -A INPUT -p tcp -i eth1 -s 192.168.1.20 -d 192.168.1.10 -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT;

# Drop everything else
sudo iptables -A INPUT -j DROP;


## Output Rules ( <- )
echo "Applying OUTPUT rules"

# Allowing established connections to go through dynamic ports (this applies to DB->API connections and Guest->Host connections)
# sudo iptables -A OUTPUT -p tcp -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A OUTPUT -p tcp -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT;

# Drop everything else
sudo iptables -A OUTPUT -j DROP;

