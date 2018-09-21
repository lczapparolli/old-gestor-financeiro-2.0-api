'use strict';
module.exports = (sequelize, DataTypes) => {
    const Access = sequelize.define('Access', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        accessUUID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true
        },
        loginDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            validate: {
                futureDate(value) {
                    if (value > Date.now())
                        throw new Error('Future date is not allowed.');
                }
            }
        },
        lastRequest: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            validate: {
                futureDate(value) {
                    if (value > Date.now())
                        throw new Error('Future date is not allowed.');
                }
            }
        },
        userAgent: DataTypes.STRING,
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {});
    Access.associate = function(models) {
        models.Access.belongsTo(models.User);
    };
    return Access;
};