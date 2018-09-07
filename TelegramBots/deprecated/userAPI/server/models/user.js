'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
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
  });
  sequelize.sync();
  return User;
};