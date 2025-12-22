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
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `calibration_sessions_grinder_id_foreign` (`grinder_id`),
  KEY `calibration_sessions_user_id_foreign` (`user_id`),
  KEY `calibration_sessions_session_date_index` (`session_date`),
  KEY `calibration_sessions_bean_id_session_date_index` (`bean_id`,`session_date`),
  CONSTRAINT `calibration_sessions_bean_id_foreign` FOREIGN KEY (`bean_id`) REFERENCES `beans` (`id`) ON DELETE CASCADE,
  CONSTRAINT `calibration_sessions_grinder_id_foreign` FOREIGN KEY (`grinder_id`) REFERENCES `grinders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `calibration_sessions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calibration_sessions`
--

LOCK TABLES `calibration_sessions` WRITE;
/*!40000 ALTER TABLE `calibration_sessions` DISABLE KEYS */;
INSERT INTO `calibration_sessions` VALUES (3,2,1,4,'2024-01-20','Updated: Successful calibration, locked in recipe','2025-12-17 03:51:55','2025-12-17 03:53:19');
/*!40000 ALTER TABLE `calibration_sessions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-22 14:09:14
