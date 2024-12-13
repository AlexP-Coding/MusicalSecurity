/* Authorization Library */

/**
 * The point of this library is to centralize all authorization logic.
 * It's code is meant to be used as middleware in requests which require authorization, and
 * it'll parse a request and check if the user is authorized to perform the requested action
 * or manipulate the target resource.
 */

import { isOrderByUser } from './persistence.js';

async function authorize(req, res, next) {

    // Identifying the resource in question via endpoint
    const resourceMap = {
        /* User endpoints */
        "/user/:userId":    "SINGLE_USER",
        "/user/:userId/address":    "SINGLE_ADDRESS",
        "/user/:userId/cart": "ALL_CART_ITEMS",
        "/user/:userId/orders": "ALL_USER_ORDERS",
        "/user/:userId/cart/:cartItem": "SINGLE_CART_ITEM",

        /* Store endpoints*/
        "/store/products":  "ALL_PRODUCTS",
        "/store/artists":  "ALL_ARTISTS",
        "/store/artists/:artistId":  "SINGLE_ARTIST",
        "/store/products":  "ALL_PRODUCTS",
        "/store/order":  "POST_ORDER",
        "/store/order/:orderId":  "SINGLE_ORDER"
    }
    
    const intent = req.method // Is the user trying to obtain, create, delete?
    const targetEndpoint = req.baseUrl + req.route.path

    /* Helper functions */
    const isAdmin = (user) => {return user.admin}

    // Defining rules for each different intent on each target endpoint

    switch (resourceMap[targetEndpoint]) {
        case "SINGLE_USER":
        case "SINGLE_ADDRESS":
        case "ALL_CART_ITEMS":
        case "ALL_USER_ORDERS":
        case "SINGLE_CART_ITEM":

            // This rule should apply to: GET, PUT and DELETE, as only the user or an admin are allowed to perform these actions
            // If we ever want to make it so that a user can see another user's page, 
            // this is where we would change that. (e.g. does user allow public profile?) 
            if ((req.params.userId == req.user.id) || (isAdmin(req.user))) {
                return next();
            }

            break;
            
        case "ALL_PRODUCTS":
        case "ALL_ARTISTS":
        case "SINGLE_ARTIST":

            // Only an administrator is allowed to create new products/artists
            if (intent == "POST" || intent == "PUT") {
                if (isAdmin(req.user)) {
                    return next()
                }
            }

            break;

        case "POST_ORDER":
            // Only logged in users can post an order
            if (req.user != null) {
                return next()
            }
            break;

        case "SINGLE_ORDER":
            // Only an admin or the order's user can interact with it
            if (isAdmin(req.user) || await isOrderByUser(parseInt(req.user.id), parseInt(req.params.orderId))) {
                return next()
            }
            break;


        default:
            break;
    }

    // Default behavior: deny all requests
    return res.status(403).send({
        message: "Insufficient permissions for specified resource."
    })
}

export { authorize }