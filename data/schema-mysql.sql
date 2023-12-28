# ************************************************************
# Sequel Ace SQL dump
# Version 20050
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: localhost (MySQL 5.5.5-10.4.21-MariaDB-1:10.4.21+maria~focal)
# Database: subledgr_dev
# Generation Time: 2023-09-25 21:38:30 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table asset
# ------------------------------------------------------------

DROP TABLE IF EXISTS `asset`;

CREATE TABLE `asset` (
  `id` varchar(32) NOT NULL,
  `code` varchar(16) DEFAULT NULL,
  `type` varchar(16) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `parent` varchar(32) DEFAULT NULL,
  `decimals` int(11) DEFAULT NULL,
  `symbol` varchar(64) DEFAULT NULL,
  `symbolPosition` smallint(6) DEFAULT -1,
  `status` varchar(16) DEFAULT NULL,
  `logo` varchar(256) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table binance
# ------------------------------------------------------------

DROP TABLE IF EXISTS `binance`;

CREATE TABLE `binance` (
  `f_curr` varchar(32) NOT NULL,
  `t_curr` varchar(32) NOT NULL,
  `open_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `open` decimal(30,12) DEFAULT NULL,
  `high` decimal(30,12) DEFAULT NULL,
  `low` decimal(30,12) DEFAULT NULL,
  `close` decimal(30,12) DEFAULT NULL,
  `volume` decimal(30,12) DEFAULT NULL,
  `close_time` timestamp NULL DEFAULT NULL,
  `quote_volume` decimal(30,12) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `taker_buy_volume` decimal(30,12) DEFAULT NULL,
  `taker_buy_quote_volume` decimal(30,12) DEFAULT NULL,
  `ignore` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`open_time`,`f_curr`,`t_curr`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table coingecko
# ------------------------------------------------------------

DROP TABLE IF EXISTS `coingecko`;

CREATE TABLE `coingecko` (
  `f_curr` varchar(20) NOT NULL,
  `t_curr` varchar(20) NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `price` decimal(20,16) DEFAULT NULL,
  `market_cap` decimal(28,14) DEFAULT NULL,
  `total_voilume` decimal(24,14) DEFAULT NULL,
  PRIMARY KEY (`f_curr`,`t_curr`,`datetime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table currency
# ------------------------------------------------------------

DROP TABLE IF EXISTS `currency`;

CREATE TABLE `currency` (
  `code` varchar(32) NOT NULL,
  `name` varchar(64) DEFAULT NULL,
  `symbol` varchar(64) DEFAULT NULL,
  `symbolPosition` smallint(6) DEFAULT -1,
  `decimals` int(11) DEFAULT NULL,
  `status` varchar(16) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table portfolio
# ------------------------------------------------------------

DROP TABLE IF EXISTS `portfolio`;

CREATE TABLE `portfolio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `currencyCode` varchar(32) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `portfolio_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table portfolio_wallet
# ------------------------------------------------------------

DROP TABLE IF EXISTS `portfolio_wallet`;

CREATE TABLE `portfolio_wallet` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `walletId` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `portfolioId` int(11) NOT NULL,
  PRIMARY KEY (`walletId`,`portfolioId`),
  KEY `portfolioId` (`portfolioId`),
  CONSTRAINT `portfolio_wallet_ibfk_1` FOREIGN KEY (`walletId`) REFERENCES `wallet` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `portfolio_wallet_ibfk_2` FOREIGN KEY (`portfolioId`) REFERENCES `portfolio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table price
# ------------------------------------------------------------

DROP TABLE IF EXISTS `price`;

CREATE TABLE `price` (
  `datetime` varchar(64) NOT NULL DEFAULT '0000-00-00 00:00:00',
  `f_curr` varchar(24) NOT NULL,
  `t_curr` varchar(24) NOT NULL,
  `value` double DEFAULT NULL,
  `source` varchar(24) DEFAULT NULL,
  PRIMARY KEY (`datetime`,`f_curr`,`t_curr`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table profile
# ------------------------------------------------------------

DROP TABLE IF EXISTS `profile`;

CREATE TABLE `profile` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dateTimeFormat` varchar(64) DEFAULT NULL,
  `defaultCurrency` varchar(64) DEFAULT NULL,
  `defaultDecimals` int(11) DEFAULT NULL,
  `locale` varchar(64) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `profile_ibfk_1` FOREIGN KEY (`id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table rates
# ------------------------------------------------------------

DROP TABLE IF EXISTS `rates`;

CREATE TABLE `rates` (
  `f_curr` varchar(32) NOT NULL DEFAULT '',
  `t_curr` varchar(32) NOT NULL DEFAULT '',
  `time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `open` decimal(30,12) DEFAULT NULL,
  `high` decimal(30,12) DEFAULT NULL,
  `low` decimal(30,12) DEFAULT NULL,
  `close` decimal(30,12) DEFAULT NULL,
  `vwap` decimal(30,12) DEFAULT NULL,
  `volume` decimal(30,12) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `source` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`f_curr`,`t_curr`,`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table Transactions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Transactions`;

CREATE TABLE `Transactions` (
  `chain` varchar(64) NOT NULL,
  `id` varchar(64) NOT NULL,
  `height` bigint(20) DEFAULT NULL,
  `blockHash` varchar(84) DEFAULT NULL,
  `type` varchar(64) DEFAULT NULL,
  `subType` varchar(64) DEFAULT NULL,
  `event` varchar(64) DEFAULT NULL,
  `addData` varchar(64) DEFAULT NULL,
  `timestamp` bigint(20) DEFAULT NULL,
  `specVersion` int(11) DEFAULT NULL,
  `transactionVersion` int(11) DEFAULT NULL,
  `authorId` varchar(64) DEFAULT NULL,
  `senderId` varchar(64) DEFAULT NULL,
  `recipientId` varchar(64) DEFAULT NULL,
  `amount` bigint(20) DEFAULT NULL,
  `totalFee` bigint(20) DEFAULT NULL,
  `feeBalances` bigint(20) DEFAULT NULL,
  `feeTreasury` bigint(20) DEFAULT NULL,
  `tip` bigint(20) DEFAULT NULL,
  `success` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`chain`,`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(64) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL,
  `resetToken` varchar(64) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table user_asset
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_asset`;

CREATE TABLE `user_asset` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) NOT NULL,
  `code` varchar(32) NOT NULL,
  PRIMARY KEY (`userId`,`code`),
  KEY `code` (`code`),
  CONSTRAINT `user_asset_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_asset_ibfk_2` FOREIGN KEY (`code`) REFERENCES `asset` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table wallet
# ------------------------------------------------------------

DROP TABLE IF EXISTS `wallet`;

CREATE TABLE `wallet` (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT uuid(),
  `name` varchar(64) DEFAULT NULL,
  `assetId` varchar(32) NOT NULL,
  `address` varchar(64) NOT NULL,
  `balance` bigint(20) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `assetId` (`assetId`),
  KEY `userId` (`userId`),
  CONSTRAINT `wallet_ibfk_1` FOREIGN KEY (`assetId`) REFERENCES `asset` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `wallet_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
