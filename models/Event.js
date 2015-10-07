/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Event', { 
    EventID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    EventTypeID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    OrganizationID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    Summary: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    CreateDate: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  });
};
