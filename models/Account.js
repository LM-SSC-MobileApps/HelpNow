/* jshint indent: 2 */
var bcrypt = require("bcrypt-nodejs");

module.exports = function(sequelize, DataTypes) {
  var Account = sequelize.define('Account', { 
    AccountID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    LastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    FirstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    MiddleInitial: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    CreateDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('NOW')
    },
    Phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    MobilePhone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    AccountRoleID: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    AddressID: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    OrganizationID: {
      type: DataTypes.INTEGER(11),
      allowNull: true
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
      validatePassword: function (pwToValidate, cb) {
        if (this.getDataValue('IsHashed'))
        {
          bcrypt.compare(pwToValidate, this.getDataValue('Password'), function (err, isMatch) {
            if (err) {
              return cb(err);
            }
            cb(null, isMatch);
          });
        }
        else
        {
          if (pwToValidate === this.getDataValue('Password'))
          {
            return cb(null, true);
          }
          else
          {
            return cb(null, false);
          }
        }
      },
      getFullName: function () {
        return [this.FirstName, this.LastName].join(' ');
      }
    }
  });



  Account.beforeCreate(function(account, options) {
    //hash the password
    account.Password = bcrypt.hashSync(account.Password, bcrypt.genSaltSync(8));
    account.IsHashed = true;
  });
  Account.beforeUpdate(function(account, options) {
    //hash the password
    account.Password = bcrypt.hashSync(account.Password, bcrypt.genSaltSync(8));
    account.IsHashed = true;
  });

  return Account;
};
