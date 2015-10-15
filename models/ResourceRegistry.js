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
      primaryKey: true,
      autoIncrement: true
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
    },
    EventID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  });
};
