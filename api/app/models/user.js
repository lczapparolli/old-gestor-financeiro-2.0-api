'use strict';
const bcrypt = require('bcrypt');

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
        password_digest: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            set: function (value) {
                if ((typeof value === 'undefined') || (value === null)) {
                    this.setDataValue('password_digest', null);
                    this.setDataValue('password', null);
                } else {
                    this.setDataValue('password_digest', bcrypt.hashSync(value, 10));
                    this.setDataValue('password', value);
                }
            },
            validate: {
                len: {
                    args: 6,
                    msg: 'Password should be at least 6 characters long'
                }
            }
        },
        active: DataTypes.BOOLEAN
    }, 
    {
        underscored: true,
    });
    User.associate = function () {
        // associations can be defined here
    };
    return User;
};