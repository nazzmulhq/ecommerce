-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Nov 18, 2024 at 05:04 PM
-- Server version: 8.0.40
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Ecommerce`
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
(18, 'user.get-profile', 'user.get-profile', '2024-11-18 21:05:00.731448', '2024-11-18 21:05:00.731448', 1, 1, 1);

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
(1, 'admin', 'admin', '2024-11-17 23:18:03.358817', '2024-11-17 23:18:03.358817', 0, 0, 1),
(3, 'customer', 'customer', '2024-11-17 23:22:21.721056', '2024-11-17 23:47:14.096233', 0, 0, 1);

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
(1, 1),
(1, 2),
(1, 3),
(1, 5),
(1, 6),
(1, 7),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(3, 1),
(3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `route`
--

CREATE TABLE `route` (
  `id` varchar(36) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `type` enum('guest','shared','protected','devOnly') NOT NULL DEFAULT 'guest',
  `parentId` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `isComponent` tinyint NOT NULL DEFAULT '0',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `status` int NOT NULL DEFAULT '1',
  `nsleft` int NOT NULL DEFAULT '1',
  `nsright` int NOT NULL DEFAULT '2'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `route`
--

INSERT INTO `route` (`id`, `slug`, `type`, `parentId`, `name`, `path`, `isComponent`, `createdAt`, `updatedAt`, `status`, `nsleft`, `nsright`) VALUES
('7ac38576-7275-4bc9-9ddd-6efd2fd4edab', 'home', 'guest', NULL, 'Home', 'home', 0, '2024-11-18 22:29:28.526152', '2024-11-18 22:29:28.526152', 1, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `route_has_permissions`
--

CREATE TABLE `route_has_permissions` (
  `route_id` varchar(36) NOT NULL,
  `permission_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `route_has_permissions`
--

INSERT INTO `route_has_permissions` (`route_id`, `permission_id`) VALUES
('7ac38576-7275-4bc9-9ddd-6efd2fd4edab', 1),
('7ac38576-7275-4bc9-9ddd-6efd2fd4edab', 2);

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
  `status` int NOT NULL DEFAULT '1',
  `role_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `isSuperAdmin`, `createdAt`, `updatedAt`, `createBy`, `updateBy`, `status`, `role_id`) VALUES
(1, 'John Doe', 'john.doe@gmail.com', '$2a$08$wJJd7ArBsW7Lw3PeFCZrpO1XQ7za4zMlnyw3zn7/YfmPpFzJFJRGq', 0, '2024-11-17 21:35:56.004998', '2024-11-18 06:12:32.485617', 0, 0, 1, 1),
(3, 'John Doe 2', 'john.doe2@gmail.com', '$2a$08$QIIfHZjpuh4Vo2/S3l.ISu7AA9jWpB0ASK3Zgv4drrGEMXJ6ufmTi', 0, '2024-11-17 22:47:36.115719', '2024-11-17 23:34:55.573875', 0, 0, 1, 3);

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
  ADD PRIMARY KEY (`route_id`,`permission_id`),
  ADD KEY `IDX_66ff4403037962ee3ec1105dc6` (`route_id`),
  ADD KEY `IDX_ea46e0b428cc56bc70eeb00978` (`permission_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`),
  ADD KEY `FK_fb2e442d14add3cefbdf33c4561` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `permission`
--
ALTER TABLE `permission`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_fb2e442d14add3cefbdf33c4561` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
