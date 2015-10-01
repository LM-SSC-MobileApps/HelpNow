
var models  = require('../models'),
    express = require('express');


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
  .get('/:id', function(req, res) {
      models.Account.findAll(
        {
          where: {
            AccountID: req.params.id
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