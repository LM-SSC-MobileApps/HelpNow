/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Address', { 
    AddressID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    StreetNumber: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    StreetNumberPrefix: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    StreetName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    StreetNumberSuffix: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    StreetType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    StreetDirection: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    AddressType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    AddressTypeID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    MajorMunicipality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    MinorMunicipality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    GoverningDistrict: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    PostalArea: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Geo_Code: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
