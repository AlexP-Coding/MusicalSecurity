/* TABLE POPULATION */

USE `musicmarkt_db`;

/* User */
INSERT INTO `User` VALUES(NULL, 'Alex Alcochete', 'Alex', '$2b$10$p87DJC9zhpi.Z/jFVHSftuvJDxReNtEc7yWjADIULC2DmNdOWoZcK', 'a@mail.com', 1, 0, NULL);
INSERT INTO `User` VALUES(NULL, 'Banana Barbara', 'Banana', '$2b$10$Nxwg5gQRyHXXxGMITf6dnuevS8MJr/45CNlaDIhYi0WrK3vQhugpC', 'b@mail.com', 0, 0, NULL);
INSERT INTO `User` VALUES(NULL, 'Carlos Cinemas', 'Carlos', '$2b$10$mN/MTkGo3I.0ithzupG4B.ZezKSp63lL5Ewk7OAFOvUa86m9/BKme', 'c@mail.com', 0, 0, NULL);
INSERT INTO `User` VALUES(NULL, 'Dominic Diurno', 'Dominic', '$2b$10$ILfCkEuekj8tZ4R/ZEX73O.wsYIc/Ya8E83UPRjln/PziJlQQBihS', 'd@mail.com', 0, 0, NULL);
INSERT INTO `User` VALUES(NULL, 'Ernesto Eliseu', 'Ernesto', '$2b$10$.9kJgVSCZFfv3tFLwh.NS.xPjx13IVPzgjI4Br/Na8klso0uwUdlu', 'e@mail.com', 0, 0, NULL);
INSERT INTO `User` VALUES(NULL, 'Filipe Fadigas', 'Filipe', '$2b$10$Y2EgK0LODoIRyL3yAz4asesZegfYTzYbYIjB8UVXoioO6Hv6rxJV2', 'f@mail.com', 0, 0, NULL);
INSERT INTO `User` VALUES(NULL, 'Gonzo de Giles', 'Gonzo', '$2b$10$Cd0OztfTJcgD4qtwuVConONmGU1UXrDMXitRKWYGeWisqn1bizSeS', 'g@mail.com', 0, 0, NULL);
INSERT INTO `User` VALUES(NULL, 'Heidi Holliday', 'Heidi', '$2b$10$qx0FdLm1GqNYeBxQC.EgTe6hJjUg2HF46UK5cY.uTMtWKGJt5u0WS', 'h@mail.com', 0, 0, NULL);
INSERT INTO `User` VALUES(NULL, 'Ines Irlanda I', 'Ines', '$2b$10$KE0v1Pw5nXi4o.Rph1l4nO50UdLh5l5VTq9ywL0Nx5b7qGxFLVz0S', 'i@mail.com', 0, 0, NULL);
INSERT INTO `User` VALUES(NULL, 'Julli Jones IV', 'Julli', '$2b$10$KxZhQiKA6y.WwS07gMIlmOCYxDL1MAm8V96QvHADJ1dGp34HiZNce', 'j@mail.com', 0, 0, NULL);
INSERT INTO `User` VALUES(NULL, 'Kelly Klarkson', 'Kelly', '$2b$10$Ml2pj/XfDAxaKfE8mXL6Ke0KG75m1HyKZRnf36.A8yGyDVicD8qEG', 'k@mail.com', 0, 0, NULL);
INSERT INTO `User` VALUES(NULL, 'Ze Zicas Zorro', 'Ze', '$2b$10$kB1i7ADmumZuNIUwq.RoF.zk2dXSU8DUa/mC1sHQLqIf0eggk54oq', 'z@mail.com', 0, 0, NULL);

/* Address */
INSERT INTO `Address` VALUES(NULL, 1, 'Alex_City', '0000-001', '01_Street');
INSERT INTO `Address` VALUES(NULL, 2,'Banana_City', '0000-002', '02_Street');
INSERT INTO `Address` VALUES(NULL, 3, 'Carlos_City', '0000-003', '03_Street');
INSERT INTO `Address` VALUES(NULL, 4, 'Dominic_City', '0000-004', '04_Street');
INSERT INTO `Address` VALUES(NULL, 5, 'Ernesto_City', '0000-005', '05_Street');
INSERT INTO `Address` VALUES(NULL, 6, 'Filipe_City', '0000-006', '06_Street');
INSERT INTO `Address` VALUES(NULL, 7, 'Gonzo_City', '0000-007', '07_Street');
INSERT INTO `Address` VALUES(NULL, 8, 'Heidi_City', '0000-008', '08_Street');
INSERT INTO `Address` VALUES(NULL, 9, 'Ines_City', '0000-009', '09_Street');
INSERT INTO `Address` VALUES(NULL, 10, 'Julli_City', '0000-010', '10_Street');
INSERT INTO `Address` VALUES(NULL, 11, 'Kelly_City', '0000-011', '11_Street');
INSERT INTO `Address` VALUES(NULL, 12, 'Ze_City','0000-012', '12_Street');


/* Artist */
INSERT INTO `Artist` VALUES(NULL, 'Michael J', 'Coined the Moonwalk', 'SOLO_ARTIST', 'Soul');
INSERT INTO `Artist` VALUES(NULL, 'Kesha', 'Beloved party music singer', 'SOLO_ARTIST', 'Pop');
INSERT INTO `Artist` VALUES(NULL, 'BabyMetal', 'Popular for its inventive mix of styles', 'BAND', 'Kawaii Metal');


/* Product */
INSERT INTO `Product` VALUES(NULL, 5.99, 'Merch', 'Michael Jackson Meme shirt', "Integer suscipit nisi nisl, pretium mattis quam ultrices vitae.", 'Moonwalk Industries', STR_TO_DATE('2005-04-03 20:32:45', '%Y-%m-%d %H:%i:%s'));
INSERT INTO `Product` VALUES(NULL, 10.23, 'CD', 'Kesha''s greatest hits', "Sed eu accumsan mi. Donec at nulla orci. Sed id metus ut ligula vestibulum eleifend. Nunc lectus arcu, rutrum et fringilla in, dictum fermentum erat. Donec at semper dui. ", 'Kesha Inc.', STR_TO_DATE('2020-09-30 03:46:34', '%Y-%m-%d %H:%i:%s'));
INSERT INTO `Product` VALUES(NULL, 15.34, 'Instrument', 'Baby''s first metal drum', "Proin eu mauris tincidunt, dapibus turpis sed, faucibus augue. Aenean eget lectus at massa eleifend iaculis nec id massa. Fusce congue sem non convallis suscipit.", 'ScreamFest Mania', STR_TO_DATE('2022-03-23 16:28:59', '%Y-%m-%d %H:%i:%s'));


/* ProductAttribute */



/* ArtistItem */
INSERT INTO `ArtistItem` VALUES(NULL, 1, 1);
INSERT INTO `ArtistItem` VALUES(NULL, 3, 2);
INSERT INTO `ArtistItem` VALUES(NULL, 3, 3);


/* CartItem */
INSERT INTO `CartItem` VALUES(NULL, 1, 12, 5);
INSERT INTO `CartItem` VALUES(NULL, 2, 11, 5);
INSERT INTO `CartItem` VALUES(NULL, 3, 12, 5);


/* Order */
INSERT INTO `Order` VALUES(NULL, STR_TO_DATE('2022-03-31 23:59:34', '%Y-%m-%d %H:%i:%s'), 1);
INSERT INTO `Order` VALUES(NULL, STR_TO_DATE('2022-01-25 22:50:34', '%Y-%m-%d %H:%i:%s'), 2);
INSERT INTO `Order` VALUES(NULL, STR_TO_DATE('2022-07-12 03:32:34', '%Y-%m-%d %H:%i:%s'), 3);
INSERT INTO `Order` VALUES(NULL, STR_TO_DATE('2022-04-12 06:12:25', '%Y-%m-%d %H:%i:%s'), 4);
INSERT INTO `Order` VALUES(NULL, STR_TO_DATE('2022-06-17 12:19:39', '%Y-%m-%d %H:%i:%s'), 5);
INSERT INTO `Order` VALUES(NULL, STR_TO_DATE('2022-11-07 08:15:35', '%Y-%m-%d %H:%i:%s'), 6);
INSERT INTO `Order` VALUES(NULL, STR_TO_DATE('2022-05-29 19:51:49', '%Y-%m-%d %H:%i:%s'), 7);
INSERT INTO `Order` VALUES(NULL, STR_TO_DATE('2022-09-09 16:38:14', '%Y-%m-%d %H:%i:%s'), 8);
INSERT INTO `Order` VALUES(NULL, STR_TO_DATE('2022-07-07 04:54:23', '%Y-%m-%d %H:%i:%s'), 9);
INSERT INTO `Order` VALUES(NULL, STR_TO_DATE('2022-12-16 21:07:04', '%Y-%m-%d %H:%i:%s'), 10);
INSERT INTO `Order` VALUES(NULL, STR_TO_DATE('2022-12-05 15:29:17', '%Y-%m-%d %H:%i:%s'), 11);
INSERT INTO `Order` VALUES(NULL, STR_TO_DATE('2022-10-26 10:10:12', '%Y-%m-%d %H:%i:%s'), 12);


/* OrderItem */
INSERT INTO `OrderItem` VALUES(NULL, 5, 3, 1);
INSERT INTO `OrderItem` VALUES(NULL, 5, 2, 1);
INSERT INTO `OrderItem` VALUES(NULL, 1, 2, 2);
INSERT INTO `OrderItem` VALUES(NULL, 1, 3, 2);
INSERT INTO `OrderItem` VALUES(NULL, 3, 1, 3);
INSERT INTO `OrderItem` VALUES(NULL, 3, 3, 3);
INSERT INTO `OrderItem` VALUES(NULL, 2, 1, 4);
INSERT INTO `OrderItem` VALUES(NULL, 2, 2, 4);
INSERT INTO `OrderItem` VALUES(NULL, 1, 3, 5);
INSERT INTO `OrderItem` VALUES(NULL, 1, 2, 5);
INSERT INTO `OrderItem` VALUES(NULL, 4, 3, 6);
INSERT INTO `OrderItem` VALUES(NULL, 4, 2, 6);
INSERT INTO `OrderItem` VALUES(NULL, 3, 2, 7);
INSERT INTO `OrderItem` VALUES(NULL, 3, 1, 7);
INSERT INTO `OrderItem` VALUES(NULL, 3, 2, 8);
INSERT INTO `OrderItem` VALUES(NULL, 3, 1, 8);
INSERT INTO `OrderItem` VALUES(NULL, 2, 2, 9);
INSERT INTO `OrderItem` VALUES(NULL, 2, 3, 9);
INSERT INTO `OrderItem` VALUES(NULL, 3, 1, 10);
INSERT INTO `OrderItem` VALUES(NULL, 1, 2, 10);
INSERT INTO `OrderItem` VALUES(NULL, 1, 3, 10);
INSERT INTO `OrderItem` VALUES(NULL, 2, 2, 11);
INSERT INTO `OrderItem` VALUES(NULL, 2, 3, 11);
INSERT INTO `OrderItem` VALUES(NULL, 1, 2, 12);
INSERT INTO `OrderItem` VALUES(NULL, 1, 3, 12);