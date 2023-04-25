'use strict';
import { DataTypes } from "sequelize";

const currencyModel = {
  definition: {
    // id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING(32), primaryKey: true },
    name: { type: DataTypes.STRING(64) },
    symbol: { type: DataTypes.STRING(64) },
    symbolPosition: { type: DataTypes.SMALLINT, defaultValue: -1 },
    decimals: { type: DataTypes.INTEGER },
    status: { type: DataTypes.STRING(16) },
    // multiaddrs: { type: DataTypes.JSON }
  },
  options: {
    tableName: 'currency',
    timestamps: true,
    createdAt: true,
    updatedAt: true
  }
}

export { currencyModel }
