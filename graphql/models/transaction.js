'use strict';
import { Sequelize, DataTypes } from "sequelize";

const transactionModel = {
  definition: {
    chainId: { type: DataTypes.STRING(64), primaryKey: true, field: 'chain_id' },
    id: { type: DataTypes.STRING(64), primaryKey: true },
    blockNumber: { type: DataTypes.BIGINT, field: 'block_number' },
    extrinsicId: { type: DataTypes.STRING(64), field: 'extrinsic_id' },
    extrinsicHash: { type: DataTypes.STRING(64), field: 'extrinsic_hash' },
    section: { type: DataTypes.TEXT },
    method: { type: DataTypes.STRING(64) },
    // addData: { type: DataTypes.TEXT },
    timestamp: { type: DataTypes.BIGINT },
    // specVersion: { type: DataTypes.STRING(64) },
    // transactionVersion: { type: DataTypes.STRING(64) },
    // authorId: { type: DataTypes.STRING(64) },
    fromId: { type: DataTypes.STRING(64), field: 'from_id' },
    toId: { type: DataTypes.STRING(64), field: 'to_id' },
    amount: { type: DataTypes.BIGINT },
    // totalFee: { type: DataTypes.BIGINT },
    // feeBalances: { type: DataTypes.BIGINT },
    // feeTreasury: { type: DataTypes.BIGINT },
    fee: { type: DataTypes.BIGINT },
    // tip: { type: DataTypes.BIGINT },
    // success: { type: DataTypes.BOOLEAN },
    // previous polka-store model...
    // chain: { type: DataTypes.STRING(64), primaryKey: true },
    // id: { type: DataTypes.STRING(64), primaryKey: true },
    // height: { type: DataTypes.BIGINT },
    // blockHash: { type: DataTypes.STRING(64) },
    // type: { type: DataTypes.STRING(64) },
    // subType: { type: DataTypes.TEXT },
    // event: { type: DataTypes.STRING(64) },
    // addData: { type: DataTypes.TEXT },
    // timestamp: { type: DataTypes.BIGINT },
    // specVersion: { type: DataTypes.STRING(64) },
    // transactionVersion: { type: DataTypes.STRING(64) },
    // authorId: { type: DataTypes.STRING(64) },
    // senderId: { type: DataTypes.STRING(64) },
    // recipientId: { type: DataTypes.STRING(64) },
    // amount: { type: DataTypes.BIGINT },
    // totalFee: { type: DataTypes.BIGINT },
    // feeBalances: { type: DataTypes.BIGINT },
    // feeTreasury: { type: DataTypes.BIGINT },
    // tip: { type: DataTypes.BIGINT },
    // success: { type: DataTypes.BOOLEAN },
  },
  options: {
    // tableName: 'Transactions',
    tableName: 'transfer',
    timestamps: false,
    createdAt: false,
    updatedAt: false
  }
}

export { transactionModel }
