/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Event', { 
    EventID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    EventTypeID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    OrganizationID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    Summary: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    CreateDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.fn("NOW")
    },
    Keywords: {
      type: DataTypes.STRING,
      allowNull: true
    },
    HeatmapMin: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    HeatmapMax: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
  });
};
