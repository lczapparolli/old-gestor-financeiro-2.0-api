'use strict';
module.exports = (sequelize, DataTypes) => {
    const Access = sequelize.define('Access', {
        userId: DataTypes.INTEGER,
        accessUUID: DataTypes.UUID,
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