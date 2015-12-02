
var models  = require('../models'),
    express = require('express');
    
//ResourceLocation one-to-many on ResourceLocationInventory
models.ResourceLocation.hasMany(models.ResourceLocationInventory, {foreignKey: 'ResourceLocationID'});
models.ResourceLocationInventory.belongsTo(models.ResourceLocation, {foreignKey: 'ResourceLocationID'});

//ResourceLocation many-to-One on ResourceRegistry
models.ResourceRegistry.hasMany(models.ResourceLocation, {foreignKey: 'ResourceRegistryID'});
models.ResourceLocation.belongsTo(models.ResourceRegistry, {foreignKey: 'ResourceRegistryID'});

var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.ResourceLocation.findAll(
        {
          include: [
            {model: models.ResourceRegistry},
            {model: models.ResourceLocationInventory}
          ]
        }
      )
        .then(function(resourceLocation) {
          res.statusCode = 201;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  resourceLocation,
              length: resourceLocation.length
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
  //find ResourceLocation by ID
  .get('/:id', function(req, res) {
      models.ResourceLocation.findAll(
        {
          where: {
            ResourceLocationID: req.params.id
          },
          include: [
            {model: models.ResourceRegistry},
            {model: models.ResourceLocationInventory}
          ]
        }
      ).then(function(resourceLocation) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  resourceLocation,
            length: resourceLocation.length
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
  //insert into ResourceLocation
  .post('/', function(req, res) {
    models.ResourceLocation.create(req.body)
    .then(function(resourceLocation) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  resourceLocation,
            length: resourceLocation.length
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
  //update into ResourceLocation
  .put('/:id', function(req, res) {
    models.ResourceLocation.update(
      req.body,
      {
        where: {
          ResourceLocationID: req.params.id
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
    models.ResourceLocation.destroy(
      {
        where: {
          ResourceLocationID: req.params.id
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