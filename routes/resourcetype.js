
var models  = require('../models'),
    express = require('express'),
    passport = require('passport');
    
//ResourceType one-to-many on ResourceTypeUnitOfMeasure    
models.ResourceType.hasMany(models.ResourceTypeUnitOfMeasure, {foreignKey: 'ResourceTypeID'});
models.ResourceTypeUnitOfMeasure.belongsTo(models.ResourceType, {foreignKey: 'ResourceTypeID'});

//ResourceType one-to-many on ResourceSubtype
models.ResourceType.hasMany(models.ResourceSubtype, {foreignKey: 'ResourceTypeID'});
models.ResourceSubtype.belongsTo(models.ResourceType, {foreignKey: 'ResourceTypeID'});

var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.ResourceType.findAll(
        {
          include: [
            {model: models.ResourceTypeUnitOfMeasure},
            {model: models.ResourceSubtype}
          ]
        }
      )
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
            ResourceTypeID: req.params.id
          },
          include: [
            {model: models.ResourceTypeUnitOfMeasure},
            {model: models.ResourceSubtype}
          ]
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
  .post('/', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
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
  .put('/:id', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.ResourceType.update(
      req.body,
      {
        where: {
          ResourceTypeID: req.params.id
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
    models.ResourceType.destroy(
      {
        where: {
          ResourceTypeID: req.params.id
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