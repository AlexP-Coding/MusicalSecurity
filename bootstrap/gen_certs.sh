## This script generates the certificates for the different servers according to the respective configuration files.
## It assumes the key-pair for each server has already been created, and that the CA's key-pair and certificate have been created.

# Generating API certificate
openssl req -config api-server/certs/api.cert.conf -new -key api-server/certs/server.key -out api-server/certs/server.csr
openssl x509 -req -days 365 -in api-server/certs/server.csr -CA ca/server.crt -CAkey ca/server.key -out api-server/certs/server.crt -extfile api-server/certs/api.cert.conf -extensions req_ext

# Generating DB certificate
openssl req -config database-server/certs/db.cert.conf -new -key database-server/certs/server.key -out database-server/certs/server.csr
openssl x509 -req -days 365 -in database-server/certs/server.csr -CA ca/server.crt -CAkey ca/server.key -out database-server/certs/server.crt -extfile database-server/certs/db.cert.conf -extensions req_ext

# # Generating FWD certificate
openssl req -config forwarder/certs/fwd.cert.conf -new -key forwarder/certs/server.key -out forwarder/certs/server.csr
openssl x509 -req -days 365 -in forwarder/certs/server.csr -CA ca/server.crt -CAkey ca/server.key -out forwarder/certs/server.crt -extfile forwarder/certs/fwd.cert.conf -extensions req_ext

# # Generating WEB certificate
openssl req -config web-server/certs/web.cert.conf -new -key web-server/certs/server.key -out web-server/certs/server.csr
openssl x509 -req -days 365 -in web-server/certs/server.csr -CA ca/server.crt -CAkey ca/server.key -out web-server/certs/server.crt -extfile web-server/certs/web.cert.conf -extensions req_ext