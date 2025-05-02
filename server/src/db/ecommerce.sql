-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: May 02, 2025 at 03:11 PM
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
  `bn_name` varchar(255) DEFAULT NULL,
  `status` int NOT NULL DEFAULT '1',
  `created_by` int NOT NULL DEFAULT '0',
  `updated_by` int NOT NULL DEFAULT '0',
  `deleted_by` int NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime DEFAULT NULL,
  `deleted` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `permission`
--

INSERT INTO `permission` (`id`, `slug`, `name`, `bn_name`, `status`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`, `deleted`) VALUES
(1, 'create', 'no-permission-required', NULL, 1, 0, 1, 0, '2025-05-02 18:22:52.489351', '2025-05-02 18:24:18.000000', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int NOT NULL,
  `slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `bn_name` varchar(255) DEFAULT NULL,
  `status` int NOT NULL DEFAULT '1',
  `created_by` int NOT NULL DEFAULT '0',
  `updated_by` int NOT NULL DEFAULT '0',
  `deleted_by` int NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime DEFAULT NULL,
  `deleted` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `slug`, `name`, `bn_name`, `status`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`, `deleted`) VALUES
(1, 'admin', 'admin', NULL, 1, 1, 0, 0, '2025-05-02 18:24:41.748512', '2025-05-02 18:24:41.748512', NULL, 0);

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
  `bn_name` varchar(255) DEFAULT NULL,
  `status` int NOT NULL DEFAULT '1',
  `created_by` int NOT NULL DEFAULT '0',
  `updated_by` int NOT NULL DEFAULT '0',
  `deleted_by` int NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` datetime DEFAULT NULL,
  `deleted` int NOT NULL DEFAULT '0',
  `type` enum('guest','shared','protected','devOnly') NOT NULL DEFAULT 'guest',
  `parent_id` int DEFAULT NULL,
  `path` varchar(255) NOT NULL,
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

INSERT INTO `route` (`id`, `slug`, `name`, `bn_name`, `status`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`, `deleted`, `type`, `parent_id`, `path`, `position`, `is_menu`, `is_sub_menu`, `is_dynamic_route`, `metadata`, `nsleft`, `nsright`, `parentId`) VALUES
(1, 'root', 'Root', NULL, 1, 1, 0, 0, '2025-05-02 19:29:03.603840', '2025-05-02 20:20:48.551216', NULL, 0, 'guest', NULL, '', 0, 1, 0, 0, '{\"title\": {\"default\": \"Root\", \"absolute\": \"https://example.com\", \"template\": \"Root - {{title}}\"}, \"description\": \"This is the home page\"}', 1, 20, NULL),
(4, 'configuration', 'Configuration', NULL, 1, 1, 0, 0, '2025-05-02 19:34:38.302790', '2025-05-02 20:20:10.140164', NULL, 0, 'protected', 1, 'configuration', 3, 1, 0, 0, '{\"title\": {\"default\": \"Configuration\", \"absolute\": \"https://example.com\", \"template\": \"Configuration - {{title}}\"}, \"description\": \"This is the Configuration page\"}', 2, 13, 1),
(5, 'permission', 'Permission', NULL, 1, 1, 0, 0, '2025-05-02 19:37:28.707825', '2025-05-02 20:18:27.416822', NULL, 0, 'protected', 4, '/permission', 1, 0, 1, 0, '{\"title\": {\"default\": \"Permission\", \"absolute\": \"https://example.com\", \"template\": \"Permission - {{title}}\"}, \"description\": \"This is the Permission page\"}', 3, 4, 4),
(6, 'role', 'Role', NULL, 1, 1, 0, 0, '2025-05-02 19:38:20.347913', '2025-05-02 20:18:24.472054', NULL, 0, 'protected', 4, '/role', 2, 0, 1, 0, '{\"title\": {\"default\": \"Role\", \"absolute\": \"https://example.com\", \"template\": \"Role - {{title}}\"}, \"description\": \"This is the Role page\"}', 5, 6, 4),
(7, 'user', 'User', NULL, 1, 1, 0, 0, '2025-05-02 19:38:53.469618', '2025-05-02 20:18:21.734647', NULL, 0, 'protected', 4, '/user', 3, 0, 1, 0, '{\"title\": {\"default\": \"User\", \"absolute\": \"https://example.com\", \"template\": \"User - {{title}}\"}, \"description\": \"This is the User page\"}', 7, 8, 4),
(8, 'routes', 'Routes', NULL, 1, 1, 0, 0, '2025-05-02 19:39:26.930929', '2025-05-02 20:18:15.564203', NULL, 0, 'protected', 4, '/routes', 4, 0, 1, 0, '{\"title\": {\"default\": \"Routes\", \"absolute\": \"https://example.com\", \"template\": \"Routes - {{title}}\"}, \"description\": \"This is the Routes page\"}', 9, 10, 4),
(9, 'login', 'Login', NULL, 1, 1, 0, 0, '2025-05-02 19:40:01.790795', '2025-05-02 20:20:37.716806', NULL, 0, 'guest', 1, '/login', 1, 1, 0, 0, '{\"title\": {\"default\": \"Login\", \"absolute\": \"https://example.com\", \"template\": \"Login - {{title}}\"}, \"description\": \"This is the Login page\"}', 14, 15, 1),
(10, 'i18n', 'I18n', NULL, 1, 1, 0, 0, '2025-05-02 19:41:23.081434', '2025-05-02 20:20:39.203083', NULL, 0, 'guest', 1, '/i18n', 2, 1, 0, 0, '{\"title\": {\"default\": \"I18n\", \"absolute\": \"https://example.com\", \"template\": \"I18n - {{title}}\"}, \"description\": \"This is the I18n page\"}', 16, 17, 1),
(11, 'home', 'Home', NULL, 1, 1, 0, 0, '2025-05-02 19:45:46.449308', '2025-05-02 20:20:41.985904', NULL, 0, 'guest', 1, '/', 0, 1, 0, 0, '{\"title\": {\"default\": \"Home\", \"absolute\": \"https://example.com\", \"template\": \"Home - {{title}}\"}, \"description\": \"This is the Home page\"}', 18, 19, 1);

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
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `bn_name` varchar(255) DEFAULT NULL,
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
  `isSuperAdmin` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `slug`, `name`, `bn_name`, `status`, `created_by`, `updated_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`, `deleted`, `email`, `password`, `isSuperAdmin`) VALUES
(1, 'john-doe', 'John Doe 2', NULL, 1, 0, 0, 0, '2025-05-02 17:45:19.072448', '2025-05-02 19:11:04.000000', NULL, 0, 'john.doe@gmail.com', '$2b$08$cXCPt1bWHsq0pv/q/TVbmeo0UDOLC4uaDplzaK8aPdOqyxMCxcRDS', 1);

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
  ADD UNIQUE KEY `IDX_cc16047ba5141ec8dec50451df` (`name`),
  ADD UNIQUE KEY `IDX_1050f1bce08c8eb606e1a8607d` (`path`),
  ADD UNIQUE KEY `IDX_9c5e65ac97111c46de524f8177` (`slug`),
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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
