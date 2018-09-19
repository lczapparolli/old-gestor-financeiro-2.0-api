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
        passwordDigest: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            set: function (value) {
                if ((typeof value === 'undefined') || (value === null)) {
                    this.setDataValue('passwordDigest', null);
                    this.setDataValue('password', null);
                } else {
                    this.setDataValue('passwordDigest', bcrypt.hashSync(value, 10));
                    this.setDataValue('password', '*'.repeat(value.length));
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
    }, { });
    User.associate = function () {
        // associations can be defined here
    };
    return User;
};