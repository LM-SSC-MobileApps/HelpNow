/**
 * Created by mmajor on 6/20/16.
 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('AuthToken', {
        AuthTokenID: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        Value: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Username: {
            type: DataTypes.STRING,
            allowNull: true
        },
        APIKey: {
            type: DataTypes.CHAR(40),
            allowNull: true
        }
    });
};