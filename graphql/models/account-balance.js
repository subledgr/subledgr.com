'use strict';
import { Sequelize, DataTypes } from "sequelize";

const accountBalanceModel = {
  definition: {
    // id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    // Postgres UUID
    // id: {
    //   type: Sequelize.UUID,
    //   primaryKey: true,
    //   allowNull: false,
    //   defaultValue: Sequelize.literal("gen_random_uuid()"),
    // },
    // MariaDB UUID
    id: {
      // type: DataTypes.UUID,
      type: DataTypes.CHAR(36),
      // defaultValue: Sequelize.literal('UUID()'), // do not set a default value for UUID
      primaryKey: true
    },
    blockNumber: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true },
    timestamp: { type: DataTypes.DATE, allowNull: false },
    // free: { type: DataTypes.BIGINT.UNSIGNED, defaultValue: 0 },
    // reserved: { type: DataTypes.BIGINT.UNSIGNED, defaultValue: 0 },
    // pooled: { type: DataTypes.BIGINT.UNSIGNED, defaultValue: 0 },
    // claimable: { type: DataTypes.BIGINT.UNSIGNED, defaultValue: 0 },
    // locked: { type: DataTypes.BIGINT.UNSIGNED, defaultValue: 0 },
    // balance: { type: DataTypes.BIGINT.UNSIGNED, defaultValue: 0 },
    // acala has 12 decimals, moonbeam has 18... so we need to use DECIMAL
    free: { type: DataTypes.DECIMAL(40,0), defaultValue: 0 },
    reserved: { type: DataTypes.DECIMAL(40,0), defaultValue: 0 },
    pooled: { type: DataTypes.DECIMAL(40,0), defaultValue: 0 },
    claimable: { type: DataTypes.DECIMAL(40,0), defaultValue: 0 },
    locked: { type: DataTypes.DECIMAL(40,0), defaultValue: 0 },
    balance: { type: DataTypes.DECIMAL(40,0), defaultValue: 0 },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  },
  options: {
    tableName: 'account_balance',
    timestamps: true,
    // createdAt: true,
    // updatedAt: false
  }
}

export { accountBalanceModel }
