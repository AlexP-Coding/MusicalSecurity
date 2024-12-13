/* Helper Functions Library */

/* Error Handling */

/**
 * Simple function to centralize error handling instead of using console.log everywhere.
 * @param {Error} e The exception in question
 */
function report(e) {
    console.log(e)
}

/**
 * A unified way of replying to clients when something goes wrong.
 * @param {Error} error The exception in question 
 * @param {*} req Request object
 * @param {*} res Response object
 * @param {*} next Next context handler
 */
function errorHandler(error, req, res, next) {
    if (error instanceof SyntaxError) {
      res.status(422).send({message:"Badly formed JSON payload."});
    } else {
      next();
    }
}

/**
 * Defines the default error message
 * @returns String containing the error message
 */
function defaultErr() {
    return {message: "Something went wrong."}
}

/* Misc. */
/**
 * This function rounds a float to a specified number of decimals. 
 * Because JS math sucks and won't do this right (WTH?)
 * @param {float} value - The value to round
 * @param {int} decimals - Number of decimals to round to
 * @returns The rounded value
 */
function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

export {
    report,
    errorHandler,
    defaultErr, 
    round
}