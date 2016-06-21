
var models  = require('../models'),
    express = require('express'),
    passport = require('passport');

var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.RequestUrgency.findAll()
        .then(function(requestUrgency) {
          res.statusCode = 200;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  requestUrgency,
              length: requestUrgency.length
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
  //find RequestUrgency by ID
  .get('/:id', function(req, res) {
      models.RequestUrgency.findAll(
        {
          where: {
            RequestUrgencyID: req.params.id
          }
        }
      ).then(function(requestUrgency) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  requestUrgency,
            length: requestUrgency.length
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
  //insert into RequestUrgency
  .post('/', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.RequestUrgency.create(req.body)
    .then(function(requestUrgency) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  requestUrgency,
            length: requestUrgency.length
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
  //update into RequestUrgency
  .put('/:id', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.RequestUrgency.update(
      req.body,
      {
        where: {
          RequestUrgencyID: req.params.id
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
    models.RequestUrgency.destroy(
      {
        where: {
          RequestUrgencyID: req.params.id
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