/* OTP Library */

import { createHmac as hmacSHA1 } from 'crypto';
import { default as base32encode } from 'base32-encode'
import { default as base32decode } from 'base32-decode'
import { nanoid } from 'nanoid'

/* TOTP-Related functions */
/* Constants */
const OTP_TIME_STEP = 30;               // The time-step to support, in seconds
const OTP_DIGITS = 6;                   // How many digits the OTP should be composed of
const OTP_ISSUER_NAME = "MusicMarkt"
const OTP_ALGORITHM = "SHA1"            // What algorithm to use. SHA1 default as it is the most widely used (Google Authenticator only supports SHA1)
const OTP_KEY_UUID_LENGTH = 20          // How many digits to use when composing the UUID underneath the key

/**
 * Generates a cryptographically strong key to be used in the OTP algorithm.
 * This acts according to the standard implementation of Google Authenticator,
 * which accepts keys in base32 encoding with no padding, following RFC4648.
 * @returns A base32-encoded key, with no padding
 */
function genOTPKey() {
    return base32encode(
        Buffer.from(
            nanoid(OTP_KEY_UUID_LENGTH), 
            "utf-8"), 
        'RFC4648', 
        { padding: false })
}

/**
 * Returns the previous OTP-time step, the current time-step, and the next time-step.
 * This is done to account for input delays, desynchronized clocks, or network delays.
 */
function calcOTPWindow() {

    const epoch = new Date().getTime();

    return [
        Math.floor((epoch - OTP_TIME_STEP * 1000.0) / OTP_TIME_STEP / 1000),
        Math.floor(epoch / OTP_TIME_STEP / 1000.0),
        Math.floor((epoch + OTP_TIME_STEP * 1000.0) / OTP_TIME_STEP / 1000)
    ]
}

/**
 * Generates a set of OTPs for the current time-step, and the previous and next time-steps, from the given key.
 * @param {string} key The key to generate the OTPs from, encoded in base32, with no padding.
 * @returns {string[]} An array of OTPs, one for each time-step (previous, current, next)
 */
function genOTP(key) {
    // Getting the window-respective time-steps
    let windowEpochs = calcOTPWindow()

    // Preparing key, decoding it from base32 to hex, into a byte array
	let key_bytes = base32decode(key, 'RFC4648', { padding: false })

    let codes = windowEpochs.map((epoch) => {
        // Preparing time, left padding as per RFC-6238, passing it as a buffer to the HMAC function
        epoch = Buffer.from(epoch.toString(16).padStart(16, "0"), "hex")

        let hmac = hmacSHA1("sha1", key_bytes)
        hmac.setEncoding("hex")
        hmac.update(epoch)
        hmac.end()
        hmac = hmac.read(); // the SH1 HMAC output
        

        // As per RFC-6238, the last character (times 2) of the HMAC is used as an offset
        const lastCharIndex = parseInt(hmac.slice(-1), 16);
        const subStr = hmac.substr(lastCharIndex * 2, 8);

        // Converting the substring from hex to an integer, and fit it into a 32-bit integer
        const digits = parseInt(subStr, 16) & 2147483647;

        // Getting as many digits as requested (from the right)
        return String(digits).slice(-OTP_DIGITS);;
    });
        
    return codes
}

/**
 * Returns a URL to be used with authenticator apps which allows pairing the user with the given key.
 * @param {string} email The user e-mail to associate the secret key with.
 * @param {string} key The key to generate the OTPs from, encoded in base32, with no padding.
 * @returns 
 */
function genPairingURL(email, key) {
    return `otpauth://totp/${OTP_ISSUER_NAME}:${email}?secret=${key}&issuer=${OTP_ISSUER_NAME}&period=${OTP_TIME_STEP}&digits=${OTP_DIGITS}&algorith=${OTP_ALGORITHM}`
}

export { 
    genOTPKey,
    genOTP,
    genPairingURL
}