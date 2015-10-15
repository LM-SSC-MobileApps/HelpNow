/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ResourceResponse', { 
    ResourceResponseID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ResourceRequestID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    ResponseStateID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    }
  });
};
