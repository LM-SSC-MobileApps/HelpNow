/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AccountRole', { 
    AccountRoleID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
