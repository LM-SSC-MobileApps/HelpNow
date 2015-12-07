/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ResourceLocation', { 
    ResourceLocationID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ResourceRegistryID: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    LAT: {
      type: DataTypes.FLOAT(10,6),
      allowNull: true,
      validate: { min: -90, max: 90 }
    },
    LONG: {
      type: DataTypes.FLOAT(10,6),
      allowNull: true,
      validate: { min: -180, max: 1800 }
    },
    PhoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
};
