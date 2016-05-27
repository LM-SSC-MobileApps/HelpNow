/**
 * Created by major on 5/11/16.
 */


module.exports = function(sequelize, DataTypes) {
    return sequelize.define('MapLayer', {
        MapLayerID: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        OrganizationID: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        MapLayerTypeID: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        ImageryURL: {
            type: DataTypes.STRING,
            allowNull: true
        },
        MaxZoomLevel: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        MinZoomLevel: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        AttributionText: {
            type: DataTypes.STRING,
            allowNull: true
        },
        EventID: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        IsEsri: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        IsTSM: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        }

    });
};