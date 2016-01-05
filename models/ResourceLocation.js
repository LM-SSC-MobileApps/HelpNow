/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ResourceLocation', { 
    ResourceLocationID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    OrganizationID: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    ResourceLocationTypeID: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    ResourceLocationStatusID: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    EventID: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Notes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    LAT: {
      type: DataTypes.FLOAT(10,6),
      allowNull: false,
      validate: { min: -90, max: 90 }
    },
    LONG: {
      type: DataTypes.FLOAT(10,6),
      allowNull: false,
      validate: { min: -180, max: 1800 }
    },
    PrimaryPOCName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    PrimaryPOCPhone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    SecondaryPOCName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    SecondaryPOCPhone: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
};
