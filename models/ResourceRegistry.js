/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ResourceRegistry', { 
    ResourceRegistryID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    OrganizationID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    ResourceTypeID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    Notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ResourceLocationID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    }
  });
};
