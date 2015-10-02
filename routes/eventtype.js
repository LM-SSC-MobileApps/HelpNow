
var models  = require('../models'),
    express = require('express');

var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.EventType.findAll()
        .then(function(eventType) {
          res.statusCode = 201;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  eventType,
              length: eventType.length
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
  //find EventType by ID
  .get('/:id', function(req, res) {
      models.EventType.findAll(
        {
          where: {
            EventTypeID: req.params.id
          }
        }
      ).then(function(eventType) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  eventType,
            length: eventType.length
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
  //insert into EventType
  .post('/', function(req, res) {
    models.EventType.create(req.body)
    .then(function(eventType) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  eventType,
            length: eventType.length
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
  //update into EventType
  .put('/:id', function(req, res) {
    models.EventType.update(
      req.body,
      {
        where: {
          EventTypeID: req.params.id
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
    models.EventType.destroy(
      {
        where: {
          EventTypeID: req.params.id
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