/* User Routes (Prefixed by /user) */

/* Imports */
import express from 'express';
import { defaultErr } from '../lib/helper.js';
import { authenticateToken } from '../lib/authentication.js';
import { getUserById, createOrUpdateAddress, updateAddress, deleteAddress, getCartByUserId, createCartItem, updateCartItem,
deleteCart, deleteCartItem, getOrdersByUserId } from '../lib/persistence.js';
import { authorize } from '../lib/authorization.js';
import { sanitizeUserId, sanitizeAddressAttributes, sanitizeCartItemAttributes, sanitizeCartItemParameters, sanitizeCartItemDeletion } from '../lib/sanitization.js';
import { format } from 'morgan';

/* Router Setup */
const router = express.Router();

/* Account Management Routes */

/* GET /user/:userId (User only) */

router.get('/:userId', authenticateToken("SESSION"), authorize, sanitizeUserId(), (req, res, next) => {
    getUserById(req.params.userId).then((result) => {
        switch (result) {
            case null:
                return res.status(500).send(defaultErr())
            case "NOT_FOUND":
                // This message will only ever fire if an administrator tries to access a non-existing user's information
                return res.status(404).send({
                    message: "User not found."
                })
            default:
                // Sending back the user's information
                return res.status(200).send({
                        id: result.user.id,
                        email: result.user.email,
                        username: result.user.username,
                        address: result.user.Address
                })
        }
    })
})


/* POST /user/:userId/address (User only) */

router.post('/:userId/address', authenticateToken("SESSION"), authorize, sanitizeAddressAttributes(), (req, res, next) => {
    createOrUpdateAddress(
        req.params.userId, 
        req.body.city, 
        req.body.postal_code, 
        req.body.street
    ).then((result) => {
        switch (result) {
            case null:
                return res.status(500).send(defaultErr())
            case "INVALID_USER":
                return res.status(404).send({message: "The provided user ID doesn't match any user"})
            default:
                return res.status(201).send({
                    message: "Address successfully associated to user",
                    userId: result.userId,
                    addressId: result.addressId
                })
        }
    })
})


/* PUT /user/:userId/address (User only) */

router.put('/:userId/address', authenticateToken("SESSION"), authorize, sanitizeAddressAttributes(), (req, res, next) => {
    updateAddress(
        req.params.userId, 
        req.body.city, 
        req.body.postal_code, 
        req.body.street
    ).then((result) => {
        switch (result) {
            case null:
                return res.status(500).send(defaultErr())
            case "INVALID_USER":
                return res.status(404).send({message: "The provided user ID doesn't match any user"})
            case "NO_PREVIOUS_ADDRESS":
                return res.status(404).send({message: "This user does not have an associated address"})
            default:
                return res.status(202).send({
                    message: "Address successfully updated",
                    id: result.updatedAddress.id,
                    city: result.updatedAddress.city,
                    postal_code: result.updatedAddress.postal_code,
                    street: result.updatedAddress.street
                })
        }
    })
})


/* DELETE /user/:userId/address (User only) */

router.delete('/:userId/address', authenticateToken("SESSION"), authorize, sanitizeUserId(), (req, res, next) => {
    deleteAddress(
        req.params.userId
    ).then((result) => {
        switch (result) {
            case null:
                return res.status(500).send(defaultErr())
            case "INVALID_USER":
                return res.status(404).send({message: "The provided user ID doesn't match any user"})
            case "NO_PREVIOUS_ADDRESS":
                return res.status(404).send({message: "This user does not have an associated address"})
            default:
                return res.status(200).send({
                    message: "User address successfully deleted",
                    id: result.id
                })
        }
    })
})


/* Cart Routes */

/* GET /user/:userId/cart */

router.get('/:userId/cart', authenticateToken("SESSION"), authorize, sanitizeUserId(), (req, res, next) => {
    getCartByUserId(req.params.userId).then((result) => {
        switch (result) {
            case null:
                return res.status(500).send(defaultErr())
            case "NOT_FOUND":
                // This message will only ever fire if an administrator tries to access a non-existing user's information
                return res.status(404).send({
                    message: "User not found."
                })
            default:
                // Sending back the user's information
                return res.status(200).send({
                        cart: result.cart,
                        totalPrice: result.totalPrice
                })
        }
    })
})


/* POST /user/:userId/cart */

router.post('/:userId/cart', authenticateToken("SESSION"), authorize, sanitizeCartItemAttributes(), (req, res, next) => {
    createCartItem(
        req.params.userId, 
        req.body.productId,
        req.body.quantity
    ).then((result) => {
        switch (result) {
            case null:
                return res.status(500).send(defaultErr())
            case "INVALID_USER":
                return res.status(404).send({message: "The provided user ID doesn't match any user"})
            case "INVALID_PRODUCT":
                return res.status(404).send({message: "The provided product ID doesn't match any product."})
            case "CART_ITEM_EXISTS":
                return res.status(409).send({message: "The provided product ID already matches an item in the user's cart."})
            case "PRODUCT UNAVAILABLE":
                return res.status(403).send({message: "The product requested is not yet released to the public."})
            default:
                return res.status(201).send({
                    message: "Product successfully added to cart",
                    cartItemId: result.newCartItem.id,
                    productId: result.newCartItem.product_id,
                    quantity: result.newCartItem.quantity
                })
        }
    })
})


/* PUT /user/:userId/cart/:cartItem */

router.put('/:userId/cart/:cartItem', authenticateToken("SESSION"), authorize, sanitizeCartItemParameters(), (req, res, next) => {
    updateCartItem(
        req.params.userId, 
        req.params.cartItem,
        req.body.quantity
    ).then((result) => {
        switch (result) {
            case null:
                return res.status(500).send(defaultErr())
            case "INVALID_USER":
                return res.status(404).send({message: "The provided user ID doesn't match any user"})
            case "INVALID_ITEM":
                return res.status(404).send({message: "The provided item ID doesn't match any product on the user's cart."})
            default:
                return res.status(200).send({
                    message: "Product successfully updated on cart",
                    cartItemId: result.updatedCartItem.id,
                    productId: result.updatedCartItem.product_id,
                    quantity: result.updatedCartItem.quantity
                })
        }
    })
})


/* DELETE /user/:userId/cart */

router.delete('/:userId/cart', authenticateToken("SESSION"), authorize, sanitizeUserId(), (req, res, next) => {
    deleteCart(
        req.params.userId
    ).then((result) => {
        switch (result) {
            case null:
                return res.status(500).send(defaultErr())
            case "INVALID_USER":
                return res.status(404).send({message: "The provided user ID doesn't match any user"})
            default:
                return res.status(200).send({
                    message: "Cart successfully cleared",
                    result
                })
        }
    })
})


/* DELETE /user/:userId/cart/:cartItem */

router.delete('/:userId/cart/:cartItem', authenticateToken("SESSION"), authorize, sanitizeCartItemDeletion(), (req, res, next) => {
    deleteCartItem(
        req.params.userId,
        req.params.cartItem
    ).then((result) => {
        switch (result) {
            case null:
                return res.status(500).send(defaultErr())
            case "INVALID_USER":
                return res.status(404).send({message: "The provided user ID doesn't match any user"})
            case "INVALID_CART_ITEM":
                return res.status(404).send({message: "The provided cart item ID doesn't match any item on the user's cart"})
            default:
                return res.status(200).send({
                    message: "Cart item successfully cleared",
                    cart:result.cart
                })
        }
    })
})


/* Order Routes */

/* GET /user/:userId/orders */

router.get('/:userId/orders', authenticateToken("SESSION"), authorize, sanitizeUserId(), (req, res, next) => {
    getOrdersByUserId(req.params.userId).then((result) => {
        switch (result) {
            case null:
                return res.status(500).send(defaultErr())
            case "NOT_FOUND":
                // This message will only ever fire if an administrator tries to access a non-existing user's information
                return res.status(404).send({
                    message: "User not found."
                })
            default:
                // Sending back the user's information
                return res.status(200).send({ 
                    result
                })
        }
    })
})

export { router as default }