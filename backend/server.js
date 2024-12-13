/* Checking variables */
import * as dotenv from 'dotenv'
dotenv.config()

const requiredEnvironmentVariables = [
    "DATABASE_URL",
    "JWT_SECRET",
    "JWT_VALIDATION_EXPIRATION",
    "JWT_SESSION_EXPIRATION"
]

if (requiredEnvironmentVariables.some((value) => !(value in process.env))) {
    console.log('❌ Missing environment variables. Double-check your .env file.');
    process.exit(0);
}

/* Imports */
import express, { json, urlencoded } from 'express';
import yargs from 'yargs';
import figlet from 'figlet';

// Parsing arguments
const argv = yargs().parse(process.argv)

/* Checking for certificates */
import { readFileSync } from 'fs';

// Setting development mode
process.env.MODE = argv.dev ? "development" : "production"

// We should load certificates relative to the repository structure if in development mode,
// and load them from the VM synced folder /bootstrap if in production mode
const relativePath = process.env.MODE == "production" ? "" : ".."

const credentials = {
    key: readFileSync(relativePath + '/bootstrap/api-server/certs/server.key', 'utf8'),
    cert: readFileSync(relativePath + '/bootstrap/api-server/certs/server.crt', 'utf8'),
    ca: readFileSync(relativePath + '/bootstrap/ca/server.crt', 'utf8')
}

/* Middleware */
import session from 'express-session';
import cookieParser from 'cookie-parser';
import morgan, { token } from 'morgan';
import https from 'https';
import cors from 'cors';
import moment from 'moment-timezone';
import { errorHandler } from './lib/helper.js';

/* Initializing */
const app = express();

/* Middleware Init */
// Enable request logging middleware if -l flag is present
if (argv.l) {
    token('date', (req, res) => {
        return moment().tz("Europe/Lisbon").format('MMMM Do YYYY, H:mm:ss');
    })
    app.use(morgan(':status | :method :url | :remote-addr | :response-time ms | :date'));
}

// Important middleware

app.use(cors({
    origin: true,
    credentials: true
})) // Enable cross-origin resource sharing
app.use(json({ // Enable parsing for received JSON payloads
    strict: false
}));
app.use(cookieParser()); // Enable cookie parsing for session management
app.use(urlencoded({
    extended: true
}));
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    cookie: {
        maxAge: 600000
    },
    resave: true,
    saveUninitialized: true
}));

/* Critical Routes */

// Auto Rerouting HTTP -> HTTPS
if (argv.SSL != "False") {
    app.use((req, res, next) => {
        if (!req.secure)
            return res.redirect('https://' + req.headers.host + req.url);
        else
            return next();
    });
}

/* Importing all API routes */

import auth from './routes/auth.js';
import user from './routes/user.js';
import store from './routes/store.js';
import { relative } from 'path';

// Using modular API routes
app.use('/auth', auth);
app.use('/user', user);
app.use('/store', store);

// Centralizing error handling
app.use(errorHandler);
app.get('*', function (req, res) {
    return res.status(404).send({
        message: "Invalid endpoint."
    })
});

/* Starting server */

const port = process.env.PORT || 4000

console.log(figlet.textSync('MusicMarkt API', {
    whitespaceBreak: true
}))

var httpsserver = https.createServer(credentials, app)

httpsserver.listen(port, () => {
    console.log(`🎧 MusicMarkt API server listening on port ${port} ${
    argv.SSL != "False" ? "with SSL support! ✅" : "without SSL support! 🚫"}`)

    /* Flag definition */
    if (argv.l || argv.requestLogging) {
        console.log("📝 Request logging enabled.")
    }
    if (argv.m || argv.databaseMonitoring) {
        console.log("⚙️ Database monitoring enabled.")
    }

    if (process.env.MODE == "development") {
        console.log("🏗️  Developer mode enabled.")
    }
}).on('error', function (err) {
    if (err.code == 'EADDRINUSE') {
        console.log(`🚫 Port ${port} already in use.`);
    } else {
        console.log("🔥 Something went wrong.");
    }
    process.exit(1);
});

export { app as app };