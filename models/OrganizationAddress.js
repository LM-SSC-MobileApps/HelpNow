/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('OrganizationAddress', { 
    OrganizationID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    AddressID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    PrimaryPOC: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    SecondaryPOC: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
