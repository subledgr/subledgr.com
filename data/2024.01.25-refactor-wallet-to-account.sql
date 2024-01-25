
CREATE TABLE `account` (
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


CREATE TABLE `account_balance` (
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
  CONSTRAINT `account_balance_ibfk_1` FOREIGN KEY (`id`) REFERENCES `account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `portfolio_account` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `accountId` char(36) NOT NULL,
  `portfolioId` char(36) NOT NULL,
  PRIMARY KEY (`accountId`,`portfolioId`),
  KEY `portfolio_wallet_ibfk_2` (`portfolioId`),
  CONSTRAINT `portfolio_account_ibfk_1` FOREIGN KEY (`accountId`) REFERENCES `account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `portfolio_account_ibfk_2` FOREIGN KEY (`portfolioId`) REFERENCES `portfolio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
)

INSERT INTO `account` (`id`, `name`, `assetId`, `address`, `userId`, `createdAt`, `updatedAt`)
select * from wallet;

insert into account_balance (
  `id`,
  `blockNumber`,
  `timestamp`,
  `free`,
  `reserved`,
  `pooled`,
  `claimable`,
  `locked`,
  `balance`,
  `createdAt`,
  `updatedAt`
 )
select * from wallet_balance;

insert into portfolio_account (
  `createdAt`,
  `updatedAt`,
  `accountId`,
  `portfolioId`
)
select * from portfolio_wallet;

-- drop tables!!