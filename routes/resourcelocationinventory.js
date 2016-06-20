
var models  = require('../models'),
    express = require('express'),
    passport = require('passport'),
    passport = require('passport');

//ResourceLocationInventory many-to-one on ResourceLocation
models.ResourceLocationInventory.belongsTo(models.ResourceLocation, {foreignKey: 'ResourceLocationID'});
models.ResourceLocation.hasMany(models.ResourceLocationInventory, {foreignKey: 'ResourceLocationID'});

//ResourceLocationInventory many-to-one on ResourceType
models.ResourceLocationInventory.belongsTo(models.ResourceType, {foreignKey: 'ResourceTypeID'});
models.ResourceType.hasMany(models.ResourceLocationInventory, {foreignKey: 'ResourceTypeID'});

//ResourceLocationInventory many-to-one on ResourceSubtype
models.ResourceLocationInventory.belongsTo(models.ResourceSubtype, {foreignKey: 'ResourceSubtypeID'});
models.ResourceSubtype.hasMany(models.ResourceLocationInventory, {foreignKey: 'ResourceSubtypeID'});

//ResourceLocationInventory many-to-one on ResourceTypeUnitOfMeasure
models.ResourceLocationInventory.belongsTo(models.ResourceTypeUnitOfMeasure, {foreignKey: 'ResourceTypeUnitOfMeasureID'});
models.ResourceTypeUnitOfMeasure.hasMany(models.ResourceLocationInventory, {foreignKey: 'ResourceTypeUnitOfMeasureID'});


var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.ResourceLocationInventory.findAll(
        {
          include: [
            {model: models.ResourceLocation},
            {model: models.ResourceType},
            {model: models.ResourceSubtype},
            {model: models.ResourceTypeUnitOfMeasure}
          ]
        }
      )
        .then(function(resourceLocationInventory) {
          res.statusCode = 201;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  resourceLocationInventory,
              length: resourceLocationInventory.length
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
  //find ResourceLocationInventory by ID
  .get('/:id', function(req, res) {
      models.ResourceLocationInventory.findAll(
        {
          where: {
            ResourceLocationInventoryID: req.params.id
          },
          include: [
            {model: models.ResourceLocation},
            {model: models.ResourceType},
            {model: models.ResourceSubtype},
            {model: models.ResourceTypeUnitOfMeasure}
          ]
        }
      ).then(function(resourceLocationInventory) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  resourceLocationInventory,
            length: resourceLocationInventory.length
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
  //insert into ResourceLocationInventory
  .post('/', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.ResourceLocationInventory.create(req.body)
    .then(function(resourceLocationInventory) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  resourceLocationInventory,
            length: resourceLocationInventory.length
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
  //update into ResourceLocationInventory
  .put('/:id', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.ResourceLocationInventory.update(
      req.body,
      {
        where: {
          ResourceLocationInventoryID: req.params.id
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
    models.ResourceLocationInventory.destroy(
      {
        where: {
          ResourceLocationInventoryID: req.params.id
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