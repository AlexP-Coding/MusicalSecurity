/* Authentication Routes (Prefixed by /auth) */

/* Imports */
import express from 'express';
import { createUser, validateUserCredentials, enrollOTP, validateOTP } from '../lib/persistence.js'
import { generateToken, authenticateToken } from '../lib/authentication.js';
import { sanitizeLogin, sanitizeRegistration, sanitizeOTPValidation} from '../lib/sanitization.js';
import { defaultErr } from '../lib/helper.js'

/* Router Setup */
const router = express.Router();

/* Register */

router.post('/register', sanitizeRegistration(), (req, res) => {
    createUser(
        req.body.name,
        req.body.email,
        req.body.username,
        req.body.password,
    ).then((result) => {
        switch (result) {
            case null:
                return res.status(500).send(defaultErr())
            case "EMAIL_IN_USE":
                return res.status(409).send({message: "The chosen e-mail is already in use."})
            case "USERNAME_IN_USE":
                return res.status(409).send({message: "The chosen username is already in use."})
            default:
                return res.status(201).send({
                    message: "Successfully created user.",
                    validationToken: generateToken(
                        req.body.email, 
                        "VALIDATION"),
                })
        }
    })
})

/* Login Route */

router.post('/login', sanitizeLogin(), (req, res) => {
    validateUserCredentials(
        req.body.email,
        req.body.password,
    ).then((result) => {
        switch (result) {
            case null:
                return res.status(500).send(defaultErr())
            case "INVALID_EMAIL":
                return res.status(401).send({ message: "E-mail not recognized." })
            case "INVALID_CREDENTIALS":
                return res.status(401).send({ message: "Invalid credentials." })
            default:
                // Generate a validation-only token, which can be used to initiate OTP validation
                // Pointing the user to either /auth/otp/enroll or /auth/otp/validate according to their status.
                return res.status(200).send({
                    message: "Successfully logged in. ".concat(result.OTPEnrolled ? "Proceed to OTP validation (/auth/otp/validate)." : "You have not yet enrolled an OTP device. Proceed to OTP enrollment (/auth/otp/enroll)."),
                    validationToken: generateToken(
                        req.body.email,
                        "VALIDATION"),
                    OTPEnrolled: result.OTPEnrolled
                })
        }
    })
});

router.post('/status', authenticateToken("SESSION"), (req, res) => {  
    res.status(200).send({
        message: "Valid token. Login successful.",
        id: req.user.id
    })
});


/* OTP Management Routes */

router.post('/otp/enroll', authenticateToken("VALIDATION"), (req, res) => {
    enrollOTP(
        req.user.email,
    ).then((result) => {
        switch (result) {
            case null:
                return res.status(500).send(defaultErr())
            case "OTP_ALREADY_ENROLLED":
                return res.status(403).send({
                    message: "You've already enrolled in OTP. Proceed to OTP validation (/auth/otp/validate)."
                })
            default:
                // Sending an OTP pairing URL, which allows the user to pair a new authenticator device
                return res.status(200).send({
                    message: "OTP enrollment started. Proceed to OTP validation (/auth/otp/validate).",
                    OTPPairingURL: result.pairingURL
                })
        }
    })
});

router.post('/otp/validate', authenticateToken("VALIDATION"), sanitizeOTPValidation(), (req, res) => {
    validateOTP(
        req.user.email,
        req.body.otp
    ).then((result) => {
        switch (result) {
            case null:
                return res.status(500).send(defaultErr())
            case "OTP_NOT_ENROLLED":
                return res.status(403).send({
                    message: "You haven't started OTP enrollment. Proceed to OTP enrollment (/auth/otp/enroll)."
                })
            case "INVALID_CODE":
                return res.status(401).send({
                    message: "The provided OTP code is not correct. Access unauthorized."
                })
            default:
                // Generate a validation-only token, which can be used to initiate OTP validation
                return res.status(200).send({
                    message: "Successfully validated OTP.",
                    sessionToken: generateToken(
                        req.user.email,
                        "SESSION"),
                    userId: req.user.id
                })
        }
    })
});


// TODO: Remove OTP enrollment (low priority)
// router.delete('/otp', (req, res) => {

// });

export { router as default };