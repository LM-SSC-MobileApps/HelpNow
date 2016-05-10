/**
 * Created by major on 4/19/16.
 */
/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('BlockageSource', {
        BlockageSourceID: {
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
