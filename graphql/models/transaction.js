'use strict';
import { Sequelize, DataTypes } from "sequelize";

const transactionModel = {
  definition: {
    chain: { type: DataTypes.INTEGER, primaryKey: true },
    id: { type: DataTypes.INTEGER, primaryKey: true },
    height: { type: DataTypes.BIGINT },
    blockHash: { type: DataTypes.STRING(64) },
    type: { type: DataTypes.STRING(64) },
    subType: { type: DataTypes.TEXT },
    event: { type: DataTypes.STRING(64) },
    addData: { type: DataTypes.TEXT },
    timestamp: { type: DataTypes.NOW },
    specVersion: { type: DataTypes.STRING(64) },
    transactionVersion: { type: DataTypes.STRING(64) },
    authorId: { type: DataTypes.STRING(64) },
    senderId: { type: DataTypes.STRING(64) },
    recipientId: { type: DataTypes.STRING(64) },
    amount: { type: DataTypes.BIGINT },
    totalFee: { type: DataTypes.BIGINT },
    feeBalances: { type: DataTypes.BIGINT },
    feeTreasury: { type: DataTypes.BIGINT },
    tip: { type: DataTypes.BIGINT },
    success: { type: DataTypes.BOOLEAN },
  },
  options: {
    tableName: 'Transactions',
    timestamps: false,
    createdAt: false,
    updatedAt: false
  }
}

export { transactionModel }
