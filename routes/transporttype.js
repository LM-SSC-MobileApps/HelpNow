
var models  = require('../models'),
    express = require('express');
    
// //TransportType one-to-many on ResourceLocationTransport    
// models.TransportType.hasMany(models.ResourceLocationTransport, {foreignKey: 'TransportTypeID'});
// models.ResourceLocationTransport.belongsTo(models.TransportType, {foreignKey: 'TransportTypeID'});

var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.TransportType.findAll(
        {
        }
      )
        .then(function(transportType) {
          res.statusCode = 201;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  transportType,
              length: transportType.length
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
  //find TransportType by ID
  .get('/:id', function(req, res) {
      models.TransportType.findAll(
        {
          where: {
            TransportTypeID: req.params.id
          }
        }
      ).then(function(transportType) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  transportType,
            length: transportType.length
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
  //insert into TransportType
  .post('/', function(req, res) {
    models.TransportType.create(req.body)
    .then(function(transportType) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  transportType,
            length: transportType.length
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
  //update into TransportType
  .put('/:id', function(req, res) {
    models.TransportType.update(
      req.body,
      {
        where: {
          TransportTypeID: req.params.id
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
    models.TransportType.destroy(
      {
        where: {
          TransportTypeID: req.params.id
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