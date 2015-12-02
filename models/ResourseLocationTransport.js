/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ResourceLocationTransport', { 
    ResourceLocationTransportID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ResourceLocationID: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    TransportTypeID: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  });
};