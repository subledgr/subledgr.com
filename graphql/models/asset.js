'use strict';
import { DataTypes } from "sequelize";

const assetModel = {
  definition: {
    // id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id: { type: DataTypes.STRING(32), primaryKey: true },
    code: { type: DataTypes.STRING(16) },
    type: { type: DataTypes.STRING(16) },
    name: { type: DataTypes.STRING(64) },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
    parent: { type: DataTypes.STRING(32) },
    decimals: { type: DataTypes.INTEGER },
    symbol: { type: DataTypes.STRING(64) },
    symbolPosition: { type: DataTypes.SMALLINT, defaultValue: -1 },
    status: { type: DataTypes.STRING(16) },
    logo: { type: DataTypes.STRING(256) },
  },
  options: {
    tableName: 'asset',
    timestamps: true,
    createdAt: true,
    updatedAt: true
  }
}

export { assetModel }
