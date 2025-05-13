-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: May 12, 2025 at 11:14 PM
-- Server version: 8.0.42
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
  `slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `created_by` int NOT NULL DEFAULT '0',
  `updated_by` int NOT NULL DEFAULT '0',
  `deleted_by` int NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime DEFAULT NULL,
  `deleted` int NOT NULL DEFAULT '0',
  `message_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `permission`
--

INSERT INTO `permission` (`id`, `slug`, `name`, `status`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`, `deleted`, `message_id`) VALUES
(1, 'create', 'no-permission-required', 1, 0, 1, 0, '2025-05-02 18:22:52.489351', '2025-05-02 18:24:18.000000', NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int NOT NULL,
  `slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `created_by` int NOT NULL DEFAULT '0',
  `updated_by` int NOT NULL DEFAULT '0',
  `deleted_by` int NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime DEFAULT NULL,
  `deleted` int NOT NULL DEFAULT '0',
  `message_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `slug`, `name`, `status`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`, `deleted`, `message_id`) VALUES
(1, 'admin', 'admin', 1, 1, 0, 0, '2025-05-02 18:24:41.748512', '2025-05-02 18:24:41.748512', NULL, 0, NULL);

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
(1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `route`
--

CREATE TABLE `route` (
  `id` int NOT NULL,
  `slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `message_id` varchar(255) DEFAULT NULL,
  `status` int NOT NULL DEFAULT '1',
  `created_by` int NOT NULL DEFAULT '0',
  `updated_by` int NOT NULL DEFAULT '0',
  `deleted_by` int NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime DEFAULT NULL,
  `deleted` int NOT NULL DEFAULT '0',
  `type` enum('guest','shared','protected','devOnly') NOT NULL DEFAULT 'guest',
  `path` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `position` int NOT NULL DEFAULT '0',
  `is_menu` tinyint NOT NULL DEFAULT '0',
  `is_sub_menu` tinyint NOT NULL DEFAULT '0',
  `is_dynamic_route` tinyint NOT NULL DEFAULT '0',
  `metadata` json DEFAULT NULL,
  `nsleft` int NOT NULL DEFAULT '1',
  `nsright` int NOT NULL DEFAULT '2',
  `parentId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `route`
--

INSERT INTO `route` (`id`, `slug`, `name`, `message_id`, `status`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`, `deleted`, `type`, `path`, `icon`, `position`, `is_menu`, `is_sub_menu`, `is_dynamic_route`, `metadata`, `nsleft`, `nsright`, `parentId`) VALUES
(1, 'root', 'Root', 'root', 1, 1, 0, 0, '2025-05-12 21:43:42.303013', '2025-05-13 05:13:09.601308', NULL, 0, 'guest', '', NULL, 0, 1, 0, 0, '{\"title\": {\"default\": \"Root\", \"absolute\": \"https://example.com\", \"template\": \"Root - {{title}}\"}, \"description\": \"This is the root page\"}', 1, 18, NULL),
(2, 'login', 'Login', 'route.login', 1, 1, 0, 0, '2025-05-12 21:45:25.759794', '2025-05-13 05:12:57.252201', NULL, 0, 'guest', '/login', NULL, 0, 0, 1, 0, '{\"title\": {\"default\": \"Login\", \"absolute\": \"https://example.com\", \"template\": \"Login - {{title}}\"}, \"description\": \"This is the login page\"}', 2, 3, 1),
(3, 'home', 'Home', 'route.home', 1, 1, 0, 0, '2025-05-12 21:45:55.704812', '2025-05-13 05:12:43.573797', NULL, 0, 'guest', '/', NULL, 0, 0, 1, 0, '{\"title\": {\"default\": \"Home\", \"absolute\": \"https://example.com\", \"template\": \"Home - {{title}}\"}, \"description\": \"This is the home page\"}', 4, 5, 1),
(4, 'configuration', 'Configuration', 'route.configuration', 1, 1, 0, 0, '2025-05-12 21:47:14.692540', '2025-05-13 05:12:33.490006', NULL, 0, 'protected', 'configuration', NULL, 0, 0, 1, 0, '{\"title\": {\"default\": \"Configuration\", \"absolute\": \"https://example.com\", \"template\": \"Configuration - {{title}}\"}, \"description\": \"This is the configuration page\"}', 6, 17, 1),
(5, 'permissions', 'Permissions', 'route.configuration.permissions', 1, 1, 0, 0, '2025-05-12 21:50:08.426987', '2025-05-13 04:53:06.174934', NULL, 0, 'protected', '/configuration/permissions', NULL, 1, 0, 1, 0, '{\"title\": {\"default\": \"Permissions\", \"absolute\": \"https://example.com\", \"template\": \"Permissions - {{title}}\"}, \"description\": \"This is the permissions page\"}', 7, 8, 4),
(6, 'roles', 'Roles', 'route.configuration.roles', 1, 1, 0, 0, '2025-05-12 21:50:53.986689', '2025-05-13 04:53:11.501374', NULL, 0, 'protected', '/configuration/roles', NULL, 2, 0, 1, 0, '{\"title\": {\"default\": \"Roles\", \"absolute\": \"https://example.com\", \"template\": \"Roles - {{title}}\"}, \"description\": \"This is the roles page\"}', 9, 10, 4),
(7, 'users', 'Users', 'route.configuration.users', 1, 1, 0, 0, '2025-05-12 21:51:31.645938', '2025-05-13 04:53:17.833888', NULL, 0, 'protected', '/configuration/users', NULL, 3, 0, 1, 0, '{\"title\": {\"default\": \"Users\", \"absolute\": \"https://example.com\", \"template\": \"Users - {{title}}\"}, \"description\": \"This is the roles page\"}', 11, 12, 4),
(8, 'routes', 'Routes', 'route.configuration.routes', 1, 1, 0, 0, '2025-05-12 21:52:20.061097', '2025-05-13 04:53:22.511711', NULL, 0, 'protected', '/configuration/routes', NULL, 4, 0, 1, 0, '{\"title\": {\"default\": \"Routes\", \"absolute\": \"https://example.com\", \"template\": \"Routes - {{title}}\"}, \"description\": \"This is the routes page\"}', 13, 14, 4),
(9, 'i18n', 'I18n', 'route.configuration.i18n', 1, 1, 0, 0, '2025-05-12 21:53:16.103579', '2025-05-13 04:53:27.018603', NULL, 0, 'protected', '/configuration/i18n', NULL, 5, 0, 1, 0, '{\"title\": {\"default\": \"I18n\", \"absolute\": \"https://example.com\", \"template\": \"I18n - {{title}}\"}, \"description\": \"This is the i18n page\"}', 15, 16, 4);

-- --------------------------------------------------------

--
-- Table structure for table `route_has_permissions`
--

CREATE TABLE `route_has_permissions` (
  `route_id` int NOT NULL,
  `permission_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `route_has_permissions`
--

INSERT INTO `route_has_permissions` (`route_id`, `permission_id`) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `created_by` int NOT NULL DEFAULT '0',
  `updated_by` int NOT NULL DEFAULT '0',
  `deleted_by` int NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime DEFAULT NULL,
  `deleted` int NOT NULL DEFAULT '0',
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `isSuperAdmin` int NOT NULL DEFAULT '0',
  `message_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `slug`, `name`, `status`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`, `deleted`, `email`, `password`, `isSuperAdmin`, `message_id`) VALUES
(1, 'john-doe', 'John Doe 2', 1, 0, 0, 0, '2025-05-02 17:45:19.072448', '2025-05-02 19:11:04.000000', NULL, 0, 'john.doe@gmail.com', '$2b$08$cXCPt1bWHsq0pv/q/TVbmeo0UDOLC4uaDplzaK8aPdOqyxMCxcRDS', 1, NULL);

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
(1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_240853a0c3353c25fb12434ad3` (`name`),
  ADD UNIQUE KEY `IDX_3379e3b123dac5ec10734b8cc8` (`slug`),
  ADD KEY `IDX_3b8b97af9d9d8807e41e6f4836` (`id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_ae4578dcaed5adff96595e6166` (`name`),
  ADD UNIQUE KEY `IDX_35c9b140caaf6da09cfabb0d67` (`slug`),
  ADD KEY `IDX_b36bcfe02fc8de3c57a8b2391c` (`id`);

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
  ADD KEY `IDX_08affcd076e46415e5821acf52` (`id`),
  ADD KEY `FK_2bf40bee2cce314e08c93d995dd` (`parentId`);

--
-- Indexes for table `route_has_permissions`
--
ALTER TABLE `route_has_permissions`
  ADD PRIMARY KEY (`route_id`,`permission_id`),
  ADD KEY `IDX_66ff4403037962ee3ec1105dc6` (`route_id`),
  ADD KEY `IDX_ea46e0b428cc56bc70eeb00978` (`permission_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_065d4d8f3b5adb4a08841eae3c` (`name`),
  ADD UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`),
  ADD UNIQUE KEY `IDX_ac08b39ccb744ea6682c0db1c2` (`slug`),
  ADD KEY `IDX_cace4a159ff9f2512dd4237376` (`id`);

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `route`
--
ALTER TABLE `route`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
