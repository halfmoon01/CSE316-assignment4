-- MySQL dump 10.13  Distrib 5.7.24, for osx10.9 (x86_64)
--
-- Host: localhost    Database: CSE316_HW4
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `CSE316_HW4`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `CSE316_HW4` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `CSE316_HW4`;

--
-- Table structure for table `facilities`
--

DROP TABLE IF EXISTS `facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `facilities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `available_days` varchar(255) NOT NULL,
  `min_capacity` int NOT NULL,
  `max_capacity` int NOT NULL,
  `location` varchar(10) NOT NULL,
  `only_for_suny` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facilities`
--

LOCK TABLES `facilities` WRITE;
/*!40000 ALTER TABLE `facilities` DISABLE KEYS */;
INSERT INTO `facilities` VALUES (1,'Gym','A place used for physical activity','https://res.cloudinary.com/dncizjyjo/image/upload/v1730358601/facilities/Gym.jpg','Mon, Tue, Wed, Thu, Fri, Sat, Sun',1,5,'A101',0),(2,'Auditorium','A place for large events','https://res.cloudinary.com/dncizjyjo/image/upload/v1730358603/facilities/Auditorium.jpg','Mon, Tue, Wed, Thu',1,40,'A234',0),(3,'Swimming Pool','A place for physical activity','https://res.cloudinary.com/dncizjyjo/image/upload/v1730359295/facilities/Swimming_Pool.jpg','Sun, Sat',1,8,'B403',0),(4,'Seminar Room','A place for large meetings','https://res.cloudinary.com/dncizjyjo/image/upload/v1730359297/facilities/Seminar_Room.jpg','Mon, Wed, Fri',1,10,'B253',0),(5,'Conference Room','A place for small but important meetings','https://res.cloudinary.com/dncizjyjo/image/upload/v1730359299/facilities/Conference_Room.jpg','Mon, Tue, Wed, Thu, Fri',1,10,'C1033',1),(6,'Library','A quiet place','https://res.cloudinary.com/dncizjyjo/image/upload/v1730359301/facilities/Library.jpg','Mon, Tue, Wed, Thu, Fri, Sat, Sun',1,20,'A1011',1);
/*!40000 ALTER TABLE `facilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reservation_date` date NOT NULL,
  `user_number` int NOT NULL,
  `facility_id` int NOT NULL,
  `purpose` text NOT NULL,
  `user_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (13,'2025-01-11',3,3,'swim','Lionel Messi'),(14,'2024-11-28',2,6,'study','Cristiano Ronaldo'),(15,'2025-01-08',33,2,'Seminar','David Beckham');
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'messi@gmail.com','4e076c53347d391e8da221bca871ba84f0aef59c2353359463477df242ee80b','Lionel Messi','https://res.cloudinary.com/dncizjyjo/image/upload/v1732716608/ij2pmy5evsrjcuktbe0m.jpg'),(2,'ronaldo@gmail.com','adfb12fd987422ddd49ed94f48e54db1339af938b10a732fe8bc79e64a7445f','Cristiano Ronaldo','https://res.cloudinary.com/dncizjyjo/image/upload/v1732715713/mtoi7azeq98zwd1f76jt.jpg'),(3,'david@gmail.com','20eaa8dee9adb0d7ad13ab40297f5a4e2617d51c6fb8c335c9cf1f3d9d4336a8','David Beckham','https://res.cloudinary.com/dncizjyjo/image/upload/v1732717228/boqu0zzez0w7k4agfrwd.jpg');
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

-- Dump completed on 2024-11-27 23:37:47
