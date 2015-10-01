/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ResourceRegistry', { 
    ResourceRegistryID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    OrganizationID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    TypeID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    Notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    LocationID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    }
  });
};
