/**
 * Created by major on 4/19/16.
 */
/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Blockage', {
        BlockageID: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        BlockageSourceID: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        EventID: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        LAT: {
            type: DataTypes.STRING,
            allowNull: false
        },
        LONG: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ImageURL: {
            type: DataTypes.STRING,
            allowNull: true
        },
        CatID: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
};

