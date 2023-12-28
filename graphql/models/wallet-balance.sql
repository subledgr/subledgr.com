DROP TABLE IF EXISTS subledgr_dev.`wallet_balance`;

CREATE TABLE subledgr_dev.`wallet_balance` (
  `id` char(36) NOT NULL, -- DEFAULT uuid(), do not set a default value
  `blockNumber` bigint(20) NOT NULL,
  `timestamp` datetime NOT NULL,
  `free` bigint(20) DEFAULT 0,
  `reserved` bigint(20) DEFAULT 0,
  `pooled` bigint(20) DEFAULT 0,
  `claimable` bigint(20) DEFAULT 0,
  `balance` bigint(20) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`,`blockNumber`)
)
