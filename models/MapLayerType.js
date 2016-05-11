/**
 * Created by major on 5/11/16.
 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('MapLayerType', {
        MapLayerTypeID: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
};