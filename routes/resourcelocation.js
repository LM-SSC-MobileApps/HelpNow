
var models = require('../models'),
    express = require('express'),
    promise = require('bluebird');

//ResourceLocation one-to-many on ResourceLocationInventory
models.ResourceLocation.hasMany(models.ResourceLocationInventory, { foreignKey: 'ResourceLocationID' });
models.ResourceLocationInventory.belongsTo(models.ResourceLocation, { foreignKey: 'ResourceLocationID' });

//ResourceLocation one-to-many on ResourceLocationTransport
models.ResourceLocation.hasMany(models.ResourceLocationTransport, { foreignKey: 'ResourceLocationID' });
models.ResourceLocationTransport.belongsTo(models.ResourceLocation, { foreignKey: 'ResourceLocationID' });

//ResourceLocationTransport many-to-one on TransportType
models.ResourceLocationTransport.belongsTo(models.TransportType, { foreignKey: 'TransportTypeID' });
models.TransportType.hasMany(models.ResourceLocationTransport, { foreignKey: 'TransportTypeID' });

// //ResourceLocation many-to-One on Organization
models.Organization.hasMany(models.ResourceLocation, { foreignKey: 'OrganizationID' });
models.ResourceLocation.belongsTo(models.Organization, { foreignKey: 'OrganizationID' });

// //ResourceLocation many-to-One on Event
models.Event.hasMany(models.ResourceLocation, { foreignKey: 'EventID' });
models.ResourceLocation.belongsTo(models.Event, { foreignKey: 'EventID' });

//ResourceLocation many-to-one on ResourceLocationType
models.ResourceLocation.belongsTo(models.ResourceLocationType, { foreignKey: 'ResourceLocationTypeID' });
models.ResourceLocationType.hasMany(models.ResourceLocation, { foreignKey: 'ResourceLocationTypeID' });

//ResourceLocationInventory many-to-one on ResourceType
models.ResourceLocationInventory.belongsTo(models.ResourceType, { foreignKey: 'ResourceTypeID' });
models.ResourceType.hasMany(models.ResourceLocationInventory, { foreignKey: 'ResourceTypeID' });

//ResourceLocationInventory many-to-one on ResourceTypeUnitOfMeasure
models.ResourceLocationInventory.belongsTo(models.ResourceTypeUnitOfMeasure, { foreignKey: 'ResourceTypeUnitOfMeasureID' });
models.ResourceTypeUnitOfMeasure.hasMany(models.ResourceLocationInventory, { foreignKey: 'ResourceTypeUnitOfMeasureID' });

var routes = function () {
    var router = express.Router();
    router.get('/', function (req, res) {
        models.ResourceLocation.findAll(
          {
              include: [
                { model: models.Organization },
                { model: models.Event, required: false },
                {
                    model: models.ResourceLocationInventory,
                    include: [
                        { model: models.ResourceType },
                        { model: models.ResourceTypeUnitOfMeasure },
                    ]
                },
                {
                    model: models.ResourceLocationTransport,
                    include: [
                        {
                            model: models.TransportType
                        }
                    ]
                },
                { model: models.ResourceLocationType }
              ]
          }
        )
          .then(function (resourceLocation) {
              res.statusCode = 201;
              res.send(
                {
                    result: 'success',
                    err: '',
                    json: resourceLocation,
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
                err: err.message
            });
        });
    }
  )
  //find ResourceLocation by ID
  .get('/:id', function (req, res) {
      models.ResourceLocation.findAll(
        {
            where: {
                ResourceLocationID: req.params.id
            },
            include: [
              { model: models.Organization },
              {
                  model: models.ResourceLocationInventory,
                  include: [
                      { model: models.ResourceType },
                      { model: models.ResourceTypeUnitOfMeasure },
                  ]
              },
              {
                  model: models.ResourceLocationTransport,
                  include: [
                      {
                          model: models.TransportType
                      }
                  ]
              },
              { model: models.ResourceLocationType }
            ]
        }
      ).then(function (resourceLocation) {
          res.statusCode = 200;
          res.send(
            {
                result: 'success',
                err: '',
                json: resourceLocation,
                length: resourceLocation.length
            }
          );
      }
     ).catch(function (err) {
         console.error(err);
         res.statusCode = 502;
         res.send({
             result: 'error',
             err: err.message
         });
     });
  }
  )
  //find ResourceLocation by OrganiztionID
  .get('/organization/:orgid', function (req, res) {
      models.ResourceLocation.findAll(
        {
            where: {
                OrganizationID: req.params.orgid
            },
            include: [
              { model: models.Organization },
              {
                  model: models.ResourceLocationInventory,
                  include: [
                      { model: models.ResourceType },
                      { model: models.ResourceTypeUnitOfMeasure },
                  ]
              },
              {
                  model: models.ResourceLocationTransport,
                  include: [
                      {
                          model: models.TransportType
                      }
                  ]
              },
              { model: models.ResourceLocationType }
            ]
        }
      ).then(function (resourceLocation) {
          res.statusCode = 200;
          res.send(
            {
                result: 'success',
                err: '',
                json: resourceLocation,
                length: resourceLocation.length
            }
          );
      }
     ).catch(function (err) {
         console.error(err);
         res.statusCode = 502;
         res.send({
             result: 'error',
             err: err.message
         });
     });
  }
  )
  //insert into ResourceLocation
  .post('/', function (req, res) {
      //This will save a new ResourceLocation and any ResourceLocationTransports
      models.ResourceLocation.create(
          req.body
         , {
             include: [models.ResourceLocationTransport]
         }
      )
      .then(function (resourceLocation) {
          res.statusCode = 200;
          res.send(
            {
                result: 'success',
                err: '',
                json: resourceLocation,
                length: resourceLocation.length
            }
          );
        }
       ).catch(function (err) {
           console.error(err);
           res.statusCode = 502;
           res.send({
               result: 'error',
               err: err.message
           });
       });
  }
  )
  //update into ResourceLocation
  .put('/:id', function (req, res) {
      //console.log("HERE IS OUR ResourceLocationTransports: " + req.body.ResourceLocationTransports);
      models.ResourceLocation.update(
        req.body,
        {
            where: {
                ResourceLocationID: req.params.id
            }
        }
      )
      .then(function (rowsUpdated) {
          //console.log("rows updated!: " + rowsUpdated);

          models.ResourceLocationTransport.destroy(
              {
                  where: {
                      ResourceLocationID: req.params.id
                  }
              }
           ).then(function (numDelete) {
               models.ResourceLocationTransport.bulkCreate(
                   req.body.ResourceLocationTransports,
                   {
                       ignoreDuplicates: true
                   }
               )
               .then(function (complete) {
                   res.statusCode = 200;
                   res.send(
                     {
                         result: 'success',
                         err: '',
                         json: { rows: rowsUpdated },
                         length: rowsUpdated.length
                     }
                   );
               });

           });
      }
       ).catch(function (err) {
           console.error(err);
           res.statusCode = 502;
           res.send({
               result: 'error',
               error: err.message
           });
       });
  }
  )
        ///Cascade deletes in the database handle all references to the resource location id being deleted.
  .delete('/:id', function (req, res) {
      models.ResourceLocation.destroy(
      {
          where: {
              ResourceLocationID: req.params.id
          }
      }
      )
      .then(function (numDelete) {
          res.statusCode = 200;
          res.send(
            {
                result: 'success',
                err: '',
                json: { rows: numDelete }
            }
          );
      }
       ).catch(function (err) {
           console.error(err);
           res.statusCode = 502;
           res.send({
               result: 'error',
               err: err.message
           });
       });
  }
  );

    return router;
}

module.exports = routes;