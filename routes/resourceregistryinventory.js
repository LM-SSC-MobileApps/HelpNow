
var models  = require('../models'),
    express = require('express');


// //OrganizationGroup many-to-One on Organization
// models.Organization.hasMany(models.OrganizationGroup, {foreignKey: 'OrganizationID'});
// models.OrganizationGroup.belongsTo(models.Organization, {foreignKey: 'OrganizationID'});

// //ResourceRegistry one-to-many on ResourceRegistryInventory
// models.ResourceRegistry.hasMany(models.ResourceRegistyInventory, {foreignKey: 'ResourceRegistryID'});
// models.ResourceRegistyInventory.belongsTo(models.ResourceRegisty, {foreignKey: 'ResourceRegistryID'});

// //ResourceRegistry one-to-one on ResourceLocation
// models.ResourceRegistry.belongsTo(models.ResourceLocation, {foreignKey: 'ResourceLocationID'});

// //ResourceRegistry one-to-one on Organization
// models.ResourceRegistry.belongsTo(models.Organization, {foreignKey: 'OrganizationID'});

var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.ResourceRegistryInventory.findAll()
        .then(function(resourceRegistryInventory) {
          res.statusCode = 201;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  resourceRegistryInventory,
              length: resourceRegistryInventory.length
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
  //find ResourceRegistryInventory by ID
  .get('/:id', function(req, res) {
      models.ResourceRegistryInventory.findAll(
        {
          where: {
            ResourceRegistryInventoryID: req.params.id
          }
        }
      ).then(function(resourceRegistryInventory) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  resourceRegistryInventory,
            length: resourceRegistryInventory.length
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
  //insert into ResourceRegistryInventory
  .post('/', function(req, res) {
    models.ResourceRegistryInventory.create(req.body)
    .then(function(resourceRegistryInventory) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  resourceRegistryInventory,
            length: resourceRegistryInventory.length
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
  //update into ResourceRegistryInventory
  .put('/:id', function(req, res) {
    models.ResourceRegistryInventory.update(
      req.body,
      {
        where: {
          ResourceRegistryInventoryID: req.params.id
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
    models.ResourceRegistryInventory.destroy(
      {
        where: {
          ResourceRegistryInventoryID: req.params.id
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