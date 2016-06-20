var models  = require('../models'),
    express = require('express');

//Account many-to-one on Organization
models.Account.belongsTo(models.Organization, {foreignKey: 'OrganizationID'});
models.Organization.hasMany(models.Account, {foreignKey: 'OrganizationID'});



var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.Account.findAll()
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
      )
      .catch(function (err) {
       console.error(err);
       res.statusCode = 400;
       res.send({
           result: 'error',
           err:    err.message
       });
      });
    }
  )
  //find Account by AccountID
  .get('/:id', function(req, res) {
      models.Account.findAll(
        {
          include: [
            {
              model: models.Organization
            }
          ],
          where: {
            AccountID: req.params.id,
            Active: true
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
       res.statusCode = 400;
       res.send({
           result: 'error',
           err:    err.message
       });
      });
    }
  )
  //find Account by Email
    .get('/email/:email', function(req, res) {
            models.Account.findAll(
                {
                    include: [
                        {
                            model: models.Organization
                        }
                    ],
                    where: {
                        Email: req.params.email,
                        Active: true
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
                res.statusCode = 400;
                res.send({
                    result: 'error',
                    err:    err.message
                });
            });
        }
    )

  //find Account by ID on session
  // .get('/accountid/', function(req, res) {
  //     console.log('here is our session account id: '+req.session.accountid);
  //     console.log('here is the sessionid: '+req.sessionID);
  //     models.Account.findAll(
  //       {
  //         include: [
  //           {
  //             model: models.Organization,
  //           }
  //         ],
  //         where: {
  //           AccountID: req.session.accountid
  //         }
  //       }
  //     ).then(function(account) {
  //       res.statusCode = 200;
  //       res.send(
  //         {
  //           result: 'success',
  //           err:    '',
  //           json:  account,
  //           length: account.length
  //         }
  //       );
  //     }
  //    ).catch(function (err) {
  //      console.error(err);
  //      res.statusCode = 400;
  //      res.send({
  //          result: 'error',
  //          err:    err.message
  //      });
  //     });
  //   }
  // )
  //find Accounts by organizationid
  .get('/organization/:id', function (req, res) {
      models.Account.findAll(
        {
            where: {
                OrganizationID: req.params.id,
                Active: true
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
              res.sendStatus(401);
            }
      }
     ).catch(function (err) {
         console.error(err);
         res.statusCode = 400;
         res.send({
             result: 'error',
             err: err.message
         });
     });
    }
  )
  //find organzation team members by accountid (will not include account passed by parameter)
  .get('/organizationmembers/:id', function (req, res) {
      models.Account.findAll(
        {
          include: [
            {
              model: models.Organization
            }
          ],
          where: {
            AccountID: req.params.id,
            Active: true
          }
        }
      ).then(function (account) {
          if (account.length>0)
          {
            models.Account.findAll({
                where: {
                  OrganizationID: account[0].OrganizationID,
                  Active: true
                }
              }
            ).then(function (team) {
                res.statusCode = 200;
                res.send(
                  {
                      result: 'success',
                      err: '',
                      json: team,
                      length: team.length
                  }
                );
              }
            );
          }
          else
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
        }
      ).catch(function (err) {
         console.error(err);
         res.statusCode = 400;
         res.send({
             result: 'error',
             err: err.message
         });
     });
    }
  )
  // find login which retrieves account
  .post('/login/', function (req, res) {

      models.Account.findAll(
          {
              include: [
                {
                  model: models.Organization
                }
              ],
              where: {
                  Username: req.body.username
              }
          }
        ).then(function(accounts) {
          if (accounts.length>0){
              accounts[0].validatePassword(req.body.password, function(err, isMatch)
              {
                  if (isMatch){
                      req.session.accountid =  accounts[0].AccountID;
                      req.session.organizationid =  accounts[0].OrganizationID;
                      res.statusCode = 200;
                      res.send(
                          {
                              result: 'success',
                              err: '',
                              json: accounts,
                              length: accounts.length
                          }
                      );
                  }
                  else {
                      res.sendStatus(401);
                  }

              });
          }
          else
          {
              res.sendStatus(401)
          }

          }
      ).catch(function (err) {
          console.error(err);
          res.statusCode = 400;
          res.send({
              result: 'error',
              err: err.message
          });
      });
    }
  )
  //find login which retrieves account
  .post('/external_login/', function (req, res) {
        models.Account.findAll(
          {
              include: [
                {
                  model: models.Organization
                }
              ],
              where: {
                  Email: req.body.email
              }
          }
        ).then(function (account) {
            if (account.length>0)
            {
              // var userSessionObject = {
              //       AccountID: account[0].AccountID,
              //       FirstName: account[0].FirstName,
              //       LastName: account[0].LastName,
              //       OrganizationID: account[0].Organization.OrganizationID,
              //       OrganizationName: account[0].Organization.Organization.Name
              //   }
              req.session.accountid =  account[0].AccountID;
              req.session.organizationid =  account[0].OrganizationID;
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
          res.statusCode = 400;
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
       res.statusCode = 400;
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
        individualHooks: true,
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
       res.statusCode = 400;
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
       res.statusCode = 400;
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