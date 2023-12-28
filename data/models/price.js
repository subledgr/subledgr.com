import { DataTypes, Sequelize } from 'sequelize'

export const priceModel = {
  definition: {
    datetime: {
      type: DataTypes.STRING(32), // moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ') => 2023-09-25T22:20:32.538+01:00
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
    source: {
      type: DataTypes.STRING(64),
      allowNull: true,
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
