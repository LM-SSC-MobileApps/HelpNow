
var models = require('../models'),
    express = require('express'),
    promise = require('bluebird'),
	geoRouting = require('../modules/routing'),
    passport = require('passport');

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

//ResourceLocation many-to-one on ResourceLocationStatus
models.ResourceLocation.belongsTo(models.ResourceLocationStatus, { foreignKey: 'ResourceLocationStatusID' });
models.ResourceLocationStatus.hasMany(models.ResourceLocation, { foreignKey: 'ResourceLocationStatusID' });

//ResourceLocationInventory many-to-one on ResourceType
models.ResourceLocationInventory.belongsTo(models.ResourceType, { foreignKey: 'ResourceTypeID' });
models.ResourceType.hasMany(models.ResourceLocationInventory, { foreignKey: 'ResourceTypeID' });

//ResourceLocationInventory many-to-one on ResourceSubtype
models.ResourceLocationInventory.belongsTo(models.ResourceSubtype, { foreignKey: 'ResourceSubtypeID' });
models.ResourceSubtype.hasMany(models.ResourceLocationInventory, { foreignKey: 'ResourceSubtypeID' });

//ResourceLocationInventory many-to-one on ResourceTypeUnitOfMeasure
models.ResourceLocationInventory.belongsTo(models.ResourceTypeUnitOfMeasure, { foreignKey: 'ResourceTypeUnitOfMeasureID' });
models.ResourceTypeUnitOfMeasure.hasMany(models.ResourceLocationInventory, { foreignKey: 'ResourceTypeUnitOfMeasureID' });

function findAllDistCenters() {
	return models.ResourceLocation.findAll(
		{
			include: [
			{
				model: models.Organization,
				required: true
            },
            {
				model: models.ResourceLocationType,
				where: {
					Description: "Distribution Center"
				}
            },
			{
				model: models.ResourceLocationInventory,
				required: false,
				include: [
				{
					model: models.ResourceType
				},
				{
					model: models.ResourceSubtype
				},
				{
					model: models.ResourceTypeUnitOfMeasure
				}]
			}]
        });
}

var routes = function () {
    var router = express.Router();
    /**
        * @api {get} api/resourcelocation Get all ResourceLocations
        * @apiName GetResourceLocations
        * @apiGroup ResourceLocation
        *
        * @apiUse helpNowHeader
        * @apiUse helpNowSuccessResult
        * @apiUse helpNowUnauthorizedResult
        * @apiSuccess {Object[]} json    The Result data in the form of a json array of ResourceLocation objects.
        * @apiSuccess {Number} json.ResourceLocationID The ResourceLocation ID for the ResourceLocation object.
        * @apiSuccess {Number} json.EventID An Event ID for the Event associated with the ResourceLocation
        * @apiSuccess {Number} json.OrganizationID An Organization ID for the Organization associated with the ResourceLocation
        * @apiSuccess {Number} json.ResourceLocationTypeID The ResourceLocationType ID for the ResourceLocation object.
        * @apiSuccess {Number} json.ResourceLocationStatusID The ResourceLocationStatus ID for the ResourceLocation object.
        * @apiSuccess {String} json.Description Title/Description for the ResourceLocation
        * @apiSuccess {String} json.Notes General Information and notes for the ResourceLocation
        * @apiSuccess {Float} json.LAT Lattitude coordinate for the location of the ResourceLocation
        * @apiSuccess {Float} json.LONG Longitude coordinate for the location of the ResourceLocation
        * @apiSuccess {String} json.PrimaryPOCName Primary Point of Contact name for the ResourceLocation
        * @apiSuccess {String} json.PrimaryPOCPhone Primary Point of Contact phone number for the ResourceLocation
        * @apiSuccess {String} json.SecondaryPOCName Secondary Point of Contact name for the ResourceLocation
        * @apiSuccess {String} json.SecondaryPOCPhone Secondary Point of Contact phone number for the ResourceLocation
        * @apiSuccess {Object}   json.Event the Event object associated with the ResourceLocation.
        * @apiSuccess {Object}   json.Organization the Organization object associated with the ResourceLocation.
        * @apiSuccess {Object}   json.ResourceLocationType the ResourceLocationType object for the ResourceLocation.
        * @apiSuccess {Object[]}   json.ResourceLocationInventories An Array of ResourceLocationInventory objects available at the ResourceLocation.
        * @apiSuccess {Object[]}   json.ResourceLocationTransports An Array of ResourceLocationTransport objects available at the ResourceLocation.
     */
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
  /**
        * @api {get} api/resourcelocation/:id Get ResourceLocation by ResourceLocationID
        * @apiName GetResourceLocationByID
        * @apiGroup ResourceLocation

        * @apiParam {Number} id ResourceLocation unique ID
        *
        * @apiUse helpNowHeader
        * @apiUse helpNowSuccessResult
        * @apiUse helpNowUnauthorizedResult
        * @apiSuccess {Object} json    The result data in the form of a json ResourceLocation object.
     */
  .get('/:id', function (req, res) {
      models.ResourceLocation.findAll(
        {
            where: {
                ResourceLocationID: req.params.id
            },
            include: [
              { model: models.Event },
              { model: models.Organization },
              {
                  model: models.ResourceLocationInventory,
                  include: [
                      { model: models.ResourceType },
					  { model: models.ResourceSubtype },
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
  
	/**
        * @api {get} api/resourcelocation/dist-center/all Get All ResourceLocations of type Distribution Center
        * @apiName GetResourceLocationDistributionCenters
        * @apiGroup ResourceLocation
        *
        * @apiUse helpNowHeader
        * @apiUse helpNowSuccessResult
        * @apiUse helpNowUnauthorizedResult
        * @apiSuccess {Object[]} json    The result data in the form of a json array of ResourceLocation objects.
     */
	.get('/dist-center/all', function(req, res) {
		findAllDistCenters().then(function (centers) {
			res.statusCode = 200;
			res.send(
            {
                result: 'success',
                err: '',
                json: centers,
                length: centers.length
            });
		}).catch(function (err) {
			console.error(err);
			res.statusCode = 502;
			res.send({
				result: 'error',
				err: err.message
			});
		});
	})
	
	/**
        * @api {get} api/resourcelocation/dist-center/nearest/:loc Finds Distribution Centers located near the input location
        * @apiName GetResourceLocationNearestDistributionCenters
        * @apiGroup ResourceLocation
		*
		* @apiParam {String} A location with latitude and longitude separated by a comma.
        *
        * @apiUse helpNowHeader
        * @apiUse helpNowSuccessResult
        * @apiUse helpNowUnauthorizedResult
        * @apiSuccess {Object[]} json    The result data in the form of a json array of ResourceLocation objects with added Distance and Route fields.
     */
	.get('/dist-center/nearest/:loc', function(req, res) {
		var location = req.params.loc;
		var resourceTypes = req.query.resources.split(",");
		console.log(resourceTypes);
		findAllDistCenters()
		.then(function (allCenters) {
			var selectedCenters = allCenters.filter(function (center) {
	            var inventories = center.ResourceLocationInventories;
				for (var i = 0; i < inventories.length; i++) {
					var resourceType = inventories[i].ResourceType.Description;
					if (resourceTypes.indexOf(resourceType) != -1)
						return true;
				}
				return false;
	        });
			return geoRouting.findNearestDistCenters(selectedCenters, location);
		}).then(function (nearestCenters) {
			res.statusCode = 200;
			res.send(
            {
                result: 'success',
                err: '',
                json: nearestCenters,
                length: nearestCenters.length
            });
		}).catch(function (err) {
			console.error(err);
			res.statusCode = 502;
			res.send({
				result: 'error',
				err: err.message
			});
		});
	})
  
  /**
        * @api {get} api/resourcelocation/:orgid Get ResourceLocations by OrganizationID
        * @apiName GetResourceLocationsByOrganizationID
        * @apiGroup ResourceLocation
        *
        * @apiParam {Number} orgid Organization unique ID
        *
        * @apiUse helpNowHeader
        * @apiUse helpNowSuccessResult
        * @apiUse helpNowUnauthorizedResult
        * @apiSuccess {Object[]} json    The result data in the form of a json array of ResourceLocation objects.
     */
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
    /**
        * @api {get} api/resourcelocation/dist-center/organization/:orgid Get All ResourceLocations of type Distribution Center by Organization ID
        * @apiName GetResourceLocationDistributionCentersByOrgID
        * @apiGroup ResourceLocation
        *
        * @apiParam {Number} orgid Organization unique ID
        *
        * @apiUse helpNowHeader
        * @apiUse helpNowSuccessResult
        * @apiUse helpNowUnauthorizedResult
        * @apiSuccess {Object[]} json    The result data in the form of a json array of ResourceLocation objects.
     */
  .get('/dist-center/organization/:orgid', function (req, res) {
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
					  { model: models.ResourceSubtype },
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
              {
                  model: models.ResourceLocationType,
                  where: {
                      Description: "Distribution Center"
                  }
              }
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
  /**
        * @api {post} api/resourcelocation/ Insert a new ResourceLocation
        * @apiName PostResourceLocation
        * @apiGroup ResourceLocation
   
        * @apiParam {JSON} body representation of the ResourceLocation object to insert in JSON format
        
        * @apiParam {Number} body.EventID An Event ID for the Event associated with the ResourceLocation
        * @apiParam {Number} body.OrganizationID An Organization ID for the Organization associated with the ResourceLocation
        * @apiParam {Number} body.ResourceLocationTypeID The ResourceLocationType ID for the ResourceLocation object.
        * @apiParam {Number} body.ResourceLocationStatusID The ResourceLocationStatus ID for the ResourceLocation object.
        * @apiParam {String} body.Description Title/Description for the ResourceLocation
        * @apiParam {String} body.Notes General Information and notes for the ResourceLocation
        * @apiParam {Float} body.LAT Lattitude coordinate for the location of the ResourceLocation
        * @apiParam {Float} body.LONG Longitude coordinate for the location of the ResourceLocation
        * @apiParam {String} body.PrimaryPOCName Primary Point of Contact name for the ResourceLocation
        * @apiParam {String} body.PrimaryPOCPhone Primary Point of Contact phone number for the ResourceLocation
        * @apiParam {String} body.SecondaryPOCName Secondary Point of Contact name for the ResourceLocation
        * @apiParam {String} body.SecondaryPOCPhone Secondary Point of Contact phone number for the ResourceLocation

        * @apiUse helpNowHeader
        * @apiUse helpNowSuccessResult
        * @apiUse helpNowUnauthorizedResult
        * @apiSuccess {Object} The ResourceLocation object created from the insert in json format.

        * @apiSuccessExample {json} Success-Response:
             *     HTTP/1.1 200 OK
             *     {
             *       "result": "success",
             *       "err": "",
             *       "json": "<ResourceLocation object>",
             *     }
 */
  .post('/', passport.authenticate('jwt-auth-api', {session:false}), function (req, res) {
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
  /**
        * @api {put} api/resourcelocation/:id Update a ResourceLocation
        * @apiName UpdateResourceLocation
        * @apiGroup ResourceLocation
        * @apiDescription This will update the Resource Location and will also update any associated ResourceLocationTransport objects to be assocuated with the ResourceLocation.  (Note: if no ResourceLocationTransport objects are included in the update then all current ResourceLocationTransport objects will be removed)
        * @apiParam {Number} id The unique ID of the ResourceLocation to update
   
        * @apiParam {JSON} body representation of the ResourceLocation object along with associated ResourceLocationTransports to update in JSON format
        
        * @apiUse helpNowHeader
        * @apiUse helpNowSuccessResult
        * @apiUse helpNowUnauthorizedResult
        * @apiSuccess {Object} json the number of rows updated.

        * @apiSuccessExample {json} Success-Response:
             *     HTTP/1.1 200 OK
             *     {
             *       "result": "success",
             *         "err": "",
             *         "json": {
             *           "rows": [
              *             3
              *           ]
            *         },
             *         "length": 1
             *     }
 */
  .put('/:id', passport.authenticate('jwt-auth-api', {session:false}), function (req, res) {
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
    /**
        * @api {delete} api/resourcelocation/:id Delete a ResourceLocation
        * @apiName DeleteResourceLocation
        * @apiGroup ResourceLocation
        * @apiDescription This will Delete the Resource Location along with any cascading objects (ResourceLocationInventory, ResourceLocationTypes, etc).
        * @apiParam {Number} id The unique ID of the ResourceLocation to delete
        * @apiUse helpNowHeader
        * @apiUse helpNowSuccessResult
        * @apiUse helpNowUnauthorizedResult
        * @apiSuccess {Object} json the number of rows deleted.

        * @apiSuccessExample {json} Success-Response:
        *       HTTP/1.1 200 OK
        *      {
        *          "result": "success",
        *          "err": "",
        *          "json": {
        *              "rows": 1
        *          }
        *      }
    */
  .delete('/:id', passport.authenticate('jwt-auth-api', {session:false}), function (req, res) {
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
  )
  
  .delete('/deployments/all', passport.authenticate('jwt-auth-api', {session:false}), function (req, res) {
      models.ResourceLocation.destroy(
		{
          where: {
              ResourceLocationTypeID: 2
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