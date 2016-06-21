
var models  = require('../models'),
    express = require('express'),
    passport = require('passport');

var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.Address.findAll()
        .then(function(address) {
          res.statusCode = 200;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  address,
              length: address.length
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
  //find Address by ID
  .get('/:id', function(req, res) {
      models.Address.findAll(
        {
          where: {
            AddressID: req.params.id
          }
        }
      ).then(function(address) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  address,
            length: address.length
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
  //insert into Address
  .post('/', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.Address.create(req.body)
    .then(function(address) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  address,
            length: address.length
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
  //update into Address
  .put('/:id', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.Address.update(
      req.body,
      {
        where: {
          AddressID: req.params.id
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
    models.Address.destroy(
      {
        where: {
          AddressID: req.params.id
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