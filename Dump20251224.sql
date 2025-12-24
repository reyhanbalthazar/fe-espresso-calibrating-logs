-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: espresso_calibrating_logs
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `beans`
--

DROP TABLE IF EXISTS `beans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beans` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `origin` varchar(150) DEFAULT NULL,
  `roastery` varchar(150) DEFAULT NULL,
  `roast_level` enum('light','medium','dark') DEFAULT NULL,
  `roast_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `coffee_shop_id` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `beans_coffee_shop_id_foreign` (`coffee_shop_id`),
  CONSTRAINT `beans_coffee_shop_id_foreign` FOREIGN KEY (`coffee_shop_id`) REFERENCES `coffee_shops` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beans`
--

LOCK TABLES `beans` WRITE;
/*!40000 ALTER TABLE `beans` DISABLE KEYS */;
INSERT INTO `beans` VALUES (1,'Ethiopia Guji','Ethiopia','XYZ Coffee','medium','2025-12-12','Floral, tea-like','2025-12-17 00:28:47','2025-12-23 10:15:14',3),(2,'Colombia Huila','Colombia','ABC Roasters','light','2025-12-09','Citrus, berry notes','2025-12-17 00:28:47','2025-12-17 00:28:47',NULL),(7,'Kerinci Anaerobic','Indonesia','Nitro Coffee Roasters','medium','2025-12-10','Spices, Floral','2025-12-23 03:16:49','2025-12-23 03:16:49',3);
/*!40000 ALTER TABLE `beans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calibration_sessions`
--

DROP TABLE IF EXISTS `calibration_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calibration_sessions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `bean_id` bigint(20) unsigned NOT NULL,
  `grinder_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `session_date` date NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `coffee_shop_id` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `calibration_sessions_grinder_id_foreign` (`grinder_id`),
  KEY `calibration_sessions_user_id_foreign` (`user_id`),
  KEY `calibration_sessions_session_date_index` (`session_date`),
  KEY `calibration_sessions_bean_id_session_date_index` (`bean_id`,`session_date`),
  KEY `calibration_sessions_coffee_shop_id_foreign` (`coffee_shop_id`),
  CONSTRAINT `calibration_sessions_bean_id_foreign` FOREIGN KEY (`bean_id`) REFERENCES `beans` (`id`) ON DELETE CASCADE,
  CONSTRAINT `calibration_sessions_coffee_shop_id_foreign` FOREIGN KEY (`coffee_shop_id`) REFERENCES `coffee_shops` (`id`) ON DELETE CASCADE,
  CONSTRAINT `calibration_sessions_grinder_id_foreign` FOREIGN KEY (`grinder_id`) REFERENCES `grinders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `calibration_sessions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calibration_sessions`
--

LOCK TABLES `calibration_sessions` WRITE;
/*!40000 ALTER TABLE `calibration_sessions` DISABLE KEYS */;
INSERT INTO `calibration_sessions` VALUES (5,1,2,8,'2025-12-22','Morning Calibration','2025-12-22 03:44:51','2025-12-23 10:17:50',3);
/*!40000 ALTER TABLE `calibration_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coffee_shops`
--

DROP TABLE IF EXISTS `coffee_shops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coffee_shops` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coffee_shops`
--

LOCK TABLES `coffee_shops` WRITE;
/*!40000 ALTER TABLE `coffee_shops` DISABLE KEYS */;
INSERT INTO `coffee_shops` VALUES (3,'Balthazar Cafe','Pamulang','085817380437','reyhanbalthazarepsa@gmail.com','2025-12-23 10:14:41','2025-12-23 10:14:41');
/*!40000 ALTER TABLE `coffee_shops` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grinders`
--

DROP TABLE IF EXISTS `grinders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grinders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `model` varchar(150) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `coffee_shop_id` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `grinders_coffee_shop_id_foreign` (`coffee_shop_id`),
  CONSTRAINT `grinders_coffee_shop_id_foreign` FOREIGN KEY (`coffee_shop_id`) REFERENCES `coffee_shops` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grinders`
--

LOCK TABLES `grinders` WRITE;
/*!40000 ALTER TABLE `grinders` DISABLE KEYS */;
INSERT INTO `grinders` VALUES (1,'EK43','Mahlkönig EK43','Updated: Excellent for single dosing, minimal static','2025-12-17 00:28:47','2025-12-23 10:15:32',3),(2,'Mythos One','Nuova Simonelli Mythos One','Training bar','2025-12-17 00:28:47','2025-12-23 10:18:17',3),(3,'Niche Zero','Niche Zero','Single dose grinder, low retention','2025-12-17 01:22:44','2025-12-17 01:22:44',NULL),(7,'Porlex','Hand Grinder','Manual Brew Hand Grinder','2025-12-23 03:16:08','2025-12-23 03:16:08',3);
/*!40000 ALTER TABLE `grinders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2014_10_12_100000_create_password_reset_tokens_table',1),(2,'2019_08_19_000000_create_failed_jobs_table',1),(3,'2019_12_14_000001_create_personal_access_tokens_table',1),(4,'2025_12_17_070943_create_users_table',1),(5,'2025_12_17_070958_create_beans_table',1),(6,'2025_12_17_071002_create_grinders_table',1),(7,'2025_12_17_071005_create_calibration_sessions_table',1),(8,'2025_12_17_071008_create_shots_table',1),(9,'2025_12_23_055106_create_coffee_shops_table',2),(10,'2025_12_23_055200_add_coffee_shop_id_to_existing_tables',2),(11,'2025_12_23_055323_create_coffee_shop_user_table',2),(12,'2025_12_23_095200_create_coffee_shops_table',3),(13,'2025_12_23_095236_add_coffee_shop_id_to_users_table',3),(14,'2025_12_23_095254_add_coffee_shop_id_to_beans_table',3),(15,'2025_12_23_095314_add_coffee_shop_id_to_grinders_table',3),(16,'2025_12_23_095337_add_coffee_shop_id_to_calibration_sessions_table',3),(17,'2025_12_23_095356_add_index_to_shots_table_for_performance',3);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (4,'App\\Models\\User',8,'auth-token','6099ff0fd1e12c7ee0c5e160fd22bdd46c9c775781e20251b487ecd784900989','[\"*\"]','2025-12-23 20:07:23',NULL,'2025-12-23 02:40:42','2025-12-23 20:07:23');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shots`
--

DROP TABLE IF EXISTS `shots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shots` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `calibration_session_id` bigint(20) unsigned NOT NULL,
  `shot_number` int(11) NOT NULL,
  `grind_setting` varchar(50) NOT NULL,
  `dose` decimal(5,2) NOT NULL,
  `yield` decimal(5,2) NOT NULL,
  `time_seconds` int(11) NOT NULL,
  `taste_notes` text DEFAULT NULL,
  `action_taken` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `shots_calibration_session_id_shot_number_unique` (`calibration_session_id`,`shot_number`),
  KEY `shots_calibration_session_id_index` (`calibration_session_id`),
  CONSTRAINT `shots_calibration_session_id_foreign` FOREIGN KEY (`calibration_session_id`) REFERENCES `calibration_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shots`
--

LOCK TABLES `shots` WRITE;
/*!40000 ALTER TABLE `shots` DISABLE KEYS */;
INSERT INTO `shots` VALUES (1,5,1,'15',20.00,40.00,30,'too bitter','grind coarser','2025-12-22 03:45:28','2025-12-22 03:45:28'),(2,5,2,'16',20.00,40.00,28,'too thin','dec yield','2025-12-22 03:45:50','2025-12-22 03:45:50'),(10,5,3,'16',20.00,38.00,27,'too thin','dec yield','2025-12-22 03:57:00','2025-12-22 03:57:00'),(11,5,4,'16',20.00,36.00,26,'perfect','lock','2025-12-22 03:57:44','2025-12-22 03:57:44');
/*!40000 ALTER TABLE `shots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `coffee_shop_id` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_coffee_shop_id_foreign` (`coffee_shop_id`),
  CONSTRAINT `users_coffee_shop_id_foreign` FOREIGN KEY (`coffee_shop_id`) REFERENCES `coffee_shops` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin Barista','admin@espresso.com',NULL,'$2y$12$ySLEazvr6CwK/eo9c2OgbOCrhDjvHcCMLXL.tCpsvFrmaC.wL031m',NULL,'2025-12-17 00:28:47','2025-12-17 00:28:47',NULL),(2,'Test Barista','barista@test.com',NULL,'$2y$12$.JPXS51CU3TScI5zt6022.jmHxHI90Neif6/toL2FKjL7XwXPMcei',NULL,'2025-12-17 00:33:53','2025-12-17 00:33:53',NULL),(3,'Test Barista','barista2@test.com',NULL,'$2y$12$DXUIINQPs/ZpP31J7e.lMuQdnFtrPvZEjgbMWnAHTWxdzI7bvXAva',NULL,'2025-12-17 00:35:16','2025-12-17 00:35:16',NULL),(4,'Test Barista','barista3@test.com',NULL,'$2y$12$Sx2ggrCcAuaJz4f3ruGSv.4mF79GdhIBVBzchjeovBFbuEsrn5jXu',NULL,'2025-12-17 00:36:17','2025-12-17 00:36:17',NULL),(5,'Test Barista','barista4@test.com',NULL,'$2y$12$1kOumTvCaCZizTeXQgSRe.w7hE/qEIz0gIuSr/uM/eJF/8V5A2u8C',NULL,'2025-12-17 00:36:34','2025-12-17 00:36:34',NULL),(6,'Test Barista','barista5@test.com',NULL,'$2y$12$iZ8Nm7/Hv5dtEXXRFalPee6k/HUbmmBo75JGXg17WZ1hFfZm5LxK2',NULL,'2025-12-17 00:50:51','2025-12-17 00:50:51',NULL),(7,'Test Barista','barista6@test.com',NULL,'$2y$12$opIVYHNWVFUKkVKwuQczmeqa0DO4OmvoshAFwNH.bdp5NCYV/fYse',NULL,'2025-12-17 02:54:25','2025-12-17 02:54:25',NULL),(8,'barista','barista7@test.com',NULL,'$2y$12$JGY2oirPLvalAa4niNmkCuIfQmMwjFVXWZrwjPqe9tgxBOmEWa3py',NULL,'2025-12-18 00:20:43','2025-12-23 10:14:59',3),(9,'barista','barista8@test.com',NULL,'$2y$12$GIUYfqMsWK4L8hEdP5lOluERu7nf0GofFEwjk0kfvDqEpWJA0jayK',NULL,'2025-12-18 00:43:56','2025-12-18 00:43:56',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-24 10:08:02
