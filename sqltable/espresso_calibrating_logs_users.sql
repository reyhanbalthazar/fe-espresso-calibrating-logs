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
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin Barista','admin@espresso.com',NULL,'$2y$12$ySLEazvr6CwK/eo9c2OgbOCrhDjvHcCMLXL.tCpsvFrmaC.wL031m',NULL,'2025-12-17 00:28:47','2025-12-17 00:28:47'),(2,'Test Barista','barista@test.com',NULL,'$2y$12$.JPXS51CU3TScI5zt6022.jmHxHI90Neif6/toL2FKjL7XwXPMcei',NULL,'2025-12-17 00:33:53','2025-12-17 00:33:53'),(3,'Test Barista','barista2@test.com',NULL,'$2y$12$DXUIINQPs/ZpP31J7e.lMuQdnFtrPvZEjgbMWnAHTWxdzI7bvXAva',NULL,'2025-12-17 00:35:16','2025-12-17 00:35:16'),(4,'Test Barista','barista3@test.com',NULL,'$2y$12$Sx2ggrCcAuaJz4f3ruGSv.4mF79GdhIBVBzchjeovBFbuEsrn5jXu',NULL,'2025-12-17 00:36:17','2025-12-17 00:36:17'),(5,'Test Barista','barista4@test.com',NULL,'$2y$12$1kOumTvCaCZizTeXQgSRe.w7hE/qEIz0gIuSr/uM/eJF/8V5A2u8C',NULL,'2025-12-17 00:36:34','2025-12-17 00:36:34'),(6,'Test Barista','barista5@test.com',NULL,'$2y$12$iZ8Nm7/Hv5dtEXXRFalPee6k/HUbmmBo75JGXg17WZ1hFfZm5LxK2',NULL,'2025-12-17 00:50:51','2025-12-17 00:50:51'),(7,'Test Barista','barista6@test.com',NULL,'$2y$12$opIVYHNWVFUKkVKwuQczmeqa0DO4OmvoshAFwNH.bdp5NCYV/fYse',NULL,'2025-12-17 02:54:25','2025-12-17 02:54:25'),(8,'barista','barista7@test.com',NULL,'$2y$12$JGY2oirPLvalAa4niNmkCuIfQmMwjFVXWZrwjPqe9tgxBOmEWa3py',NULL,'2025-12-18 00:20:43','2025-12-18 00:20:43'),(9,'barista','barista8@test.com',NULL,'$2y$12$GIUYfqMsWK4L8hEdP5lOluERu7nf0GofFEwjk0kfvDqEpWJA0jayK',NULL,'2025-12-18 00:43:56','2025-12-18 00:43:56');
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

-- Dump completed on 2025-12-22 14:09:14
