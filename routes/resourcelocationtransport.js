
var models  = require('../models'),
    express = require('express'),
    passport = require('passport');

//ResourceLocationTransport many-to-one on ResourceLocation
models.ResourceLocationTransport.belongsTo(models.ResourceLocation, {foreignKey: 'ResourceLocationID'});
models.ResourceLocation.hasMany(models.ResourceLocationTransport, {foreignKey: 'ResourceLocationID'});

//ResourceLocationTransport many-to-one on TransportType
models.ResourceLocationTransport.belongsTo(models.TransportType, {foreignKey: 'TransportTypeID'});
models.TransportType.hasMany(models.ResourceLocationTransport, {foreignKey: 'TransportTypeID'});


var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.ResourceLocationTransport.findAll(
        {
          include: [
            {model: models.ResourceLocation},
            {model: models.TransportType}
          ]
        }
      )
        .then(function(resourceLocationTransport) {
          res.statusCode = 200;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  resourceLocationTransport,
              length: resourceLocationTransport.length
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
  //find ResourceLocationTransport by ID
  .get('/:id', function(req, res) {
      models.ResourceLocationTransport.findAll(
        {
          where: {
            ResourceLocationTransportID: req.params.id
          },
          include: [
            {model: models.ResourceLocation},
            {model: models.TransportType}
          ]
        }
      ).then(function(resourceLocationTransport) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  resourceLocationTransport,
            length: resourceLocationTransport.length
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
  //insert into ResourceLocationTransport
  .post('/', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.ResourceLocationTransport.create(req.body)
    .then(function(resourceLocationTransport) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  resourceLocationTransport,
            length: resourceLocationTransport.length
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
  //update into ResourceLocationTransport
  .put('/:id', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.ResourceLocationTransport.update(
      req.body,
      {
        where: {
          ResourceLocationTransportID: req.params.id
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
    models.ResourceLocationTransport.destroy(
      {
        where: {
          ResourceLocationTransportID: req.params.id
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