/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('OrganizationGroup', { 
    OrganizationGroupID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    OrganizationID: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    AddressID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    PrimaryPOC: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    SecondaryPOC: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  });
};