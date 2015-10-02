
var models  = require('../models'),
    express = require('express');

var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.Event.findAll()
        .then(function(event) {
          res.statusCode = 201;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  event,
              length: event.length
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
  //find Event by ID
  .get('/:id', function(req, res) {
      models.Event.findAll(
        {
          where: {
            EventID: req.params.id
          }
        }
      ).then(function(event) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  event,
            length: event.length
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
  //insert into Event
  .post('/', function(req, res) {
    models.Event.create(req.body)
    .then(function(event) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  event,
            length: event.length
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
  //update into Event
  .put('/:id', function(req, res) {
    models.Event.update(
      req.body,
      {
        where: {
          EventID: req.params.id
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
    models.Event.destroy(
      {
        where: {
          EventID: req.params.id
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