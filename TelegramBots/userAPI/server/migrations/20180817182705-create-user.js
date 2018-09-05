'use strict';
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(() => {
      return queryInterface.createTable('Users', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true, 
          allowNull: false,
          unique: true
        },
        username: {
          type: DataTypes.STRING
        },
        referrer: {
          type: DataTypes.INTEGER
        }
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE
        },
      });
    });
  },
  down: (queryInterface) => queryInterface.dropTable('Users'),
};
