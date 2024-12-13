/* Persistence Library */

import { PrismaClient, Prisma } from '@prisma/client';
import { hashSync as hash, compareSync as compare } from 'bcrypt';
import yargs from 'yargs';
import { report, round } from './helper.js'
import { genOTP, genOTPKey, genPairingURL} from './otp.js'

/**
 * Disclaimer: Functions within this file which expect any input data assume it to have been sanitized 
 * by the appropriate middleware, which is run the router-level.
 * 
 * Additionally, the return types may be confusing for some functions, but status flags are a super 
 * handy way of conveying context to the routing level above the persistence-layer. This way, everything's
 * neatly organized and this layer never has to deal with nasty stuff like error messages and status codes :).
 */

/* Parsing Arguments */
const argv = yargs().parse(process.argv)

/* Constants */
const SALT_ROUNDS = 10;
const VALIDATION_TOKEN_LENGTH = 20;
const TOP_N = 5; // For finding top N fans of an artist

/* Initializing Prisma */
const prisma = new PrismaClient({
    // Log database operations if -m flag is present
    log: argv.m || argv.databaseMonitoring ? ['query', 'info', 'warn', 'error'] : []
});

// Checking database connectivity
prisma.$connect().catch((reason) => {
    console.log("📶 Database connection failed.")
    process.exit(1)
})


/* User Management Functions */



/**
 * Allows obtaining the user's information through e-mail
 * @param {string} email The user's e-mail
 * @returns User object according to Prisma model, null if it doesn't exist
 */
async function getUserByEmail(email) {
    try {
        let user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        return user

    } catch (e) {
        report(e)
        return null
    }
}

/**
 * Allows obtaining the user's information through ID
 * @param {int} id The user's ID
 * @returns User object according to Prisma model, null if it doesn't exist
 */
async function getUserById(id) {
    try {
        let user = await prisma.user.findUnique({
            where: {
                id: id
            },
            include: {
                Address: {
                    select: {
                        city: true,
                        postal_code: true,
                        street: true
                    }
                }
            }
        })  

        if (!user) {
            return "NOT_FOUND"
        }

        return {user}

    } catch (e) {
        report(e)
        return null
    }
}


/**
 * Allows obtaining an address' details through the address' ID
 * @param {int} id The address' ID
 * @returns Address object according to Prisma model if successful, null if it doesn't exist
 */
async function getAddressById(id) {
    try {
        let address = await prisma.address.findUnique({
            where: {
                id: id
            }
        })  

        if (!address) {
            return "NOT_FOUND"
        }

        return {address}

    } catch (e) {
        report(e)
        return null
    }
}


/**
 * Allows obtaining an address' details through the user's ID
 * @param {int} user_id The user's ID
 * @returns Address object according to Prisma model, null if it doesn't exist
 */ /*
async function getAddressByUser(user_id) {
    try {
        let address = await prisma.address.findUnique({
            where: {
                user_id: user_id
            }
        })  

        if (!address) {
            return "NOT_FOUND"
        }

        return {address}

    } catch (e) {
        report(e)
        return null
    }
}

/**
 * Allows obtaining an address' details through the address' and user's ID
 * @param {int} address_id The address' id
 * @param {int} user_id The user's ID
 * @returns Address object according to Prisma model, null if it doesn't exist
 *//*
async function getAddressByUser(address_id, user_id) {
    try {
        let address = await prisma.address.findUnique({
            where: {
                id: address_id,
                user_id: user_id
            }
        })  

        if (!address) {
            return "NOT_FOUND"
        }

        return {address}

    } catch (e) {
        report(e)
        return null
    }
}
*/
/**
 * Validates the user's credentials. 
 * @param {string} email 
 * @param {string} password 
 * @returns A status flag if the credentials are invalid, or 
 * an object containing the user's OTP status if they are 
 * valid (enrolled/not enrolled).
 * 
 * Status flags:
 * - INVALID_EMAIL: The provided e-mail is not recognized
 * - INVALID_CREDENTIALS: The provided password is incorrect
 */
async function validateUserCredentials(email, password) {
    try {
        let userExists = await prisma.user.count({
            where: {
                email: email
            }
        }) > 0

        if (!userExists) {
            return "INVALID_EMAIL"
        }

        let user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        let passwordMatch = compare(
            password,
            user.password
        )

        if (!passwordMatch) {
            return "INVALID_CREDENTIALS"
        }

        return {OTPEnrolled: user.otp_enrolled}

    } catch (e) {
        report(e)
        return null
    }
}

/**
 * Allows creating a new user
 * @param {string} name - Provided name 
 * @param {string} email - Provided email
 * @param {string} username - Provided username
 * @param {string} password - Provided password
 * @returns The user's ID if the operation was successful, status flags in case something goes wrong.
 * 
 * Status flags:
 * - EMAIL_IN_USE: The provided email is already in use
 * - USERNAME_IN_USE: The provided username is already in use
 */
async function createUser(
    name,
    email,
    username,
    password
) {
    try {
        // Validating that unique fields don't yet exist
        let emailExists = await prisma.user.count({
            where: {
                email: email
            }
        })

        if (emailExists) {
            return "EMAIL_IN_USE"
        }

        let usernameExists = await prisma.user.count({
            where: {
                username: username
            }
        }) > 0

        if (usernameExists) {
            return "USERNAME_IN_USE"
        }

        // Creating user if all goes well
        let newUser = await prisma.user.create({
            data: {
                name: name,
                username: username,
                email: email,
                password: hash(password, SALT_ROUNDS)
            }
        })

        return newUser.id

    } catch (e) {
        report(e)
        return null
    }
}


/**
 * Allows creating a new address
 * @param {int} user_id - Provided user's id 
 * @param {string} city - Provided city
 * @param {string} postal_code - Provided postal code
 * @param {string} street - Provided street
 * @returns The address' and respective user's ID if the operation was successful, status flags in case something goes wrong.
 * 
 * Status flags:
 * - INVALID_USER: The provided user_id does not correspond to a pre-existing user
 * - USER_ID_IN_USE: The provided user_id already has an associated address 
 */
async function createOrUpdateAddress(
    user_id,
    city,
    postal_code,
    street
) {
    try {

        // Validating that foreign key fields already exist 
        let userExists = await prisma.user.count({
            where: {
                id:user_id
            }
        }) > 0

        if (!userExists) {
            return "INVALID_USER"
        }

        // Creating or updating address if all goes well

        let newAddress = await prisma.address.upsert({
            where: {
                user_id:user_id,
            },
            update: {
                city: city,
                postal_code: postal_code,
                street: street,
            },
            create: {
                user_id: user_id,
                city: city,
                postal_code: postal_code,
                street: street,
            },
        })

        return {
            userId: newAddress.user_id,
            addressId: newAddress.id
        }

    } catch (e) {
        report(e)
        return null
    }
}


/**
 * Allows for updating a user's address
 * @param {int} user_id - Provided user's id
 * @param {string} city - Provided city
 * @param {string} postal_code - Provided postal code
 * @param {string} street - Provided street
 * @returns The address' and respective user's ID if the operation was successful, status flags in case something goes wrong.
 * 
 * Status flags:
 * - INVALID_USER - Provided user_id does not exist
 * - NO_PREVIOUS_ADDRESS - User does not have an address to update
 */
async function updateAddress(
    user_id,
    city,
    postal_code,
    street
) {
    try {

        // Validating that foreign key fields already exist 
        
        let userExists = await prisma.user.count({
            where: {
                id: user_id
            }
        }) > 0

        if (!userExists) {
            return "INVALID_USER"
        }

        // Validating that address to update already exists 
        
        let userAddressExists = await prisma.address.count({
            where: {
                user_id:user_id
            }
        }) > 0

        if (!userAddressExists) {
            return "NO_PREVIOUS_ADDRESS"
        }

        // Updating address if all goes well

        let updatedAddress = await prisma.address.update({
            where: {
                user_id:user_id
            },
            data: {
                city: city,
                postal_code: postal_code,
                street: street
            }
        })

        return { updatedAddress }

    } catch (e) {
        report(e)
        return null
    }
}

/**
 * Allows for deleting a user's address
 * @param {int} user_id - Provided user's id
 * @returns The address' and respective user's ID if the operation was successful, status flags in case something goes wrong.
 * 
 * Status flags:
 * - INVALID_USER - Provided user_id does not exist
 * - NO_PREVIOUS_ADDRESS - User does not have an address to delete
 */
async function deleteAddress(
    user_id
) {
    try {

        // Validating that foreign key fields already exist 
        
        let userExists = await prisma.user.count({
            where: {
                id: user_id
            }
        }) > 0

        if (!userExists) {
            return "INVALID_USER"
        }

        // Validating that address to delete already exists
        
        let userAddressExists = await prisma.address.count({
            where: {
                user_id:user_id
            }
        }) > 0

        if (!userAddressExists) {
            return "NO_PREVIOUS_ADDRESS"
        }

        // Deleting address if all goes well

        let deletedAddress = await prisma.address.delete({
            where: {
                user_id:user_id
            }
        })

        return { deletedAddress }

    } catch (e) {
        report(e)
        return null
    }
}


/* Cart Functions */

/**
 * Allows obtaining the user cart items' information through ID
 * @param {int} id The user's ID
 * @returns set of CartItem objects, status flags if user doesn't exist
 * Status flags:
 * - NOT_FOUND - Provided user_id does not exist
 * 
 */
async function getCartByUserId(id) {
    try {
        let user = await prisma.user.count({
            where: {
                id: id
            }
        }) > 0

        if (!user) {
            return "NOT_FOUND"
        }

        let cart = await prisma.cartItem.findMany({
            where: {
                user_id: id
            },
            orderBy: { 
                id: "desc",
            },
            select: {
                id: true,
                product_id: true,
                quantity: true,
                Product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        brand: true,
                        description: true
                    }
                }
            }
        })  

        let totalPrice = round (
            cart.reduce(( sum, cartItem ) => 
            sum + Number(cartItem.Product.price), 0
        ) , 2)

        return {cart, totalPrice }

    } catch (e) {
        report(e)
        return null
    }
}


/**
 * Allows creating a new cart item
 * @param {int} user_id - Provided user's id 
 * @param {int} product_id - Provided product's id
 * @param {int} quantity - Provided product quantity
 * @returns The CartItem's attributes, status flags in case something goes wrong.
 * 
 * Status flags:
 * - INVALID_USER: The provided user_id does not correspond to a pre-existing user
 * - INVALID_PRODUCT: The provided product_id does not correspond to a pre-existing product 
 * - CART_ITEM_EXISTS: The provided product_id corresponds to a product already in user's cart
 * - PRODUCT_UNAVAILABLE: Client cannot yet order this product
 */
async function createCartItem(
    user_id,
    product_id,
    quantity
) {
    try {

        // Validating that foreign key fields already exist 
        let userExists = await prisma.user.count({
            where: {
                id: user_id
            }
        }) > 0

        if (!userExists) {
            return "INVALID_USER"
        }

        let productExists = await prisma.product.count({
            where: {
                id: product_id
            }
        }) > 0

        if (!productExists) {
            return "INVALID_PRODUCT"
        }
        
        let cartItemExists = await prisma.cartItem.count({
            where: {
                user_id: user_id,
                product_id: product_id,
            }
        }) > 0

        if (cartItemExists) {
            return "CART_ITEM_EXISTS"
        }

        let launchDate = await prisma.product.findUnique({
            where: {
                id:product_id
            },
            select: {
                launch_date:true
            }
        }) 

        let artistIds = await prisma.artistItem.findMany({
            where: {
                product_id: product_id
            },
            select: {
                artist_id:true
            }
        }) 
        
        let launchTime = launchDate.launch_date
        let todayTime = new Date()

        let isBefore = todayTime < launchDate.launch_date 
        
        launchTime.setDate(launchTime.getDate() + 1)
        
        let isOneDayPast = launchTime < todayTime
        let canAdd = false

        if (isBefore) {
            canAdd = false
        }
        else if (isOneDayPast) {
            canAdd = true 
        }
        else {
            for (let artistId of artistIds) {
                let _artistId = artistId.artist_id
                let isTopFan = await isInArtistScoreboard(user_id, _artistId)
                if (isTopFan) {
                    canAdd = true
                    break
                }
            }
        }

        if (!canAdd) {
            return "PRODUCT UNAVAILABLE"
        } 

        // Creating cartItem if all goes well

        let newCartItem = await prisma.cartItem.create({
            data: {
                user_id: user_id,
                product_id: product_id,
                quantity: quantity
            }
        })

        return { newCartItem }

    } catch (e) {
        report(e)
        return null
    }
}


/**
 * Allows for updating a user's cart item
 * @param {int} user_id - Provided user's id
 * @param {int} product_id - Provided product's id
 * @param {int} quantity - New quantity postal code
 * @returns The CartItem's attributes if successful, status flags in case something goes wrong.
 * 
 * Status flags:
 * - INVALID_USER - Provided user_id does not exist
 * - INVALID_PRODUCT - Provided product_id does not exist in this cart
 */
async function updateCartItem(
    user_id,
    cart_item_id,
    quantity
) {
    try {

        // Validating that foreign key fields already exist 
        
        let userExists = await prisma.user.count({
            where: {
                id: user_id
            }
        }) > 0

        if (!userExists) {
            return "INVALID_USER"
        }

        // Validating that product to update already exists in cart
        
        let cartItemExists = await prisma.cartItem.count({
            where: {
                id: cart_item_id,
                user_id: user_id
            }
        }) > 0

        if (!cartItemExists) {
            return "INVALID_ITEM"
        }

        // Updating cart item if all goes well

        let updatedCartItem = await prisma.cartItem.update({
            where: {
                id: cart_item_id
            },
            data: {
                quantity: quantity
            }
        })

        return { updatedCartItem }

    } catch (e) {
        report(e)
        return null
    }
}


/**
 * Allows for clearing a user's cart
 * @param {int} user_id - Provided user's id
 * @returns The respective user's IDs if the operation was successful, status flags in case something goes wrong.
 * 
 * Status flags:
 * - INVALID_USER - Provided user_id does not exist
 */
async function deleteCart(
    user_id
) {
    try {

        // Validating that foreign key fields already exist 
        
        let userExists = await prisma.user.count({
            where: {
                id: user_id
            }
        }) > 0

        if (!userExists) {
            return "INVALID_USER"
        }

        // Deleting all of this user's cart items if all goes well

        let nrdeletedItems = await prisma.cartItem.deleteMany({
            where: {
                user_id: user_id
            }
        })

        return { count: nrdeletedItems.count } 

    } catch (e) {
        report(e)
        return null
    }
}


/**
 * Allows for clearing a user's cart of a single item
 * @param {int} user_id - Provided user's id
 * @param {int} cart_item_id - Provided user's cart item id
 * @returns The deleted Cart Item object if the operation was successful, status flags in case something goes wrong.
 * 
 * Status flags:
 * - INVALID_USER - Provided user_id does not exist
 * - INVALID_CART_ITEM - Provided cart_item_id does not exist for this user
 */
async function deleteCartItem(
    user_id,
    cart_item_id
) {
    try {

        // Validating that foreign key fields already exist 
        
        let userExists = await prisma.user.count({
            where: {
                id: user_id
            }
        }) > 0

        if (!userExists) {
            return "INVALID_USER"
        }


        let cartItemExists = await prisma.cartItem.count({
            where: {
                id:cart_item_id,
                user_id:user_id
            }
        }) > 0

        if (!cartItemExists) {
            return "INVALID_CART_ITEM"
        }

        // Deleting user's cart item if all goes well

        let deletedItem = await prisma.cartItem.delete({
            where: {
                id: cart_item_id
            }
        })

        return { deletedItem } 

    } catch (e) {
        report(e)
        return null
    }
}



/* OTP Functions */

/**
 * Allows generating a new OTP secret for a user, and associates it to the user's account.
 * @param {string} email The e-mail belonging to the user for which a new OTP secret will be generated
 * @returns A pairing URL, defined according to RFC 6238, or a status flag if the operation fails.
 * The pairing URL will always include the following information:
 * - The user's e-mail
 * - The user's OTP secret
 * - The issuer (MusicMarkt)
 * - The account name (the user's username)
 * - The HMAC algorithm used (SHA1 default)
 * - The number of digits used (6 default)
 * - The time step (30 default)
 * 
 * Status flags:
 * - OTP_ALREADY_ENROLLED: The user has already enrolled in OTP but tries to enroll again
 * 
 * @description The pairing URL will be used by the client to generate a QR code, which allows it to be scanned by
 * an OTP authenticator app. The app will then generate a new OTP token every 30 seconds, which will be used to
 * authenticate the user. This function will not flip the user's otp_enrolled flag  to true, as it is assumed that the user
 * will only be able to use the OTP token after scanning the QR code, and thus that can only be done after the user
 * has been authenticated for the first time.
 */
async function enrollOTP(email) {
    try {
        let user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (user.otp_enrolled) {
            return "OTP_ALREADY_ENROLLED"
        }

        // Generating an OTP secret only once
        if (user.otp_key) {
            return {pairingURL: genPairingURL(
                user.email,
                user.otp_key)}
        } 

        let key = genOTPKey()

        // Updating user's OTP key
        await prisma.user.update({
            where: {
                email: user.email
            },
            data: {
                otp_key: key,
            }
        })

        return {pairingURL: genPairingURL(user.email, key)}

    } catch (e) {
        report(e)
        return null
    }

}

/**
 * 
 * @param {string} email The user for which the OTP token will be validated
 * @param {string} providedOTP The OTP token provided by the user
 * @returns True if the token is valid, a status flag otherwise:
 * - "OTP_NOT_ENROLLED": If the user has not enrolled in OTP yet but tries to validate a token
 * - "INVALID_CODE": If the token is invalid
 */
async function validateOTP(email, providedOTP) {
    try {
        
        let user = await getUserByEmail(email)

        // If the user has no key, they haven't enrolled yet. 
        // We don't look at the otp_enrolled flag as it could be the first validation (which completes enrollment).
        if (!user.otp_key) {
            return "OTP_NOT_ENROLLED"
        }

        let validOTPs = genOTP(user.otp_key)
        
        if (!validOTPs.includes(providedOTP)) {
            return "INVALID_CODE"
        }

        // If it's the first successful validation, update the user's flag
        if (!user.otp_enrolled) {
            await prisma.user.update({
                where: {
                    email
                },
                data: {
                    otp_enrolled: true
                }
            })
        }

        return true

    } catch (e) {
        report(e)
        return null
    }
}

/* Product Functions */

async function getProducts(artist, sort) {
    try {

        // Mapping sorting methods to respective database action
        let sortingMethod = {}

        // Initializing an object which includes all filters, 
        // so that it's easy enough to add more filters in the future
        // without having to repeat the query.
        let filter = {}

        switch (sort) {
            case "newest":
                sortingMethod.id = "desc"
                break;
            case "oldest":
                sortingMethod.id = "asc"
                break;
            case "name_asc":
                sortingMethod.name = "asc"
                break;
            case "name_desc":
                sortingMethod.name = "desc"
                break;
            case "price_asc":
                sortingMethod.price = "asc"
                break;
            case "price_desc":
                sortingMethod.price = "desc"
        }

        if (artist) {
            filter.ArtistItem = {
                some: {
                    artist_id: artist
                }
            }
        }

        let products = await prisma.product.findMany({
            where: filter,
            orderBy: sortingMethod
        })

        return products

    } catch (e) {
        report(e)
        return null
    }
}

async function getProductById(id) {
    try {
        
        let product = await prisma.product.findUnique({
            where: {
                id: id
            },
            include: {
                ProductAttribute: {
                    select: {
                        id: true,
                        key: true,
                        value: true
                    }
                },
                ArtistItem: {
                    select: {
                        Artist: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        })

        if (!product) {
            return "NOT_FOUND"
        }

        // Masking internal DB structure by renaming internal properties
        delete Object.assign(product, {["attributes"]: product["ProductAttribute"] })["ProductAttribute"];

        product.artist = null

        if (product.ArtistItem.length > 0) {
            product.artist = {
                id: product.ArtistItem[0].Artist.id,
                name: product.ArtistItem[0].Artist.name
            }   
        }

        delete product.ArtistItem

        return product

    } catch (e) {
        report(e)
        return null
    }
}

async function createProduct(
    price, 
    type, 
    name, 
    description, 
    brand, 
    launchDate,
    artistId) {
        try {  
            
            let attributes = {
                price: price,
                type: type,
                name: name,
                description: description,
                brand: brand,
                launch_date: new Date(launchDate)
            }

            let productNameExists = await prisma.product.findUnique({
                where: {
                    name: name
                }
            })

            if (productNameExists) {
                return "PRODUCT_NAME_EXISTS"
            }

            if (artistId) {
                let artist = await prisma.artist.findUnique({
                    where: {
                        id: artistId
                    }
                })

                if (!artist) {
                    return "INVALID_ARTIST"
                }

                attributes.ArtistItem = {
                    create: {
                        artist_id: artistId
                    }
                }
            }

            let newProduct = await prisma.product.create({
                data: attributes
            })

            return {
                productId: newProduct.id
            }


        } catch (e) {
            report(e)
            return null
        }

}


/* Artist Functions */


async function getArtists(sort) {
    try {

        // Mapping sorting methods to respective database action
        let sortingMethod = {}

        // Initializing an object which includes all filters, 
        // so that it's easy enough to add more filters in the future
        // without having to repeat the query.
        let filter = {}

        switch (sort) {
            case "newest":
                sortingMethod.id = "desc"
                break;
            case "oldest":
                sortingMethod.id = "asc"
                break;
            case "name_asc":
                sortingMethod.name = "asc"
                break;
            case "name_desc":
                sortingMethod.name = "desc"
                break;
            default:
                sortingMethod.name = "desc"
        }

        let artists = await prisma.artist.findMany({
            orderBy: sortingMethod
        })

        return artists

    } catch (e) {
        report(e)
        return null
    }
}


async function getArtistById(id) {
    try {
        
        let artist = await prisma.artist.findUnique({
            where: {
                id: id
            },
            include: {
                ArtistItem: {
                    select: {
                        Product: {
                            select: {
                                id: true,
                                name: true,
                                launch_date: true,
                                price: true
                            }
                        }
                    }
                }
            }
        })

        if (!artist) {
            return "NOT_FOUND"
        }

        // Masking internal DB structure by renaming internal properties
        delete Object.assign(artist, {["products"]: artist["ArtistItem"] })["ArtistItem"];

        return artist

    } catch (e) {
        report(e)
        return null
    }
}


async function createArtist(
    name, 
    description, 
    type, 
    genre) {
        try {  

            let artistNameExists = await prisma.artist.findUnique({
                where: {
                    name: name
                }
            })

            if (artistNameExists) {
                return "NAME_IN_USE"
            }

            let newArtist = await prisma.artist.create({
                data: {
                    name: name,
                    description: description,
                    type: type,
                    genre: genre
                }
            })

            return {
                artistId: newArtist.id
            }


        } catch (e) {
            report(e)
            return null
        }

}



async function isInArtistScoreboard(user_id, artist_id) {
    try {

        let topNFans = await getArtistScoreboard(artist_id)

        let isTopFan = false

        for (let fan of topNFans) {
            if (fan.user.id == user_id) {
                isTopFan = true
                break
            }
        }

        return isTopFan 

    } catch (e) {
        report(e)
        return null
    }
}


async function getArtistScoreboard(artist_id) {
    try {

        let amountSpentPerUser = await getAmountSpentPerUser(artist_id)
        
        let topNFans = amountSpentPerUser.slice(0, Math.min(amountSpentPerUser.length, TOP_N))
        
        return topNFans

    } catch (e) {
        report(e)
        return null
    }
}


async function getAmountSpentPerUser(artist_id) {

    let artistId = artist_id

    let artistProductsSold = await prisma.product.findMany({
        where: {
            ArtistItem: {
                every: {
                    artist_id: artistId
                }
            }
        },
        select: {
            id: true,
            price: true
        }
    })

    let users = await prisma.user.findMany({
        select: {
            id:true,
            name:true,
            username:true
        }
    })

    let amountSpentPerUser = await Promise.all(users.map(async (user) => {
        
        let userOrderItems = await prisma.orderItem.findMany({
            where: {
                Order: {
                    user_id: user.id
                }
            },
        })

        let userOrderItemsRelatedToArtist = userOrderItems.filter((item) => artistProductsSold.find(product => {return product.id == item.product_id}))

        let userOrderedProductsRelatedToArtist = userOrderItemsRelatedToArtist.map((orderItem) => {return {
            product: artistProductsSold.find((product) => {return product.id == orderItem.product_id}),
            quantity: orderItem.quantity}})
        
        let amountSpent = userOrderedProductsRelatedToArtist.reduce((accumulator, current) => {
            return accumulator + (Number(current.product.price) * current.quantity)}, 0)

        return {
            "user": user,
            "amountSpent": round(amountSpent, 2)
        }
    }))

    amountSpentPerUser = amountSpentPerUser.sort((a, b) => b.amountSpent - a.amountSpent)

    return amountSpentPerUser

}





/* Order Functions */

async function isOrderByUser(user_id, order_id) {
    try {

        let order = await prisma.order.findUnique({
            where: {
                id: order_id
            }
        })

        return order.user_id==user_id

    } catch (e) {
        report(e)
        return null
    }
}

async function getOrdersByUserId(user_id) {
    try {

        let orders = await prisma.order.findMany({
            where: {
                user_id: user_id
            }, 
            select: {
                id: true,
                date_ordered: true
            }
        })  

        return orders

    } catch (e) {
        report(e)
        return null
    }
}

async function getOrderById(order_id) {
    try {

        let order = await prisma.order.findUnique({
            where: {
                id: order_id
            }, 
            select: {
                id: true,
                date_ordered: true,
                OrderItem: {
                    select: {
                        product_id: true,
                        quantity: true
                    }
                }
            }
        })  

        if (!order) {
            return "NOT_FOUND"
        }

        return order

    } catch (e) {
        report(e)
        return null
    }
}

/*
 * Turns CartItems into OrderItems and clears cart
 */
async function createOrder(user_id) {
    try {
        let user = await prisma.user.count({
            where: {
                id: user_id
            }
        }) > 0

        if (!user) {
            return "NOT_FOUND"
        }

        /* Create order */
        let newOrder = await prisma.order.create({
            data: {
                user_id: user_id,
                date_ordered: new Date()
            }
        })

        /* Retrieve cart items */
        let cartItems = await prisma.cartItem.findMany({
            where: {
                user_id: user_id
            }
        })

        /* Turn cart items into order items */
        for (let item of cartItems) {
            await prisma.orderItem.create({
                data: {
                    quantity: item.quantity,
                    product_id: item.product_id,
                    order_id: newOrder.id
                }
            })
        }

        /* Clear cart */

        let deletedCartItems = await prisma.cartItem.deleteMany({})

        return {newOrder}

    } catch (e) {
        report(e)
        return null
    }
}




export { 
    createUser,
    createOrUpdateAddress,
    updateAddress,
    deleteAddress,
    validateUserCredentials,
    getUserByEmail,
    getUserById,
    getAddressById,
    getCartByUserId,
    createCartItem,
    updateCartItem,
    deleteCart,
    deleteCartItem,
    enrollOTP,
    validateOTP,
    getProducts,
    getProductById,
    createProduct,
    getArtists,
    getArtistById,
    createArtist,
    getOrderById,
    getOrdersByUserId,
    createOrder,
    isOrderByUser,
    getArtistScoreboard,
    isInArtistScoreboard,
    getAmountSpentPerUser
}

