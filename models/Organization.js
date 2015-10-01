/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Organization', { 
    OrganizationID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    TypeID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    }
  });
};
