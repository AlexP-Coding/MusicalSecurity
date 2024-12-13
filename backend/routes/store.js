/* Store Routes (Prefixed by /store) */

/* Imports */
import express from 'express';
import { defaultErr } from '../lib/helper.js'
import { authenticateToken } from '../lib/authentication.js';
import { authorize } from '../lib/authorization.js';
import { getProductById, getProducts, createProduct, getArtists, getArtistById, getArtistScoreboard, createArtist, getOrderById, createOrder } from '../lib/persistence.js';
import { sanitizeProductId, sanitizeProductParameters, sanitizeProductAttributes, sanitizeArtistParameters, sanitizeArtistId, sanitizeArtistAttributes, sanitizeOrderId } from '../lib/sanitization.js';


/* Router Setup */
const router = express.Router();

/* Product Routes */

/* GET /store/products */

router.get('/products', sanitizeProductParameters(), (req, res, next) => {
    getProducts(
        req.query.artist,
        req.query.sort
    ).then((result) => {
        switch (result) {
            case null:
                return res.status(500).send(defaultErr())
            default:
                return res.status(200).send(result)
        }
    })
})

/* GET /store/products/:productId */

router.get('/products/:productId', sanitizeProductId(), (req, res, next) => {
    getProductById(req.params.productId).then((result) => {
        switch (result) {
            case null:
                return res.status(500).send(defaultErr())
            case "NOT_FOUND":
                return res.status(404).send({message: "No product found with the provided identifier."})                
            default:
                return res.status(200).send(result)
        }
    })
})

/* POST /store/products */

router.post('/products', authenticateToken("SESSION"), authorize, sanitizeProductAttributes(), (req, res, next) => {
    createProduct(
        req.body.price,
        req.body.type,
        req.body.name,
        req.body.description,
        req.body.brand,
        req.body.launchDate,
        req.body.artistId
    ).then((result) => {
        switch (result) {
            case null:
                return res.status(500).send(defaultErr())
            case "INVALID_ARTIST":
                return res.status(404).send({message: "The provided artist ID doesn't match any artist."})     
            case "PRODUCT_NAME_EXISTS":
                return res.status(409).send({message: "There's already a product with the provided product name."})         
            default:
                return res.status(201).send({
                    message: "Product successfully created.",
                    productId: result.productId
                })
        }
    })
})


/* Artist Routes */

/* GET /store/artists */

router.get('/artists', sanitizeArtistParameters(), (req, res, next) => {
    getArtists(
        req.query.sort
    ).then((result) => {
        switch (result) {
            case null:
                return res.status(500).send(defaultErr())
            default:
                return res.status(200).send(result)
        }
    })
})


/* GET /store/artists/:artistId */

router.get('/artists/:artistId', sanitizeArtistId(), (req, res, next) => {
    getArtistById(req.params.artistId).then((result) => {
        switch (result) {
            case null:
                return res.status(500).send(defaultErr())
            case "NOT_FOUND":
                return res.status(404).send({message: "No artist found with the provided identifier."})                
            default:
                return res.status(200).send(result)
        }
    })
})


/* POST /store/artists */

router.post('/artists', authenticateToken("SESSION"), authorize, sanitizeArtistAttributes(), (req, res, next) => {
    createArtist(
        req.body.name,
        req.body.description,
        req.body.type,
        req.body.genre
    ).then((result) => {
        switch (result) {
            case null:
                return res.status(500).send(defaultErr())
            case "NAME_IN_USE":
                return res.status(409).send({message: "The provided artist name is already in use."})     
            default:
                return res.status(201).send({
                    message: "Artist profile successfully created.",
                    result
                })
        }
    })
})


/* Scoreboard Routes */

/* GET /store/artists/:artistId/scoreboard */

router.get('/artists/:artistId/scoreboard', sanitizeArtistId(), (req, res, next) => {
    getArtistScoreboard(req.params.artistId).then((result) => {
        switch (result) {
            case null:
                return res.status(500).send(defaultErr())
            case "NOT_FOUND":
                return res.status(404).send({message: "No artist found with the provided identifier."})                
            default:
                return res.status(200).send(result)
        }
    })
})


/* Order Routes */

/* GET /store/order/:orderId */
router.get('/order/:orderId', authenticateToken("SESSION"), authorize, sanitizeOrderId(), (req, res, next) => {
    getOrderById(req.params.orderId).then((result) => {
        switch (result) {
            case null:
                return res.status(500).send(defaultErr())
            case "NOT_FOUND":
                return res.status(404).send({message: "No order found with this identifier."})                
            default:
                return res.status(200).send(result)
        }
    })
})

/* POST /store/order */

router.post('/order', authenticateToken("SESSION"), authorize, (req, res, next) => {
    createOrder(
        req.user.id
    ).then((result) => {
        switch (result) {
            case null:
                return res.status(500).send(defaultErr())
            case "NOT_FOUND":
                return res.status(404).send({message: "User not found."})     
            default:
                return res.status(201).send({
                    message: "Order successfully created.",
                    result
                })
        }
    })
})


export { router as default }