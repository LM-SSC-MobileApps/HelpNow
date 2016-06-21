
var models  = require('../models'),
    express = require('express'),
    passport = require('passport');

var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.RequestState.findAll()
        .then(function(requestState) {
          res.statusCode = 200;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  requestState,
              length: requestState.length
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
  //find RequestState by ID
  .get('/:id', function(req, res) {
      models.RequestState.findAll(
        {
          where: {
            RequestStateID: req.params.id
          }
        }
      ).then(function(requestState) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  requestState,
            length: requestState.length
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
  //insert into RequestState
  .post('/', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.RequestState.create(req.body)
    .then(function(requestState) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  requestState,
            length: requestState.length
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
  //update into RequestState
  .put('/:id', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.RequestState.update(
      req.body,
      {
        where: {
          RequestStateID: req.params.id
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
    models.RequestState.destroy(
      {
        where: {
          RequestStateID: req.params.id
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