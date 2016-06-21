/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ResourceRequest', { 
    ResourceRequestID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
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
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    ResourceTypeID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
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
    },
    CreateDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('NOW')
    }
  });
};
