/**
 * Created by major on 4/25/16.
 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('SocialMedia', {
        SocialMediaID: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // EventID: {
        //     type: DataTypes.INTEGER(11),
        //     allowNull: false,
        // },
        LastRecordedID: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
};
