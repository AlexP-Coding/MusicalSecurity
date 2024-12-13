/* Input Sanitization and Validation Library */

import { body, validationResult, param, query } from 'express-validator';

/* Authentication endpoints sanitization */

function sanitizeRegistration() {
    return [
        body('name')
            .notEmpty()
            .isString(),
        body('email')
            .isEmail()
            .toLowerCase(),
        body('username')
            .notEmpty()
            .isString(),
        body('password')
            .isLength({ min: 5 }),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            next();
        },

    ]
}

function sanitizeLogin() {
    return [
        body('email')
            .isEmail()
            .toLowerCase(),
        body('password')
            .notEmpty(),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            next();
        },

    ]
}

function sanitizeOTPValidation() {
    return [
        body('otp')
            .notEmpty()
            .isNumeric()
            .isLength(6),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            next();
        },

    ]
}

/* User endpoints sanitization */
function sanitizeUserId() {
    return [
        param('userId')
            .notEmpty()
            .isNumeric()
            .toInt(),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            next();
        },

    ]
}

function sanitizeAddressAttributes() {
    return [
        param('userId')
            .notEmpty()
            .isNumeric()
            .toInt(),
        body('city')
            .notEmpty()
            .isString()
            .isLength({ max: 50}),
        body('postal_code')
            .notEmpty()
            .isString()
            .isLength({ max: 10}),
        body('street')
            .notEmpty()
            .isString()
            .isLength({ max: 100}),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            next();
        },
    ]
}


/**
 * For creating cart items
 */
function sanitizeCartItemAttributes() {
    return [
        param('userId')
            .notEmpty()
            .isInt()
            .toInt(),
        body("productId")
            .notEmpty()
            .isInt()
            .toInt(),
        body("quantity")
            .notEmpty()
            .isInt()
            .toInt(),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            next();
        },
    ]
}

/**
 * For updating cart items
 */
function sanitizeCartItemParameters() {
    return [
        param('userId')
            .notEmpty()
            .isInt()
            .toInt(),
        param("cartItem")
            .notEmpty()
            .isInt()
            .toInt(),
        body("quantity")
            .notEmpty()
            .isInt()
            .toInt(),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            next();
        },
    ]
}

/* For deleting a cart item */
function sanitizeCartItemDeletion() {
    return [
        param('userId')
            .notEmpty()
            .isNumeric()
            .toInt(),
        param('cartItem')
            .notEmpty()
            .isNumeric()
            .toInt(),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            next();
        },

    ]
}


/* Store endpoints sanitization */

/**
 * For obtaining all products
 */
function sanitizeProductParameters() {
    return [
        query('artist')
            .optional()
            .isNumeric()
            .toInt(),
        query("sort")
            .optional()
            .isIn(["newest", "oldest", "price_asc", "price_desc", "name_asc", "name_desc"]),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            next();
        },

    ]
}

/**
 * For obtaining a single product
 */
function sanitizeProductId() {
    return [
        param('productId')
            .notEmpty()
            .isNumeric()
            .toInt(),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            next();
        },
    ]
}

/**
 * For creating new products
 */
function sanitizeProductAttributes() {
    return [
        body('price')
            .notEmpty()
            .isFloat({ min: 0 })
            .toFloat(),
        body("type")
            .notEmpty()
            .isString()
            .isLength({ max: 20 }),
        body("name")
            .notEmpty()
            .isString()
            .isLength({ max: 50 }),
        body("brand")
            .notEmpty()
            .isString()
            .isLength({ max: 30 }),
        body("description")
            .notEmpty()
            .isString()
            .isLength({ max: 250 }),
        body("launchDate")
            .notEmpty()
            .isISO8601(),
        body("artistId")
            .optional()
            .isNumeric()
            .toInt(),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            next();
        },
    ]
}


/* Artist endpoints sanitization */

/**
 * For obtaining all artists
 */
function sanitizeArtistParameters() {
    return [
        query("sort")
            .optional()
            .isIn(["newest", "oldest", "name_asc", "name_desc"]),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            next();
        },

    ]
}


/**
 * For obtaining a single artist
 */
function sanitizeArtistId() {
    return [
        param('artistId')
            .notEmpty()
            .isNumeric()
            .toInt(),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            next();
        },
    ]
}


/**
 * For creating new artists
 */
function sanitizeArtistAttributes() {
    return [
        body('name')
            .notEmpty()
            .isString()
            .isLength({max: 50}),
        body("type")
            .notEmpty()
            .isString()
            .isIn(["SOLO_ARTIST", "BAND"]),
        body("description")
            .notEmpty()
            .isString()
            .isLength({ max: 250 }),
        body("genre")
            .notEmpty()
            .isString()
            .isLength({ max: 50 }),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            next();
        },
    ]
}


/* Order Functions */

/*
 * For obtaining an order
*/
function sanitizeOrderId() {
    return [
        param('orderId')
            .notEmpty()
            .isNumeric()
            .toInt(),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send({ errors: errors.array() });
            }
            next();
        },
    ]
}



export { 
    sanitizeRegistration,
    sanitizeLogin,
    sanitizeOTPValidation,
    sanitizeUserId,
    sanitizeAddressAttributes,
    sanitizeCartItemAttributes,
    sanitizeCartItemParameters,
    sanitizeCartItemDeletion,
    sanitizeProductParameters,
    sanitizeProductId,
    sanitizeProductAttributes,
    sanitizeArtistParameters,
    sanitizeArtistId, 
    sanitizeArtistAttributes,
    sanitizeOrderId
}