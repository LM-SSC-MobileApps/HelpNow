/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ResourceRequest', { 
    ResourceRequestID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ResourceRegistryID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    EventID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    RequestStateID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    Notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Quantity: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true,
    },
    ResourceTypeID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    LAT: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LONG: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    RequestUrgencyID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    AreaSize: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: true
    },
    UnitOfMeasure: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    RequestorName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    RequestorPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    RequestorEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    RequestorUpdatePref: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    }
  });
};
