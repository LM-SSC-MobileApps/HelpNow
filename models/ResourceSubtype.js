/**
 * Created by mmajor on 5/31/16.
 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('ResourceSubtype', {
        ResourceSubtypeID: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ResourceTypeID: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
    });
};
