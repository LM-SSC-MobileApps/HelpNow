
var models  = require('../models'),
    express = require('express'),
    passport = require('passport');

var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.ResponseState.findAll()
        .then(function(responseState) {
          res.statusCode = 200;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  responseState,
              length: responseState.length
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
  //find ResponseState by ID
  .get('/:id', function(req, res) {
      models.ResponseState.findAll(
        {
          where: {
            ResponseStateID: req.params.id
          }
        }
      ).then(function(responseState) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  responseState,
            length: responseState.length
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
  //insert into ResponseState
  .post('/', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.ResponseState.create(req.body)
    .then(function(responseState) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  responseState,
            length: responseState.length
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
  //update into ResponseState
  .put('/:id', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.ResponseState.update(
      req.body,
      {
        where: {
          ResponseStateID: req.params.id
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
    models.ResponseState.destroy(
      {
        where: {
          ResponseStateID: req.params.id
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