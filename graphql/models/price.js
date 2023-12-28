'use strict';
import { Sequelize, DataTypes } from "sequelize";

const priceModel = {
  definition: {
    // id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    // datetime: {
    //   primaryKey: true,
    //   allowNull: false,
    //   // defaultValue: Sequelize.literal("gen_random_uuid()"),
    //   type: DataTypes.STRING(24),
    // },
    datetime: {
      type: DataTypes.STRING(32), // moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ') => 2023-09-25T22:20:32.538+01:00
      allowNull: false,
      primaryKey: true,
    },

    f_curr: {
      type: DataTypes.STRING(24),
      allowNull: false,
      primaryKey: true,
    },
    t_curr: {
      type: DataTypes.STRING(24),
      allowNull: false,
      primaryKey: true,
    },
    value: { type: DataTypes.DOUBLE, defaultValue: 0 },
    source: { type: DataTypes.STRING(24), allowNull: false },
  },
  options: {
    tableName: 'price',
    timestamps: false,
    createdAt: false,
    updatedAt: false
  }
}

export { priceModel }
