'use strict';
import { Sequelize, DataTypes } from "sequelize";

const walletModel = {
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
      defaultValue: Sequelize.literal('UUID()'),
      primaryKey: true
    },
    name: { type: DataTypes.STRING(64) },
    assetId: { type: DataTypes.STRING(32), allowNull: false },
    address: { type: DataTypes.STRING(64), allowNull: false },
    balance: { type: DataTypes.BIGINT, defaultValue: 0 },
    // status: { type: DataTypes.STRING(16) },
    // multiaddrs: { type: DataTypes.JSON }
    userId: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  },
  options: {
    tableName: 'wallet',
    timestamps: true,
    createdAt: true,
    updatedAt: true
  }
}

export { walletModel }
