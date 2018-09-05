'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: 3,
          msg: 'Name must be 3 characters length'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: 'Is not a valid email'
        }
      }
    },
    password_digest: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    underscored: true,
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};