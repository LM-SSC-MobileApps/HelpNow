/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ResourceType', { 
    ResourceTypeID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
