/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ResponseState', { 
    ResponseStateID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
