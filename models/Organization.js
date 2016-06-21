/* jshint indent: 2 */
var bcrypt = require("bcrypt-nodejs");

module.exports = function(sequelize, DataTypes) {
  var Organization = sequelize.define('Organization', {
    OrganizationID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    OrganizationTypeID: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    AddressID: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    PrimaryPOC: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    SecondaryPOC: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    APISecret: {
      type: DataTypes.STRING,
      allowNull: true
    },
    APIKey: {
        type: DataTypes.CHAR(40),
        allowNull: true
    },
    CreateDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('NOW')
    },
    Active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    IsHashed: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }

  }, {
    instanceMethods: {
      validateAPISecret: function (secretToValidate, cb) {
        if (this.getDataValue('IsHashed'))
        {
          bcrypt.compare(secretToValidate, this.getDataValue('APISecret'), function (err, isMatch) {
            if (err) {
              return cb(err);
            }
            cb(null, isMatch);
          });
        }
        else
        {
          if (secretToValidate === this.getDataValue('APISecret'))
          {
            return cb(null, true);
          }
          else
          {
            return cb(null, false);
          }
        }
      }
    }
  });

  Organization.beforeUpdate(function(org, options) {
    //hash the password
    org.APISecret = bcrypt.hashSync(org.APISecret, bcrypt.genSaltSync(8));
    org.IsHashed = true;
  });

  Organization.beforeCreate(function(org, options) {
    //hash the password
    org.APISecret = bcrypt.hashSync(org.APISecret, bcrypt.genSaltSync(8));
    org.IsHashed = true;
  });

  return Organization;
};
