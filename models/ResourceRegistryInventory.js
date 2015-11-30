/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ResourceRegistryInventory', { 
    ResourceRegistryInventoryID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ResourceRegistryID: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    ResourceTypeID: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    Qty: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    QtyUnitOfMeasure: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
};