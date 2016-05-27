/**
 * Created by major on 5/23/16.
 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('HXLTransformation', {
        HXLTransID: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        HelpNowTable: {
            type: DataTypes.STRING,
            allowNull: true
        },
        HelpNowAttribute: {
            type: DataTypes.STRING,
            allowNull: true
        },
        HXLTransHashtag: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
};