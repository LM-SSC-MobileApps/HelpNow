
var models  = require('../models'),
    express = require('express'),
    passport = require('passport');
    
//ResourceTypeUnitOfMeasure many-to-one on ResourceType
models.ResourceTypeUnitOfMeasure.belongsTo(models.ResourceType, {foreignKey: 'ResourceTypeID'});
models.ResourceType.hasMany(models.ResourceTypeUnitOfMeasure, {foreignKey: 'ResourceTypeID'});

var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.ResourceTypeUnitOfMeasure.findAll(
        {
          include: [
            {model: models.ResourceType}
          ]
        }
      )
        .then(function(resourceTypeUnitOfMeasure) {
          res.statusCode = 200;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  resourceTypeUnitOfMeasure,
              length: resourceTypeUnitOfMeasure.length
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
  //find ResourceTypeUnitOfMeasure by ID
  .get('/:id', function(req, res) {
      models.ResourceTypeUnitOfMeasure.findAll(
        {
          where: {
            ResourceTypeUnitOfMeasureID: req.params.id
          },
          include: [
            {model: models.ResourceType}
          ]
        }
      ).then(function(resourceTypeUnitOfMeasure) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  resourceTypeUnitOfMeasure,
            length: resourceTypeUnitOfMeasure.length
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
  //insert into ResourceTypeUnitOfMeasure
  .post('/', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.ResourceTypeUnitOfMeasure.create(req.body)
    .then(function(resourceTypeUnitOfMeasure) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  resourceTypeUnitOfMeasure,
            length: resourceTypeUnitOfMeasure.length
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
  //update into ResourceTypeUnitOfMeasure
  .put('/:id', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.ResourceTypeUnitOfMeasure.update(
      req.body,
      {
        where: {
          ResourceTypeUnitOfMeasureID: req.params.id
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
    models.ResourceTypeUnitOfMeasure.destroy(
      {
        where: {
          ResourceTypeUnitOfMeasureID: req.params.id
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