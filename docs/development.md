# 📚 Setting up HTTPS development of the API

- (This is different for every OS)
- What you’re looking to do is add the CA’s certificate as a trusted certificate in your machine. This file is located at `/bootstrap/ca/server.crt`
- The easiest way to do this is to go on your browser’s settings and find an option such as *******************Manage Certificates******************* which will probably take you to the OS’s certificate management wizard.
- Once you’re there, add the CA’s certificate as trusted, and you should be able to just boot up the API and access it.
    - Starting up the API
        - Go to `/backend`
        - Run `node server.js -l`
            - The `-l` option is for logging requests
        - If you want a more developer-friendly way, use `nodemon`
            - `npx nodemon server.js -l`
            - What his will do is restart the server every time it detects a change.
    - Try and access the API on your browser by going to [https://localhost:4000](https://localhost:4000), and if everything went well, you shouldn’t see any SSL warnings.

### Backend Source-Code Layout

```bash
networking
├── README.md
├── Vagrantfile
├── backend
│   ├── database                     
│   │   ├── db_create.sql
│   │   ├── db_populate.sql
│   │   ├── db_triggers.sql
│   │   └── schema.prisma
│   ├── lib                    -> Libraries for sectioning code according to scope or purpose.
│   │   ├── authentication.js  -> Holds most authentication, no more changes expected.
│   │   ├── authorization.js   -> Holds authorization logic. This needs to be adapted everytime a new route which requires authorization is created! Add to the resource list and add your rules to the switch case. 
│   │   ├── helper.js          -> Helper functions.
│   │   ├── otp.js             -> Holds all OTP logic, no more changes expected.
│   │   ├── persistence.js     -> If a route needs to persist anything or get anything from the database, that code should go here.
│   │   └── sanitization.js    -> Holds all the sanitizaters. If a route requires any sort of input data, an adequate sanitizer MUST be used or built. 
│   ├── routes                 -> Where all express.js routes are defined.
│   │   ├── auth.js            -> Defines all authentication routes, no more changes expected.
│   │   ├── store.js           -> Where the artist/payment/product routes will go.
│   │   └── user.js            -> Defines user-management routes.
│   ├── server.js
│   └── test.txt
├── bootstrap                  -> Shared by all VMs, allows access to certificates and provisioning scripts.
│   ├── api-server
│   │   ├── certs
│   │   │   ├── api.cert.conf
│   │   │   ├── public.key
│   │   │   ├── server.crt
│   │   │   ├── server.csr
│   │   │   └── server.key
│   │   └── init.sh
│   ├── ca
│   │   ├── public.key
│   │   ├── server.crt
│   │   ├── server.csr
│   │   ├── server.key
│   │   └── server.srl
│   ├── database-server
│   │   ├── certs
│   │   │   ├── db.cert.conf
│   │   │   ├── public.key
│   │   │   ├── server.crt
│   │   │   ├── server.csr
│   │   │   └── server.key
│   │   └── init.sh
│   ├── forwarder
│   │   ├── Caddyfile          -> This is used by Caddy, a reverse proxy which allows the host system to access the API via api.musicmarkt.local and the webserver via musicmarkt.local
│   │   ├── certs
│   │   │   ├── fwd.cert.conf
│   │   │   ├── public.key
│   │   │   ├── server.crt
│   │   │   ├── server.csr
│   │   │   └── server.key
│   │   └── init.sh
│   ├── gen_certs.sh           -> Allows regenerating certificates. This is for more of a doomsday scenario.
│   ├── host
│   └── web-server
│       ├── certs
│       │   ├── public.key
│       │   ├── server.crt
│       │   ├── server.csr
│       │   ├── server.key
│       │   └── web.cert.conf
│       └── init.sh
└── frontend
	...
```