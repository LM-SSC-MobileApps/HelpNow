/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ResourceLocationInventory', { 
    ResourceLocationInventoryID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ResourceLocationID: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    ResourceTypeID: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    Quantity: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    ResourceTypeUnitOfMeasureID: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  });
};