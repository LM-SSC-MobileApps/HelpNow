/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Organization', { 
    OrganizationID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    OrganizationTypeID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    }
  });
};
