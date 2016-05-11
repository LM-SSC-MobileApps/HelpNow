/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Organization', { 
    OrganizationID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    OrganizationTypeID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    AddressID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    PrimaryPOC: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    SecondaryPOC: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    APISecret: {
      type: DataTypes.STRING,
      allowNull: true
    },
    APIKey: {
        type: DataTypes.CHAR(40),
        allowNull: true
    },
    CreateDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: 'CURRENT_TIMESTAMP'
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }

  });
};
