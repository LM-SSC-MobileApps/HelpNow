
var models  = require('../models'),
    express = require('express'),
    passport = require('passport');

var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.AccountRole.findAll()
        .then(function(accountRole) {
          res.statusCode = 200;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  accountRole,
              length: accountRole.length
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
  //find AccountRole by ID
  .get('/:id', function(req, res) {
      models.AccountRole.findAll(
        {
          where: {
            AccountRoleID: req.params.id
          }
        }
      ).then(function(accountRole) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  accountRole,
            length: accountRole.length
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
  //insert into AccountRole
  .post('/', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.AccountRole.create(req.body)
    .then(function(accountRole) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  accountRole,
            length: accountRole.length
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
  //update into AccountRole
  .put('/:id', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.AccountRole.update(
      req.body,
      {
        where: {
          AccountRoleID: req.params.id
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
  .delete('/:id', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.AccountRole.destroy(
      {
        where: {
          AccountRoleID: req.params.id
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