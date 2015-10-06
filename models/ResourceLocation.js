/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ResourceLocation', { 
    ResourceLocationID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
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
    }
  });
};
