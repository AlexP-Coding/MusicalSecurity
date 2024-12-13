#!/bin/bash
# Defining Forwarder as default gateway (for obtaining dependencies only)
sudo route add default gw 192.168.1.30

# Installing dependencies
sudo apk add mariadb mariadb-client iptables

# Applying firewall rules
sudo /bootstrap/database-server/fw.sh

# Removing Forwarder as the default gateway in order to make internet access impossible
sudo route del default

# Configuring database, pointing to certificates
sudo /etc/init.d/mariadb setup
sudo cp -f /bootstrap/database-server/db.conf /etc/my.cnf.d/mariadb-server.cnf
sudo rc-service mariadb start

# Creating and populating database
sudo mysql < /app/backend/database/db_create.sql
sudo mysql < /app/backend/database/db_populate.sql

# Allowing (only) the API machine control over the MusicMarkt database
sudo mysql -e "CREATE USER 'api'@'localhost' IDENTIFIED BY 'abzMIx4s5Dt8eK^tls';"
sudo mysql -e "GRANT ALL PRIVILEGES ON musicmarkt_db.* TO 'api'@'localhost' WITH GRANT OPTION;"
sudo mysql -e "CREATE USER 'api'@'192.168.1.20' IDENTIFIED BY 'abzMIx4s5Dt8eK^tls';"
sudo mysql -e "GRANT ALL PRIVILEGES ON musicmarkt_db.* TO 'api'@'192.168.1.20' WITH GRANT OPTION;"
sudo mysql -e "FLUSH PRIVILEGES;"

