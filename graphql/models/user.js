'use strict';
import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt'

const userModel = {
  definition: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING(64) },
    password: { type: DataTypes.STRING(64) },
    // services: { type: DataTypes.JSON },
    // status: { type: DataTypes.STRING(16) },
    // multiaddrs: { type: DataTypes.JSON }
  },
  options: {
    tableName: 'user',
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    defaultScope: {
      attributes: {
        exclude: ['password']
      }
    },
    scopes: {
      login: {}, // attributes: { include: ['email', 'password'] }
      new: { where: { status: 'new' } },
    },
    hooks: {
      beforeCreate: async (user) => {
        console.debug('beforeCreate', user)
        const salt = await bcrypt.genSalt(8)
        user.password = await bcrypt.hash(user.password, salt)
      }
    },
    instanceMethods: {
      // generateHash(password) {
      //   return bcrypt.hash(password, bcrypt.genSaltSync(8))
      // },
      comparePassword(password) {
        return bcrypt.compare(password, this.password)
      }
    },
  }
}

export { userModel }
