
var models  = require('../models'),
    express = require('express');

var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.EventLocation.findAll()
        .then(function(eventLocation) {
          res.statusCode = 201;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  eventLocation,
              length: eventLocation.length
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
  //find EventLocation by ID
  .get('/:id', function(req, res) {
      models.EventLocation.findAll(
        {
          where: {
            EventLocationID: req.params.id
          }
        }
      ).then(function(eventLocation) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  eventLocation,
            length: eventLocation.length
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
  //insert into EventLocation
  .post('/', function(req, res) {
    models.EventLocation.create(req.body)
    .then(function(eventLocation) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  eventLocation,
            length: eventLocation.length
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
  //update into EventLocation
  .put('/:id', function(req, res) {
    models.EventLocation.update(
      req.body,
      {
        where: {
          EventLocationID: req.params.id
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
    models.EventLocation.destroy(
      {
        where: {
          EventLocationID: req.params.id
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