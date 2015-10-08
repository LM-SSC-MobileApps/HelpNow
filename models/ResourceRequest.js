/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ResourceRequest', { 
    ResourceRequestID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    ResourceRegistryID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    EventID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    RequestStateID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    Notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Quantity: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true,
    }
  });
};
