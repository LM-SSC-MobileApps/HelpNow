
var models  = require('../models'),
    express = require('express');

var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.ResourceType.findAll()
        .then(function(resourceType) {
          res.statusCode = 201;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  resourceType,
              length: resourceType.length
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
  //find ResourceType by ID
  .get('/:id', function(req, res) {
      models.ResourceType.findAll(
        {
          where: {
            AccountID: req.params.id
          }
        }
      ).then(function(resourceType) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  resourceType,
            length: resourceType.length
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
  //insert into ResourceType
  .post('/', function(req, res) {
    models.ResourceType.create(req.body)
    .then(function(resourceType) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  resourceType,
            length: resourceType.length
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
  //update into ResourceType
  .put('/:id', function(req, res) {
    models.ResourceType.update(
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
    models.ResourceType.destroy(
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