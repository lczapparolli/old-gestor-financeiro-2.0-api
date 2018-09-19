'use strict';
module.exports = (sequelize, DataTypes) => {
    const Access = sequelize.define('Access', {
        userId: DataTypes.INTEGER,
        accessUUID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        loginDate: DataTypes.DATE,
        lastRequest: DataTypes.DATE,
        userAgent: DataTypes.STRING,
        active: DataTypes.BOOLEAN
    }, {});
    Access.associate = function(models) {
        models.Access.belongsTo(models.User);
    };
    return Access;
};