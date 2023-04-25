'use strict';
import { Sequelize, DataTypes } from "sequelize";

const priceModel = {
  definition: {
    // id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    datetime: {
      primaryKey: true,
      allowNull: false,
      // defaultValue: Sequelize.literal("gen_random_uuid()"),
      type: DataTypes.STRING(24),
    },
    f_curr: { type: DataTypes.STRING(24), allowNull: false },
    t_curr: { type: DataTypes.STRING(23), allowNull: false },
    value: { type: DataTypes.DOUBLE, defaultValue: 0 },
  },
  options: {
    tableName: 'price',
    timestamps: false,
    createdAt: false,
    updatedAt: false
  }
}

export { priceModel }
