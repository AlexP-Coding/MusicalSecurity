/* DATABASE and TABLE CREATION */

/*
Named CONSTRAINTS are global to the database.
Therefore the following use the following naming rules:
  1. pk_table for names of PRIMARY key CONSTRAINTS
  2. fk_table_another for names of FOREIGN key CONSTRAINTS
*/

/* Database Creation */
CREATE OR REPLACE DATABASE `musicmarkt_db`;


/* Table Creation */

USE `musicmarkt_db`;


/* MusicMarkt user */
CREATE OR REPLACE TABLE `User` (
    `id` int(10) NOT NULL AUTO_INCREMENT,
    `name` varchar(250) NOT NULL,
    `username` VARCHAR(250) NOT NULL,
    `password` varchar(250) NOT NULL,
    `email` varchar(100) NOT NULL,
    `admin` BOOL NOT NULL DEFAULT 0,
    `otp_enrolled` BOOL NOT NULL DEFAULT 0,
    `otp_key` varchar(300) DEFAULT NULL, -- for otp validation
    CONSTRAINT pk_user PRIMARY KEY(`id`),
    UNIQUE(`username`),
    UNIQUE(`email`)
);

/* User's address info */
CREATE OR REPLACE TABLE `Address` (
    `id` int(10) NOT NULL AUTO_INCREMENT,
    `user_id` int(10) NOT NULL,
    `city` varchar(50),
    `postal_code` varchar(10) NOT NULL,
    `street` varchar(100),
    CONSTRAINT pk_address PRIMARY KEY(`id`),
    CONSTRAINT fk_address_user FOREIGN KEY(`user_id`) 
	 	REFERENCES `User`(`id`)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
    CONSTRAINT UNIQUE(`user_id`)
);

/* Artist with products sold by the store */
CREATE OR REPLACE TABLE `Artist` (
    `id` int(10) NOT NULL AUTO_INCREMENT,
    `name` varchar(200) NOT NULL,
    `description` varchar(250),
    `type` ENUM('SOLO_ARTIST', 'BAND'),
    `genre` varchar(50),
    CONSTRAINT pk_artist PRIMARY KEY(`id`),
    CONSTRAINT unique_artist_name UNIQUE(`name`)
);

/* Product sold by MusicMarkt */
CREATE OR REPLACE TABLE `Product` (
    `id` int(10) NOT NULL AUTO_INCREMENT,
    `price` NUMERIC(10, 2) UNSIGNED NOT NULL,
    `type` varchar(50), -- product type (merch, music...)
    `name` varchar(200) NOT NULL, -- product name
    `description` varchar(250) NOT NULL, -- product description
    `brand` varchar(200) NOT NULL, -- product brand
    `launch_date` DATETIME NOT NULL, -- launch date equals addition date for simplicity
    CONSTRAINT pk_product PRIMARY KEY(`id`),
    CONSTRAINT unique_product_name UNIQUE(`name`),
    CONSTRAINT chk_product_price CHECK(`price` > 0)
);

/* Other attributes of a product */
CREATE OR REPLACE TABLE `ProductAttribute` (
    `id` int(10) NOT NULL AUTO_INCREMENT,
    `product_id` int(10), -- product associated
    `key` varchar(200) NOT NULL, -- name of attribute
    `value` varchar(200) NOT NULL, -- value of attribute
    CONSTRAINT pk_product_attribute PRIMARY KEY(`id`),
    CONSTRAINT fk_product_attribute_product FOREIGN KEY(`product_id`) 
	 	REFERENCES `Product`(`id`)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
    CONSTRAINT unique_productattribute_key UNIQUE(`product_id`, `key`)
);

/* Artist may be associated to one or several products */
CREATE OR REPLACE TABLE `ArtistItem` (
    `id` int(10) NOT NULL AUTO_INCREMENT,
    `artist_id` int(10) NOT NULL, -- artist associated
    `product_id` int(10) NOT NULL, -- product by artist
    CONSTRAINT pk_artistitem PRIMARY KEY(`id`),
    CONSTRAINT fk_artistitem_artist FOREIGN KEY(`artist_id`) 
	 	REFERENCES `Artist`(`id`)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
    CONSTRAINT fk_artistitem_product FOREIGN KEY(`product_id`) 
	 	REFERENCES `Product`(`id`)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
    CONSTRAINT unique_artistitem_artist_product UNIQUE(`artist_id`, `product_id`)
);

/* Item in a user's cart */
CREATE OR REPLACE TABLE `CartItem` (
    `id` int(10) NOT NULL AUTO_INCREMENT,
    `product_id` int(10) NOT NULL, -- product in cart
    `user_id` int(10) NOT NULL, -- user associated
    `quantity` int(100) NOT NULL, -- amount in cart
    CONSTRAINT pk_cart_item PRIMARY KEY(`id`),
    CONSTRAINT fk_cart_item_product FOREIGN KEY(`product_id`) 
	 	REFERENCES `Product`(`id`)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
    CONSTRAINT fk_cart_item_user FOREIGN KEY(`user_id`)
	 	REFERENCES `User`(`id`)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
    CONSTRAINT unique_cartitem_product_user UNIQUE(`product_id`, `user_id`),
    CONSTRAINT chk_cartitem_quantity CHECK(`quantity` > 0)
);

/* Order by a user */
CREATE OR REPLACE TABLE `Order` (
    `id` int(10) NOT NULL AUTO_INCREMENT,
    `date_ordered` DATETIME NOT NULL,
    `user_id` int(10) NOT NULL,
    CONSTRAINT pk_order PRIMARY KEY(`id`),
    CONSTRAINT fk_order_product FOREIGN KEY(`user_id`) 
	 	REFERENCES `User`(`id`)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

/* Item in an order */
CREATE OR REPLACE TABLE `OrderItem` (
    `id` int(10) NOT NULL AUTO_INCREMENT,
    `quantity` int(3) NOT NULL, -- amount ordered
    `product_id` int(10) NOT NULL,
    `order_id` int(10) NOT NULL, -- order associated
    CONSTRAINT pk_order_item PRIMARY KEY(`id`),
    CONSTRAINT fk_order_item_product FOREIGN KEY(`product_id`)
	 	REFERENCES `User`(`id`)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
    CONSTRAINT fk_order_item_order FOREIGN KEY(`order_id`)
	 	REFERENCES `Order`(`id`)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
    CONSTRAINT unique_orderitem_product_order UNIQUE(`product_id`, `order_id`),
    CONSTRAINT chk_orderitem_quantity CHECK(`quantity` > 0)
);