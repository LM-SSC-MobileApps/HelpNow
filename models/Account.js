/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Account', { 
    AccountID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    Username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    FirstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    MiddleInitial: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    Phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    MobilePhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    AccountRoleID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    AddressID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    }
  });
};
