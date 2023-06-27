'use strict';
import { Model, DataTypes } from 'sequelize';

const profileModel = {
  definition: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    dateTimeFormat: { type: DataTypes.STRING(64) },
    defaultCurrency: { type: DataTypes.STRING(64) },
    // resetToken: { type: DataTypes.STRING(64) },
  },
  options: {
    tableName: 'profile',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    // defaultScope: {
    //   attributes: {
    //     exclude: ['password']
    //   }
    // },
    // scopes: {
    //   login: {}, // attributes: { include: ['email', 'password'] }
    //   new: { where: { status: 'new' } },
    // },
    // hooks: {
    //   beforeCreate: async (user) => {
    //     const salt = await bcrypt.genSalt(8)
    //     user.password = await bcrypt.hash(user.password, salt)
    //   },
    //   beforeUpdate: async (user) => {
    //     if (user.changed('password')) {
    //       const salt = await bcrypt.genSalt(8)
    //       user.password = await bcrypt.hash(user.password, salt)
    //     }
    //   }
    // }
  }
}

export { profileModel }
