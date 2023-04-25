'use strict';
import { Sequelize, DataTypes } from "sequelize";

const walletModel = {
  definition: {
    // id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id: {
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      type: Sequelize.UUID,
    },
    name: { type: DataTypes.STRING(64) },
    currencyCode: { type: DataTypes.STRING(32), allowNull: false },
    address: { type: DataTypes.STRING(64), allowNull: false },
    balance: { type: DataTypes.BIGINT, defaultValue: 0 },
    // status: { type: DataTypes.STRING(16) },
    // multiaddrs: { type: DataTypes.JSON }
  },
  options: {
    tableName: 'wallet',
    timestamps: true,
    createdAt: true,
    updatedAt: true
  }
}

export { walletModel }
