/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('EventLocation', { 
    EventLocationID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    EventID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    LAT: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    LONG: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Radius: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    }
  });
};
