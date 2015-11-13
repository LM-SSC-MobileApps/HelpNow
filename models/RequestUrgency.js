/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RequestUrgency', { 
    RequestUrgencyID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Level: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
};
