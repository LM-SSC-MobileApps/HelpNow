
var models  = require('../models'),
    express = require('express'),
    passport = require('passport');


var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.InviteRequest.findAll()
        .then(function(inviteRequest) {
          res.statusCode = 200;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  inviteRequest,
              length: inviteRequest.length
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
  //find InviteRequest by InviteID
  .get('/:inviteid', function(req, res) {
      models.InviteRequest.findAll(
        {
          where: {
            InviteID: req.params.inviteid
          }
        }
      ).then(function(inviteRequest) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  inviteRequest,
            length: inviteRequest.length
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
  //find all InviteRequests in an Organization by AccountID
  .get('/organizationinvites/:accountid', function (req, res) {
      models.Account.findAll(
        {
          include: [
            {
              model: models.Organization,
            }
          ],
          where: {
            AccountID: req.params.accountid,
            Active: true
          }
        }
      ).then(function (account) {
          if (account.length>0)
          {
            models.InviteRequest.findAll({
                where: {
                  OrganizationID: account[0].OrganizationID
                }
              }
            ).then(function (invities) {
                res.statusCode = 200;
                res.send(
                  {
                      result: 'success',
                      err: '',
                      json: invities,
                      length: invities.length
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
         res.statusCode = 502;
         res.send({
             result: 'error',
             err: err.message
         });
     });
    }
  )
  //insert into InviteRequest
  .post('/', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.InviteRequest.create(req.body)
    .then(function(result) {
        models.InviteRequest.findAll(
          {
            where: {
              InviteRequestID: result.InviteRequestID
            }
          }
        ).then(function(inviteRequest){
          res.statusCode = 200;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  inviteRequest,
              length: inviteRequest.length
            }
          );
        })
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
  //this is for the creation of an invite request with only the email address.  This will be user to create password resets.
    .post('/passwordreset/', function(req, res) {
            models.Account.find({
                where: {
                    Email: req.body.Email
                }
            }).then(function(account){
                if (account){

                    var invite = {
                        FirstName:account.FirstName,
                        LastName:account.LastName,
                        OrganizationID:account.OrganizationID,
                        Email:account.Email
                    }

                    models.InviteRequest.create(invite).then(function(result) {
                            models.InviteRequest.findAll(
                                {
                                    where: {
                                        InviteRequestID: result.InviteRequestID
                                    }
                                }
                            ).then(function(inviteRequest){
                                res.statusCode = 200;
                                res.send(
                                    {
                                        result: 'success',
                                        err:    '',
                                        json:  inviteRequest,
                                        length: inviteRequest.length
                                    }
                                );
                            })
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
                else {
                    res.statusCode = 200;
                    res.send(
                        {
                            result: 'success',
                            err:    'email does not exist',
                            json:  '',
                            length: 0
                        }
                    );
                }
            }).catch(function (err) {
                console.error(err);
                res.statusCode = 502;
                res.send({
                    result: 'error',
                    err: err.message
                });
            });
        }
    )
    //this is for the creation of an invite request with only the email address.  This will be user to create password resets.
    .post('/passwordupdate/', function(req, res) {
            models.InviteRequest.find({
                where: {
                    InviteID: req.body.InviteRequestID
                }
            }).then(function(invreq){
                if (invreq) {

                    models.Account.find({
                        where: {
                            Email: invreq.Email
                        }
                    }).then(function (account) {
                        var accountUpdate = {
                            Password:req.body.Password
                        }
                        if (account) {
                            models.Account.update(accountUpdate,
                                {
                                    individualHooks: true,
                                    where: {
                                        AccountID: account.AccountID
                                    }
                                }
                            ).then(function (rowsUpdated) {
                                    models.InviteRequest.destroy({
                                        where:{
                                            InviteID:req.body.InviteRequestID
                                        }
                                    })
                                    res.statusCode = 200;
                                    res.send(
                                        {
                                            result: 'success',
                                            err: '',
                                            json: rowsUpdated,
                                            length: rowsUpdated.length
                                        }
                                    );
                                }
                            ).catch(function (err) {
                                console.error(err);
                                res.statusCode = 400;
                                res.send({
                                    result: 'error',
                                    error: err.message
                                });
                            });
                        }
                        else {
                            res.statusCode = 200;
                            res.send(
                                {
                                    result: 'success',
                                    err: 'email not associated with valid account',
                                    json: false,
                                    length: 0
                                }
                            );
                        }
                    }).catch(function (err) {
                        console.error(err);
                        res.statusCode = 400;
                        res.send({
                            result: 'error',
                            error: err.message
                        });
                    });
                }
                else{
                    res.statusCode = 200;
                    res.send(
                        {
                            result: 'success',
                            err: 'password update no longer valid, please request again.',
                            json: false,
                            length: 0
                        }
                    );
                }
            }).catch(function (err) {
                console.error(err);
                res.statusCode = 400;
                res.send({
                    result: 'error',
                    error: err.message
                });
            });
        }
    )
  //must send inviteid GUID to delete.
  .delete('/:inviteid', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.InviteRequest.destroy(
      {
        where: {
          InviteID: req.params.inviteid
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