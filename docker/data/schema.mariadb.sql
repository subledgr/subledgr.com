create DATABASE IF NOT EXISTS `subledgr`;

USE `subledgr`;

create user 'subledgr'@'%' identified by 'subledgr';
grant all privileges on subledgr.* to 'subledgr'@'%';


CREATE TABLE IF NOT EXISTS `asset` (
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
);


CREATE TABLE IF NOT EXISTS `currency` (
  `code` varchar(32) NOT NULL,
  `name` varchar(64) DEFAULT NULL,
  `symbol` varchar(64) DEFAULT NULL,
  `symbolPosition` smallint(6) DEFAULT -1,
  `decimals` int(11) DEFAULT NULL,
  `status` varchar(16) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`code`)
);


CREATE TABLE IF NOT EXISTS `portfolio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `currencyCode` varchar(32) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `portfolio_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS `portfolio_wallet` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `walletId` char(36) NOT NULL,
  `portfolioId` int(11) NOT NULL,
  PRIMARY KEY (`walletId`,`portfolioId`),
  KEY `portfolioId` (`portfolioId`),
  CONSTRAINT `portfolio_wallet_ibfk_1` FOREIGN KEY (`walletId`) REFERENCES `wallet` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `portfolio_wallet_ibfk_2` FOREIGN KEY (`portfolioId`) REFERENCES `portfolio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS `price` (
  `datetime` varchar(32) NOT NULL,
  `f_curr` varchar(24) NOT NULL,
  `t_curr` varchar(24) NOT NULL,
  `value` double DEFAULT 0,
  `source` varchar(24) NOT NULL,
  PRIMARY KEY (`datetime`,`f_curr`,`t_curr`),
  KEY `f_curr` (`f_curr`),
  CONSTRAINT `price_ibfk_1` FOREIGN KEY (`f_curr`) REFERENCES `asset` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS `profile` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dateTimeFormat` varchar(64) DEFAULT NULL,
  `defaultCurrency` varchar(64) DEFAULT NULL,
  `locale` varchar(64) DEFAULT NULL,
  `defaultDecimals` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `profile_ibfk_1` FOREIGN KEY (`id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(64) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL,
  `resetToken` varchar(64) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `user_asset` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) NOT NULL,
  `code` varchar(32) NOT NULL,
  PRIMARY KEY (`userId`,`code`),
  KEY `code` (`code`),
  CONSTRAINT `user_asset_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_asset_ibfk_2` FOREIGN KEY (`code`) REFERENCES `asset` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS `wallet` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `name` varchar(64) DEFAULT NULL,
  `assetId` varchar(32) NOT NULL,
  `address` varchar(64) NOT NULL,
  `userId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `assetId` (`assetId`),
  KEY `userId` (`userId`),
  CONSTRAINT `wallet_ibfk_1` FOREIGN KEY (`assetId`) REFERENCES `asset` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `wallet_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS `wallet_balance` (
  `id` char(36) NOT NULL,
  `blockNumber` bigint(20) NOT NULL,
  `timestamp` datetime NOT NULL,
  `free` bigint(20) DEFAULT 0,
  `reserved` bigint(20) DEFAULT 0,
  `pooled` bigint(20) DEFAULT 0,
  `claimable` bigint(20) DEFAULT 0,
  `locked` bigint(20) DEFAULT 0,
  `balance` bigint(20) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`,`blockNumber`),
  CONSTRAINT `wallet_balance_ibfk_1` FOREIGN KEY (`id`) REFERENCES `wallet` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

