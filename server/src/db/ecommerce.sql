-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Apr 27, 2025 at 11:50 AM
-- Server version: 8.0.41
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommerce`
--

-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

CREATE TABLE `permission` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createBy` int NOT NULL DEFAULT '0',
  `updateBy` int NOT NULL DEFAULT '0',
  `status` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `permission`
--

INSERT INTO `permission` (`id`, `name`, `slug`, `createdAt`, `updatedAt`, `createBy`, `updateBy`, `status`) VALUES
(1, 'role.create', 'role.create', '2024-11-17 21:57:56.748583', '2024-11-18 06:09:10.250194', 1, 1, 1),
(2, 'permission.get-all', 'permission.get-all', '2024-11-17 23:30:41.394835', '2024-11-17 23:30:41.394835', 1, 1, 1),
(3, 'permission.create', 'permission.create', '2024-11-18 06:01:50.284945', '2024-11-18 06:01:50.284945', 1, 1, 1),
(5, 'permission.get-one', 'permission.get-one', '2024-11-18 06:02:27.928855', '2024-11-18 06:02:27.928855', 1, 1, 1),
(6, 'permission.edit', 'permission.edit', '2024-11-18 06:02:45.195722', '2024-11-18 06:02:45.195722', 1, 1, 1),
(7, 'permission.delete', 'permission.delete', '2024-11-18 06:02:57.423859', '2024-11-18 06:02:57.423859', 1, 1, 1),
(9, 'role.find-all', 'role.find-all', '2024-11-18 06:07:23.029783', '2024-11-18 06:07:23.029783', 1, 1, 1),
(10, 'role.find-one', 'role.find-one', '2024-11-18 06:07:39.755621', '2024-11-18 06:07:39.755621', 1, 1, 1),
(11, 'role.edit', 'role.edit', '2024-11-18 06:07:51.574736', '2024-11-18 06:07:51.574736', 1, 1, 1),
(12, 'role.delete', 'role.delete', '2024-11-18 06:08:06.928947', '2024-11-18 06:08:06.928947', 1, 1, 1),
(13, 'route.create', 'route.create', '2024-11-18 06:31:59.415416', '2024-11-18 06:31:59.415416', 1, 1, 1),
(14, 'route.get-all', 'route.get-all', '2024-11-18 06:32:21.545382', '2024-11-18 06:32:21.545382', 1, 1, 1),
(15, 'route.get-one', 'route.get-one', '2024-11-18 06:32:36.866947', '2024-11-18 06:32:36.866947', 1, 1, 1),
(16, 'route.update', 'route.update', '2024-11-18 06:32:53.339721', '2024-11-18 06:32:53.339721', 1, 1, 1),
(17, 'route.delete', 'route.delete', '2024-11-18 06:33:10.055451', '2024-11-18 06:33:10.055451', 1, 1, 1),
(18, 'user.get-profile', 'user.get-profile', '2024-11-18 21:05:00.731448', '2024-11-18 21:05:00.731448', 1, 1, 1),
(20, 'no-permission', 'no-permission', '2025-04-23 09:52:37.346000', '2025-04-23 15:52:37.355865', 5, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createBy` int NOT NULL DEFAULT '0',
  `updateBy` int NOT NULL DEFAULT '0',
  `status` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`, `slug`, `createdAt`, `updatedAt`, `createBy`, `updateBy`, `status`) VALUES
(4, 'admin', 'admin', '2025-04-07 08:50:01.607464', '2025-04-23 10:37:00.312000', 0, 5, 1),
(5, 'user', 'user', '2025-04-07 08:51:23.818797', '2025-04-07 08:51:23.818797', 0, 0, 1),
(6, 'admin2', 'admin2', '2025-04-09 10:03:47.013000', '2025-04-23 10:47:43.421000', 5, 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(4, 1),
(4, 2),
(4, 3),
(4, 5),
(4, 6),
(4, 7),
(4, 9),
(4, 10),
(4, 11),
(4, 12),
(4, 13),
(4, 14),
(4, 15),
(4, 16),
(4, 17),
(4, 18),
(4, 20),
(5, 18),
(6, 18);

-- --------------------------------------------------------

--
-- Table structure for table `route`
--

CREATE TABLE `route` (
  `slug` varchar(255) NOT NULL,
  `type` enum('guest','shared','protected','devOnly') NOT NULL DEFAULT 'guest',
  `name` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `isComponent` tinyint NOT NULL DEFAULT '0',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `status` int NOT NULL DEFAULT '1',
  `nsleft` int NOT NULL DEFAULT '1',
  `nsright` int NOT NULL DEFAULT '2',
  `metadata` json DEFAULT NULL,
  `createBy` int NOT NULL DEFAULT '0',
  `updateBy` int NOT NULL DEFAULT '0',
  `id` int NOT NULL,
  `parentId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `route`
--

INSERT INTO `route` (`slug`, `type`, `name`, `path`, `isComponent`, `createdAt`, `updatedAt`, `status`, `nsleft`, `nsright`, `metadata`, `createBy`, `updateBy`, `id`, `parentId`) VALUES
('root', 'guest', 'root', '', 0, '2025-04-10 09:42:02.112000', '2025-04-23 16:20:29.040415', 1, 1, 10, '{\"icons\": {\"icon\": [{\"url\": \"/icon.png\"}], \"apple\": [{\"url\": \"/apple-icon.png\", \"type\": \"image/png\", \"sizes\": \"192x192\"}, {\"url\": \"/apple-icon2.png\", \"type\": \"image/png\", \"sizes\": \"512x512\"}], \"other\": [{\"rel\": \"apple-touch-icon\", \"url\": \"/apple-icon.png\"}], \"shortcut\": [\"/shortcut-icon.png\"]}, \"title\": {\"default\": \"Home\", \"absolute\": \"https://example.com\", \"template\": \"Home - {{title}}\"}, \"assets\": [\"https://example.com/asset1\", \"https://example.com/asset2\"], \"itunes\": {\"appId\": \"123456789\", \"appArgument\": \"my-app-argument\"}, \"robots\": {\"index\": true, \"follow\": true, \"nocache\": false, \"googleBot\": {\"index\": true, \"follow\": true, \"noimageindex\": false}}, \"authors\": [{\"url\": \"https://example.com\", \"name\": \"John Doe\"}], \"creator\": \"John Doe\", \"twitter\": {\"card\": \"summary_large_image\", \"title\": \"Home\", \"images\": [\"https://example.com/twitter-image.png\"], \"siteId\": \"123456789\", \"creator\": \"@johndoe\", \"creatorId\": \"123456789\", \"description\": \"This is the home page\"}, \"abstract\": \"This is an abstract\", \"appLinks\": {\"ios\": {\"url\": \"https://example.com\", \"app_store_id\": \"123456789\"}, \"web\": {\"url\": \"https://example.com\", \"should_fallback\": true}, \"other\": [{\"url\": \"https://example.com\", \"app_id\": \"123456789\"}, {\"url\": \"https://example.com\", \"app_store_id\": \"123456789\"}, {\"url\": \"https://example.com\", \"package\": \"com.example.app\"}, {\"url\": \"https://example.com\", \"app_id\": \"123456789\"}, {\"url\": \"https://example.com\", \"app_store_id\": \"123456789\"}, {\"url\": \"https://example.com\", \"package\": \"com.example.app\"}, {\"url\": \"https://example.com\", \"app_id\": \"123456789\"}, {\"url\": \"https://example.com\", \"app_store_id\": \"123456789\"}], \"webApp\": {\"url\": \"https://example.com\", \"should_fallback\": true}, \"android\": {\"url\": \"https://example.com\", \"package\": \"com.example.app\"}, \"windows\": {\"url\": \"https://example.com\", \"app_id\": \"123456789\"}, \"universal\": {\"url\": \"https://example.com\", \"app_id\": \"123456789\"}}, \"archives\": [\"https://example.com/archive1\", \"https://example.com/archive2\"], \"category\": \"category\", \"keywords\": [\"home\", \"page\"], \"manifest\": \"/manifest.json\", \"referrer\": \"no-referrer\", \"bookmarks\": [\"https://example.com/bookmark1\", \"https://example.com/bookmark2\"], \"generator\": \"My Generator\", \"openGraph\": {\"url\": \"https://example.com\", \"type\": \"website\", \"title\": \"Home\", \"images\": [{\"alt\": \"An image\", \"url\": \"https://example.com/image.png\", \"type\": \"image/png\", \"width\": 800, \"height\": 600}], \"locale\": \"en_US\", \"authors\": [\"John Doe\"], \"siteName\": \"My Site\", \"description\": \"This is the home page\", \"publishedTime\": \"2023-01-01T00:00:00Z\"}, \"publisher\": \"My Company\", \"alternates\": {\"en\": \"/en\"}, \"themeColor\": [{\"color\": \"#000\", \"media\": \"(prefers-color-scheme: dark)\"}], \"appleWebApp\": {\"title\": \"My App\", \"capable\": true}, \"colorScheme\": \"dark light\", \"description\": \"This is the home page\", \"metadataBase\": \"https://example.com\", \"verification\": {\"other\": [{\"id\": \"other-verification-code\", \"type\": \"other\"}], \"google\": \"google-site-verification-code\", \"yandex\": \"yandex-verification-code\"}, \"classification\": \"This is a classification\", \"applicationName\": \"My App\", \"formatDetection\": {\"email\": false, \"address\": false, \"telephone\": false}}', 5, 0, 1, NULL),
('routes', 'guest', 'Routes', '/routes', 0, '2025-04-23 10:12:24.197000', '2025-04-23 16:14:55.417984', 1, 2, 3, '{\"title\": {\"default\": \"Routes\", \"absolute\": \"https://example.com\", \"template\": \"Routes - {{title}}\"}, \"robots\": {\"index\": true, \"follow\": true, \"nocache\": false, \"googleBot\": {\"index\": true, \"follow\": true, \"noimageindex\": false}}, \"authors\": [{\"url\": \"\", \"name\": \"\"}], \"creator\": \"\", \"keywords\": [\"\"], \"manifest\": \"/manifest.json\", \"referrer\": \"no-referrer\", \"generator\": \"\", \"publisher\": \"\", \"themeColor\": [{\"color\": \"#000\", \"media\": \"(prefers-color-scheme: dark)\"}], \"colorScheme\": \"dark light\", \"description\": \"This is the Routes page\", \"metadataBase\": \"https://example.com\", \"applicationName\": \"\", \"formatDetection\": {\"email\": false, \"address\": false, \"telephone\": false}}', 5, 0, 2, 1),
('home', 'guest', 'Home', '/', 0, '2025-04-23 10:13:56.918000', '2025-04-23 16:18:10.043917', 1, 4, 5, '{\"title\": {\"default\": \"Home\", \"absolute\": \"https://example.com\", \"template\": \"Home - {{title}}\"}, \"robots\": {\"index\": true, \"follow\": true, \"nocache\": false, \"googleBot\": {\"index\": true, \"follow\": true, \"noimageindex\": false}}, \"authors\": [{\"url\": \"\", \"name\": \"\"}], \"creator\": \"\", \"keywords\": [\"\"], \"manifest\": \"/manifest.json\", \"referrer\": \"no-referrer\", \"generator\": \"\", \"publisher\": \"\", \"themeColor\": [{\"color\": \"#000\", \"media\": \"(prefers-color-scheme: dark)\"}], \"colorScheme\": \"dark light\", \"description\": \"This is the Home page\", \"metadataBase\": \"https://example.com\", \"applicationName\": \"\", \"formatDetection\": {\"email\": false, \"address\": false, \"telephone\": false}}', 5, 0, 3, 1),
('i18n', 'guest', 'i18n', '/i18n', 0, '2025-04-23 10:16:56.234000', '2025-04-23 16:17:11.319269', 1, 6, 7, '{\"title\": {\"default\": \"i18n\", \"absolute\": \"https://example.com\", \"template\": \"i18n - {{title}}\"}, \"robots\": {\"index\": true, \"follow\": true, \"nocache\": false, \"googleBot\": {\"index\": true, \"follow\": true, \"noimageindex\": false}}, \"authors\": [{\"url\": \"\", \"name\": \"\"}], \"creator\": \"\", \"keywords\": [\"\"], \"manifest\": \"/manifest.json\", \"referrer\": \"no-referrer\", \"generator\": \"\", \"publisher\": \"\", \"themeColor\": [{\"color\": \"#000\", \"media\": \"(prefers-color-scheme: dark)\"}], \"colorScheme\": \"dark light\", \"description\": \"This is the i18n page\", \"metadataBase\": \"https://example.com\", \"applicationName\": \"\", \"formatDetection\": {\"email\": false, \"address\": false, \"telephone\": false}}', 5, 0, 4, 1),
('login', 'guest', 'Login', '/login', 0, '2025-04-23 10:20:29.036000', '2025-04-23 17:19:33.461610', 1, 8, 9, '{\"title\": {\"default\": \"login\", \"absolute\": \"https://example.com\", \"template\": \"login - {{title}}\"}, \"robots\": {\"index\": true, \"follow\": true, \"nocache\": false, \"googleBot\": {\"index\": true, \"follow\": true, \"noimageindex\": false}}, \"authors\": [{\"url\": \"\", \"name\": \"\"}], \"creator\": \"\", \"keywords\": [\"\"], \"manifest\": \"/manifest.json\", \"referrer\": \"no-referrer\", \"generator\": \"\", \"publisher\": \"\", \"themeColor\": [{\"color\": \"#000\", \"media\": \"(prefers-color-scheme: dark)\"}], \"colorScheme\": \"dark light\", \"description\": \"This is the login page\", \"metadataBase\": \"https://example.com\", \"applicationName\": \"\", \"formatDetection\": {\"email\": false, \"address\": false, \"telephone\": false}}', 5, 0, 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `route_has_permissions`
--

CREATE TABLE `route_has_permissions` (
  `permission_id` int NOT NULL,
  `route_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `route_has_permissions`
--

INSERT INTO `route_has_permissions` (`permission_id`, `route_id`) VALUES
(1, 1),
(2, 1),
(20, 2),
(20, 3),
(20, 4),
(20, 5);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `isSuperAdmin` int NOT NULL DEFAULT '0',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createBy` int NOT NULL DEFAULT '0',
  `updateBy` int NOT NULL DEFAULT '0',
  `status` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `isSuperAdmin`, `createdAt`, `updatedAt`, `createBy`, `updateBy`, `status`) VALUES
(5, 'John Doe', 'john.doe@gmail.com', '$2a$08$WesmMpzeo0ZgvAjmTXItaug6JB26MBNpMrrV3Ka9ax3kLA2H3B.Da', 0, '2025-04-07 09:07:37.567233', '2025-04-07 09:07:37.567233', 0, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
(5, 4),
(5, 5);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_240853a0c3353c25fb12434ad3` (`name`),
  ADD UNIQUE KEY `IDX_3379e3b123dac5ec10734b8cc8` (`slug`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_ae4578dcaed5adff96595e6166` (`name`),
  ADD UNIQUE KEY `IDX_35c9b140caaf6da09cfabb0d67` (`slug`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `IDX_178199805b901ccd220ab7740e` (`role_id`),
  ADD KEY `IDX_17022daf3f885f7d35423e9971` (`permission_id`);

--
-- Indexes for table `route`
--
ALTER TABLE `route`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_9c5e65ac97111c46de524f8177` (`slug`),
  ADD UNIQUE KEY `IDX_cc16047ba5141ec8dec50451df` (`name`),
  ADD UNIQUE KEY `IDX_1050f1bce08c8eb606e1a8607d` (`path`),
  ADD KEY `FK_2bf40bee2cce314e08c93d995dd` (`parentId`);

--
-- Indexes for table `route_has_permissions`
--
ALTER TABLE `route_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`route_id`),
  ADD KEY `IDX_ea46e0b428cc56bc70eeb00978` (`permission_id`),
  ADD KEY `IDX_66ff4403037962ee3ec1105dc6` (`route_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `IDX_87b8888186ca9769c960e92687` (`user_id`),
  ADD KEY `IDX_b23c65e50a758245a33ee35fda` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `permission`
--
ALTER TABLE `permission`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `route`
--
ALTER TABLE `route`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `FK_17022daf3f885f7d35423e9971e` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`id`),
  ADD CONSTRAINT `FK_178199805b901ccd220ab7740ec` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `route`
--
ALTER TABLE `route`
  ADD CONSTRAINT `FK_2bf40bee2cce314e08c93d995dd` FOREIGN KEY (`parentId`) REFERENCES `route` (`id`);

--
-- Constraints for table `route_has_permissions`
--
ALTER TABLE `route_has_permissions`
  ADD CONSTRAINT `FK_66ff4403037962ee3ec1105dc6f` FOREIGN KEY (`route_id`) REFERENCES `route` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_ea46e0b428cc56bc70eeb00978f` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`id`);

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `FK_87b8888186ca9769c960e926870` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_b23c65e50a758245a33ee35fda1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
