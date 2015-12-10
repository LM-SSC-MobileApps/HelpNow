
var models  = require('../models'),
    express = require('express');

//Account many-to-one on OrganizationGroup
models.Account.belongsTo(models.OrganizationGroup, {foreignKey: 'OrganizationGroupID'});
models.OrganizationGroup.hasMany(models.Account, {foreignKey: 'OrganizationGroupID'});

//OrganizationGroup many-to-One on Organization
models.Organization.hasMany(models.OrganizationGroup, {foreignKey: 'OrganizationID'});
models.OrganizationGroup.belongsTo(models.Organization, {foreignKey: 'OrganizationID'});


var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.Account.findAll()
        .then(function(account) {
          res.statusCode = 201;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  account,
              length: account.length
            }
          );
        }
      )
      .catch(function (err) {
       console.error(err);
       res.statusCode = 502;
       res.send({
           result: 'error',
           err:    err.message
       });
      });
    }
  )
  //find Account by ID
  .get('/accountid/', function(req, res) {
      models.Account.findAll(
        {
          where: {
            AccountID: req.session.accountid
          }
        }
      ).then(function(account) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  account,
            length: account.length
          }
        );
      }
     ).catch(function (err) {
       console.error(err);
       res.statusCode = 502;
       res.send({
           result: 'error',
           err:    err.message
       });
      });
    }
  )//find Accounts by organizationgroupid
  .get('/organizationgroup/', function (req, res) {
      models.Account.findAll(
        {
            where: {
                OrganizationGroupID: req.session.user.organizationgroupid
            }
        }
      ).then(function (account) {
          if (account.length>0)
            {
              res.statusCode = 200;
              res.send(
                {
                    result: 'success',
                    err: '',
                    json: account,
                    length: account.length
                }
              );
            }
            else
            {
              res.sendStatus(401)
            }
      }
     ).catch(function (err) {
         console.error(err);
         res.statusCode = 502;
         res.send({
             result: 'error',
             err: err.message
         });
     });
    }
  )
  //find Accounts by organizationgroupid
  // .get('/organizationgroup/:id', function (req, res) {
  //     models.Account.findAll(
  //       {
  //           where: {
  //               OrganizationGroupID: req.params.id
  //           }
  //       }
  //     ).then(function (account) {
  //         if (account.length>0)
  //           {
  //             res.statusCode = 200;
  //             res.send(
  //               {
  //                   result: 'success',
  //                   err: '',
  //                   json: account,
  //                   length: account.length
  //               }
  //             );
  //           }
  //           else
  //           {
  //             res.sendStatus(401)
  //           }
  //     }
  //    ).catch(function (err) {
  //        console.error(err);
  //        res.statusCode = 502;
  //        res.send({
  //            result: 'error',
  //            err: err.message
  //        });
  //    });
  //   }
  // )
  //find login which retrieves account
  .post('/login/', function (req, res) {
        models.Account.findAll(
          {
              include: [
                {
                  model: models.OrganizationGroup,
                  include: [
                    {
                      model: models.Organization
                    }
                  ]
                }
              ],
              where: {
                  Username: req.body.username,
                  Password: req.body.password
              }
          }
        ).then(function (account) {
            if (account.length>0)
            {
              res.statusCode = 200;
              res.send(
                {
                    result: 'success',
                    err: '',
                    json: account,
                    length: account.length
                }
              );
            }
            else
            {
              res.sendStatus(401)
            }
            
        }
      ).catch(function (err) {
          console.error(err);
          res.statusCode = 502;
          res.send({
              result: 'error',
              err: err.message
          });
      });
    }
  )
  //insert into Account
  .post('/', function(req, res) {
    models.Account.create(req.body)
    .then(function(account) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  account,
            length: account.length
          }
        );
      }
     ).catch(function (err) {
       console.error(err);
       res.statusCode = 502;
       res.send({
           result: 'error',
           err:    err.message
       });
      });
    }
  )
  //update into Account
  .put('/:id', function(req, res) {
    models.Account.update(
      req.body,
      {
        where: {
          AccountID: req.params.id
        }
      }
    )
    .then(function(rowsUpdated) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  {rows: rowsUpdated},
            length: rowsUpdated.length
          }
        );
      }
     ).catch(function (err) {
       console.error(err);
       res.statusCode = 502;
       res.send({
           result: 'error',
           error:  err.message
       });
      });
    }
  )
  .delete('/:id', function(req, res) {
    models.Account.destroy(
      {
        where: {
          AccountID: req.params.id
        }
      }
    )
    .then(function(numDelete) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  {rows: numDelete}
          }
        );
      }
     ).catch(function (err) {
       console.error(err);
       res.statusCode = 502;
       res.send({
           result: 'error',
           err:    err.message
       });
      });
    }
  );
  
  return router;
}

module.exports = routes;