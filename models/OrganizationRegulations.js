/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('OrganizationRegulations', { 
    OrganizationRegulationsID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    OrganizationID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    Summary: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Narrative: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
