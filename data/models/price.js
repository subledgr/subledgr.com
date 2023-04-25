import { DataTypes, Sequelize } from 'sequelize'

export const priceModel = {
  definition: {
    datetime: {
      type: DataTypes.STRING(128),
      allowNull: false,
      primaryKey: true,
    },
    f_curr: {
      type: DataTypes.STRING(32),
      allowNull: false,
      primaryKey: true,
    },
    t_curr: {
      type: DataTypes.STRING(32),
      allowNull: false,
      primaryKey: true,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    // createdAt: {
    //   type: DataTypes.DATE,
    //   allowNull: false,
    //   defaultValue: Sequelize.fn('now'),
    // },
    // updatedAt: {
    //   type: DataTypes.DATE,
    //   allowNull: false,
    //   defaultValue: Sequelize.fn('now'),
    // },
  },
  options: {
    tableName: 'price',
    timestamps: true,
    createdAt: false,
    updatedAt: false,
    // defaultScope: {
    //   attributes: {
    //     exclude: [],
    //   },
    //   order: [['id', 'ASC']],
    // },
  },
}
