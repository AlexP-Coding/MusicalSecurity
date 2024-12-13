# 📖 API Documentation
## Notes
- Routes with a 🔒 emoji require authentication in the form of an HTTP Bearer token.
    - Whenever authentication fails, the API will return (401)
        
        ```jsx
        {
        	"message": "Access unauthorized."
        }
        ```
        
- Routes with the 🚨 emoji may have variations which are only available to administrators.
    - Whenever a request fails because of permission errors, the API will return (403)
        
        ```jsx
        {
        	"message": "Insufficient permissions for specified resource."
        }
        ```
        
- Some routes might not mention it, but you should keep in mind that ANY route that requires input data (be it in the form of query/URL parameters or request body) will return a status code of 400 and an array of errors if the input isn’t composed correctly.
    
    ```jsx
    {
    	"errors": [
    		{
    			"value": 2,
    			"msg": "Invalid value",
    			"param": "type",
    			"location": "body"
    		},
    		{
    			"value": 2,
    			"msg": "Invalid value",
    			"param": "name",
    			"location": "body"
    		}
    ]
    }
    ```
    

## Authentication Routes

- `POST /auth/login`
    - Accepts
        
        ```jsx
        {
        	"email":"h@mail.com",
        	"password":"H_12345678"
        }
        ```
        
    - Returns
        - Success (200)
            
            ```jsx
            {
            	"message": "Successfully logged in. Proceed to OTP validation (/auth/otp/validate).",
            	"validationToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJAbWFpbC5jb20iLCJtb2RlIjoiVkFMSURBVElPTiIsImlhdCI6MTY3MjQ5NDE1OSwiZXhwIjoxNjcyNDk0MzM5fQ.G2MBEtmnp3FHvtnXSG-Jrw4nSblRGq4VL8nhyWKaRVE",
            	"OTPEnrolled": true
            }
            ```
            
        - Invalid credentials (401)
            
            ```jsx
            {
            	"message": "Invalid credentials."
            }
            ```
            
        - Invalid e-mail (401)
            
            ```jsx
            	{
            	"message": "E-mail not recognized."
            }
            ```
            
- `POST /auth/register`
    - Accepts
        
        ```jsx
        {
        	"email":"b@gmail.com",
        	"name":"aaaaaaaa2aaaaa",
        	"password":"Test",
        	"username":"Te222st"
        }
        ```
        
    - Returns
        - Success (201)
            
            ```jsx
            {
            	"message": "Successfully created user.",
            	"validationToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImIiLCJtb2RlIjoiVkFMSURBVElPTiIsImlhdCI6MTY3MjM0MjM4MSwiZXhwIjoxNjcyMzQyNTAxfQ.9JyyNNPSGJEpsvjTODvI26QhknXxMH3HnLWlqKg8eZM"
            }
            ```
            
        - Username in use (409)
            
            ```jsx
            {
            	"message": "The chosen username is already in use."
            }
            ```
            
        - E-mail in use (409)
            
            ```jsx
            {
            	"message": "The chosen e-mail is already in use."
            }
            ```
            
        - Invalid e-mail, password, or username (400)
            
            ```jsx
            {
            	"errors": [
            		{
            			"value": "b",
            			"msg": "Invalid value",
            			"param": "email",
            			"location": "body"
            		},
            		{
            			"value": "Test",
            			"msg": "Invalid value",
            			"param": "password",
            			"location": "body"
            		}
            	]
            }
            ```
            
- 🔒 `POST /auth/status`
    - Accepts
        - (No body, requires session token in the form of a [HTTP Bearer Authentication](https://swagger.io/docs/specification/authentication/bearer-authentication/) header)
    - Returns
        - Success (200)
            
            ```jsx
            {
            	"message": "Valid token. User logged in."
            }
            ```
            
        - Invalid Token (401)
            
            ```jsx
            {
            	"message": "Access unauthorized."
            }
            ```
            
        - Invalid validation token (instead of session token) which can only be used for OTP validation (403)
            
            ```jsx
            {
            	"message": "This token isn't valid for this purpose.",
            	"currentMode": "VALIDATION",
            	"expectedMode": "SESSION"
            }
            ```
            

### (Authentication Routes) — OTP Validation Routes

- 🔒 `POST /auth/otp/enroll`
    - Accepts
        - (No body, requires a **validation** token in the form of a [HTTP Bearer Authentication](https://swagger.io/docs/specification/authentication/bearer-authentication/) header). A validation token can only be obtained from trying to login with the `/auth/login` route, and is only valid for a few minutes.
    - Returns
        - Success (200)
            
            ```jsx
            {
            	"message": "OTP enrollment started. Proceed to OTP validation (/auth/otp/validate).",
            	"OTPPairingURL": "otpauth://totp/MusicMarkt:b@mail.com?secret=M5XUC4CIOBUW6U2VNZ2EUTDPNRFTSQ3J&issuer=MusicMarkt&period=30&digits=6&algorith=SHA1"
            }
            ```
            
        - Invalid token (401)
            
            ```jsx
            {
            	"message": "Access unauthorized."
            }
            ```
            
- 🔒 `POST /auth/otp/validate`
    - Accepts
        - (Requires a **validation** token in the form of a [HTTP Bearer Authentication](https://swagger.io/docs/specification/authentication/bearer-authentication/) header). A validation token can only be obtained from trying to login with the `/auth/login` route, and is only valid for a few minutes.
        
        ```jsx
        {
        	"otp":"333817"
        }
        ```
        
    - Returns
        - Success (200)
            
            ```jsx
            {
            	"message": "Successfully validated OTP.",
            	"sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJAbWFpbC5jb20iLCJtb2RlIjoiU0VTU0lPTiIsImlhdCI6MTY3MjQ5NDE3NSwiZXhwIjoxNjcyNDk3Nzc1fQ.LInqkb_iJVrzUAWw4T9AlSNv4DHvpulNd1d8X3q9-T4",
            	"userId": 1
            }
            ```
            
        - Wrong code (401)
            
            ```jsx
            {
            	"message": "The provided OTP code is not correct. Access unauthorized."
            }
            ```
            
        - Invalid token (401)
            
            ```jsx
            {
            	"message": "Access unauthorized."
            }
            ```
            

## User Routes

### Account Management Routes

- 🔒🚨 `GET /user/:userId`
    - Accepts
        - The `:userId` parameter in the request URL
    - Returns
        - Success (200)
            
            ```jsx
            {
            	"id": 2,
            	"email": "b@mail.com",
            	"username": "Banana",
            	"address": {
            		"city": "Banana_City",
            		"postal_code": "0000-002",
            		"street": "02_Street"
            	}
            }
            ```
            
            - If the user is the owner of the account (e.g. user with ID 2 accessing account ID 2
            - If the user is an administrator (access to information regarding all accounts)
        - Insufficient permissions (403)
            
            ```jsx
            {
            	"message": "Insufficient permissions for specified resource."
            }
            ```
            
        - Invalid validation token (401)
            
            ```jsx
            {
            	"message": "Access unauthorized."
            }
            ```
            
        
- 🔒🚨 `POST /user/:userId/address`
    - Accepts
        - The `:userId` parameter in the request URL
        - The `city` in the request body
        - The `postal_code` in the request body
        - The `street` in the request body
    - Returns
        - Success (201)
            
            ```jsx
            {
            	"message": "Address successfully associated to user",
            	"userId": 2,
            	"addressId": 14
            	}
            }
            ```
            
            - If the user is the owner of the account (e.g. user with ID 2 posting address to account ID 2)
            - If the user is an administrator (post information regarding all accounts)
        - User already has address (409)
            
            ```jsx
            {
            	"message": "This user already has an address associated."
            }
            ```
            
        
- 🔒🚨 `PUT /user/:userId/address`
    - Accepts
        - The `:userId` parameter in the request URL
        - The `city` in the request body
        - The `postal_code` in the request body
        - The `street` in the request body
    - Returns
        - Success (202)
            
            ```jsx
            {
            	"message": "Address successfully updated",
            	"id": 12,
            	"city": "Banana_City 2",
            	"postal_code": "0000-003",
            	"street": "02_Street 2."
            	}
            }
            ```
            
            - If the user is the owner of the account (e.g. user with ID 2 posting to account ID 2 address)
            - If the user is an administrator (update information regarding all accounts)
        - User already has no address to update (404)
            
            ```jsx
            {
               message: "This user does not have an associated address"
            }
            ```
            
    
- 🔒🚨 `DELETE /user/:userId/address`
    - Accepts
        - The `:userId` parameter in the request URL
    - Returns
        - Success (200)
            
            ```jsx
            {
            	"message": "User address successfully deleted"
            }
            ```
            
            - If the user is the owner of the account (e.g. user with ID 2 posting to account ID 2 address)
            - If the user is an administrator (delete information regarding all accounts)
        - No address to delete (404)
            
            ```jsx
            {
            	"message": "This user does not have an associated address"
            }
            ```
            

### Cart Routes

- 🔒🚨`GET /user/:userId/cart`
    - Accepts
        - The `:userId` parameter in the request URL
    - Returns
        - Success (200)
            
            ```jsx
            {
            	"cart": [
            		{
            			"id": 16,
            			"product_id": 3,
            			"quantity": 5,
            			"Product": {
            				"id": 3,
            				"name": "Baby's first metal drum",
            				"price": "15.34",
            				"brand": "ScreamFest Mania",
            				"description": "Proin eu mauris tincidunt, dapibus turpis sed, faucibus augue."
            			}
            		},
            		{
            			"id": 15,
            			"product_id": 2,
            			"quantity": 5,
            			"Product": {
            				"id": 2,
            				"name": "Kesha's greatest hits",
            				"price": "10.23",
            				"brand": "Kesha Inc.",
            				"description": "Sed eu accumsan mi."
            			}
            		}
            	],
            	"totalPrice": 25.57
            }
            ```
            
            - If the user is the owner of the account (e.g. user with ID 2 posting to account ID 2 address)
            - If the user is an administrator (see information regarding all accounts)
            
- 🔒🚨`POST /user/:userId/cart`
    - Accepts
        - The `:userId` parameter in the request URL
        - The `productId` in the request body
        - The `quantity` in the request body
    - Returns
        - Success (201)
            
            ```jsx
            {
            	"message": "Product successfully added to cart",
            	"cartItemId": 17,
            	"productId": 1,
            	"quantity": 7
            }
            ```
            
            - If the user is the owner of the account (e.g. user with ID 2 posting to account ID 2 address)
            - If the user is an administrator (alter information regarding all accounts)
        - Invalid Product (404)
        
        ```jsx
        {
        message: "The provided product ID doesn't match any product."
        }
        ```
        
        - Duplicate Product in cart (409)
        
        ```jsx
        {
        message: "The provided product ID already matches an item in the user's cart."
        }
        ```
        

- 🔒🚨`PUT /user/:userId/cart/:cartItem`
    - Accepts
        - The `:userId` parameter in the request URL
        - The `:cartItem` parameter in the request URL
    - Returns
        - Success (200)
            
            ```jsx
            {
            	"message": "Product successfully updated on cart",
            	"cartItemId": 17,
            	"productId": 1,
            	"quantity": 2
            }
            ```
            
            - If the user is the owner of the account (e.g. user with ID 2 posting to account ID 2 address) and cart item exists for that user
            - If the user is an administrator (see information regarding all accounts) and cart item exists for that user
        - Invalid cart item (404)
        
        ```jsx
        {
        	"message": "The provided item ID doesn't match any product on the user's cart."
        }
        ```
        

- 🔒🚨 `DELETE /user/:userId/cart/:cartItem`
    - Accepts
        - The `:userId` parameter in the request URL
        - The `:cartItem` parameter in the request URL
    - Returns
        - Success (200)
            
            ```jsx
            {
            	"message": "Cart item successfully cleared"
            }
            ```
            
            - If the user is the owner of the account (e.g. user with ID 2 posting to account ID 2 address) and cart item exists for that user
            - If the user is an administrator (alter information regarding all accounts) and cart item exists for that user
        - Invalid cart item (404)
        
        ```jsx
        {
        	"message": "The provided item ID doesn't match any product on the user's cart."
        }
        ```
        

- 🔒🚨 `DELETE /user/:userId/cart`
    - Accepts
        - The `:userId` parameter in the request URL
    - Returns
        - Success (200)
            
            ```jsx
            {
            	"message": "Cart successfully cleared",
            	"result": {
            		"count": 3
            	}
            }
            ```
            
            - If the user is the owner of the account (e.g. user with ID 2 posting to account ID 2 address)
            - If the user is an administrator (alter information regarding all accounts)

## Store Routes

### Product Routes

- `GET /store/products`
    - Accepts
        - Query parameters
            - `sort`
                - One of the following: "newest", "oldest", "price_asc", "price_desc", "name_asc", "name_desc”
            - `artist`
                - A valid artist ID
    - Returns
        - Success (200) (Example, no query parameters)
            
            ```jsx
            [
            	{
            		"id": 1,
            		"price": "5.99",
            		"type": "Merch",
            		"name": "Michael Jackson Meme shirt",
            		"description": "Integer suscipit nisi nisl, pretium mattis quam ultrices vitae.",
            		"brand": "Moonwalk Industries",
            		"launch_date": "2005-04-03T20:32:45.000Z"
            	},
            	{
            		"id": 2,
            		"price": "10.23",
            		"type": "CD",
            		"name": "Kesha's greatest hits",
            		"description": "Sed eu accumsan mi. Donec at nulla orci. Sed id metus ut ligula vestibulum eleifend. Nunc lectus arcu, rutrum et fringilla in, dictum fermentum erat. Donec at semper dui. ",
            		"brand": "Kesha Inc.",
            		"launch_date": "2020-09-30T03:46:34.000Z"
            	},
            	{
            		"id": 3,
            		"price": "15.34",
            		"type": "Instrument",
            		"name": "Baby's first metal drum",
            		"description": "Proin eu mauris tincidunt, dapibus turpis sed, faucibus augue. Aenean eget lectus at massa eleifend iaculis nec id massa. Fusce congue sem non convallis suscipit.",
            		"brand": "ScreamFest Mania",
            		"launch_date": "2022-03-23T16:28:59.000Z"
            	},
            	{
            		"id": 4,
            		"price": "2",
            		"type": "MERCH",
            		"name": "AAAA",
            		"description": "AAA",
            		"brand": "AAAA",
            		"launch_date": "2022-12-12T00:00:00.000Z"
            	}
            ]
            ```
            
        - It’ll return 400 if a bad artist ID or sorting filter is provided
        - It’ll return an empty array if no matches are found

- `GET /store/products/:productId`
    - Accepts
        - The `:productId` in the product request
    - Returns
        - Success (200)
            
            ```jsx
            {
            	"id": 2,
            	"price": "10.23",
            	"type": "CD",
            	"name": "Kesha's greatest hits",
            	"description": "Sed eu accumsan mi. Donec at nulla orci. Sed id metus ut ligula vestibulum eleifend. Nunc lectus arcu, rutrum et fringilla in, dictum fermentum erat. Donec at semper dui. ",
            	"brand": "Kesha Inc.",
            	"launch_date": "2020-09-30T03:46:34.000Z",
            	"attributes": [],
            	"artist": {
            		"id": 3,
            		"name": "BabyMetal"
            	}
            }
            ```
            
        - Not found (404)
            
            ```jsx
            {
            	"message": "No product found with the provided identifier."
            }
            ```
            

- 🔒🚨 `POST /store/products`
    - Accepts
        
        ```jsx
        {
        	"price":2,
        	"type":"MERCH",
        	"name":"AAAA",
        	"description":"AAA",
        	"brand":"AAAA",
        	"launchDate":"2022-12-12", <-- Must be in ISO8601 format
        	"price":2 <-- Can also be float,
        	"artistId":2 <-- Must match real artist ID
        }
        ```
        
    - Returns
        - Success (201)
            
            ```jsx
            {
            	"message": "Product successfully created.",
            	"productId": 4
            }
            ```
            
        - Conflict with product name (409)
            
            ```jsx
            {
            	"message": "There's already a product with the provided product name."
            }
            ```
            
        - Invalid provided artist ID
            
            ```jsx
            {
            	"message": "The provided artist ID doesn't match any artist."
            }
            ```
            

### Artist Routes

- `GET /store/artists`
    - Accepts
        - Nothing
    - Returns
        - Success (200)
        
        ```jsx
        [
        	{
        		"id": 1,
        		"name": "Michael J",
        		"description": "Coined the Moonwalk",
        		"type": "SOLO_ARTIST",
        		"genre": "Soul"
        	},
        	{
        		"id": 2,
        		"name": "Kesha",
        		"description": "Beloved party music singer",
        		"type": "SOLO_ARTIST",
        		"genre": "Pop"
        	},
        	{
        		"id": 3,
        		"name": "BabyMetal",
        		"description": "Popular for its inventive mix of styles",
        		"type": "BAND",
        		"genre": "Kawaii Metal"
        	}
        ]
        ```
        
        - It’ll return an empty array if no matches are found
        
- `GET /store/artists/:artistId`
    - Accepts
        - The `:artistId` parameter in the request URL
    - Returns
        - Success (200)
            
            ```jsx
            {
            	"id": 2,
            	"name": "Kesha",
            	"description": "Beloved party music singer",
            	"type": "SOLO_ARTIST",
            	"genre": "Pop",
            	"products": [
            		{
            			"Product": {
            				"id": 2,
            				"name": "Kesha's greatest hits",
            				"launch_date": "2020-09-30T03:46:34.000Z",
            				"price": "10.23"
            			}
            		}
            	]
            }
            ```
            

- 🔒🚨 `POST /store/artists`
    - Accepts
        
        ```jsx
        {
        	"name":"Taylor Swift",
        	"description":"Singer of Blank Space",
        	"type":"SOLO_ARTIST",
        	"genre":"Pop"
        }
        ```
        
    - Returns
        - Success (201)
            
            ```jsx
            {
            	"message": "Artist profile successfully created.",
            	"result": {
            		"artistId": 5
            	}
            }
            ```
            
        - Conflict with product name (409)
            
            ```jsx
            {
            	"message": "The provided artist name is already in use."
            }
            ```
            
    
    ### Order Routes
    
- 🔒🚨`GET /store/order/:orderId`
    - Accepts
        - The `:orderId` parameter in the request URL
    - Returns
        - Success (200)
            
            ```jsx
            {
            	"id": 10,
            	"date_ordered": "2022-12-16T21:07:04.000Z",
            	"OrderItem": [
            		{
            			"product_id": 1,
            			"quantity": 3
            		},
            		{
            			"product_id": 2,
            			"quantity": 1
            		},
            		{
            			"product_id": 3,
            			"quantity": 1
            		}
            	]
            }
            ```
            
            - If order id corresponds to one of the current user’s orders
            - If user is admin
        
- 🔒🚨 `POST /store/order`
    - Accepts
        - Nothing (but uses logged-in user id)
    - Returns
        - Success (201)
            
            ```jsx
            {
            	"message": "Order successfully created.",
            	"result": {
            		"newOrder": {
            			"id": 33,
            			"date_ordered": "2023-01-06T06:46:16.000Z",
            			"user_id": 2
            		}
            	}
            }
            ```