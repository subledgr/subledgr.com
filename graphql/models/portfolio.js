'use strict';
import { Model, DataTypes } from 'sequelize';

const portfolioModel = {
  definition: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(64) },
    currencyCode: { type: DataTypes.STRING(32) },
    // status: { type: DataTypes.STRING(16) },
    // multiaddrs: { type: DataTypes.JSON }
  },
  options: {
    tableName: 'portfolio',
    timestamps: true,
    createdAt: true,
    updatedAt: true
  }
}

export { portfolioModel }
