'use strict';
import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'SECRET_KEY'

export class User extends Model {
  static async generateToken(user) {
    console.debug('generateToken', user.email)
    const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY);
    // console.debug('generateToken:', user.id, token);
    return token;
  }
  async comparePassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

const userModel = {
  User,
  definition: {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING(64) },
    password: { type: DataTypes.STRING(64) },
    resetToken: { type: DataTypes.STRING(64) },
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
        const salt = await bcrypt.genSalt(8)
        user.password = await bcrypt.hash(user.password, salt)
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(8)
          user.password = await bcrypt.hash(user.password, salt)
        }
      }
    }
  }
}

export { userModel }
