/* Authentication Library */

import jwt from 'jsonwebtoken';
import { getUserByEmail } from './persistence.js';

/* JWT Management */

/**
 * Generates an JWT token with a user's email. This function can be used in two modes:
 * - "VALIDATION": Generates a code which is only used to request OTP validation. Valid only for a few minutes. 
 * - "SESSION": Generates a code which can be used a session token, to authenticate requests, with a longer validity duration.
 * @param {*} email  
 * @returns A JWT access token which can be used to validate a user's OTP or a regular session token.
 */
function generateToken(email, mode) {

    return jwt.sign(
        {
            email: email,
            mode: mode
        }, 
        process.env.JWT_SECRET,
        { 
            expiresIn: mode == "SESSION" ? process.env.JWT_SESSION_EXPIRATION : process.env.JWT_VALIDATION_EXPIRATION
        });
}

/**
 * Authenticates a JWT token, works as middleware.
 * @param {string} mode The mode the token should be in (SESSION or VALIDATION)
 * @param {*} req Request object
 * @param {*} res Response object
 * @param {*} next Next context handler
 * @returns {Boolean}
 */
function authenticateToken(mode) {
    return function (req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        const unauthorizedMessage = (res) => {
            res.status(401).send({
                message: "Access unauthorized."
            })
        }

        const modeMistachMessage = (res, currentMode, expectedMode) => {
            res.status(403).send({
                message: "This token isn't valid for this purpose.",
                currentMode: currentMode,
                expectedMode: expectedMode
            })
        }

        if (token == null) return unauthorizedMessage(res)

        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if (err) return unauthorizedMessage(res)

            if (user.mode != mode) return modeMistachMessage(res, user.mode, mode)

            // Retrieve user information
            let enrichedUser = await getUserByEmail(user.email)

            if (!enrichedUser) return unauthorizedMessage(res)

            // Include the retrieved user object in the request object
            req.user = enrichedUser

            next()
        })
    }
}

export { 
    generateToken,
    authenticateToken }
    