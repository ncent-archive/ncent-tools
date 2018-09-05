'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    Name: {
      type: DataTypes.STRING, 
      allowNull: false,
      unique: false
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
  });
  sequelize.sync();
  return Chat;
};
