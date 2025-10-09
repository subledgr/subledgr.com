'use strict';
import { DataTypes } from "sequelize";

const chainModel = {
  definition: {
    id: { type: DataTypes.STRING(32), primaryKey: true },
    name: { type: DataTypes.STRING(64) },
    // active: { type: DataTypes.BOOLEAN, defaultValue: true },
    // parent: { type: DataTypes.STRING(32) },
    // status: { type: DataTypes.STRING(16) },
    // logo: { type: DataTypes.STRING(256) },
  },
  options: {
    tableName: 'chain',
    timestamps: true,
    createdAt: false,
    updatedAt: false
  }
}

export { chainModel }
