var promise = require('bluebird');
var cluster = require('../modules/cluster');
var models  = require('../models'),
    express = require('express'),
    passport = require('passport');

//Event one-to-many on EventLocation    
models.Event.hasMany(models.EventLocation, {foreignKey: 'EventID'});
models.EventLocation.belongsTo(models.Event, {foreignKey: 'EventID'});

//Event one-to-many on SocialMedia
// models.Event.hasMany(models.SocialMedia, {foreignKey: 'EventID'});
// models.SocialMedia.belongsTo(models.Event, {foreignKey: 'EventID'});

//Event one-to-many on Blockage
models.Event.hasMany(models.Blockage, {foreignKey: 'EventID'});
models.Blockage.belongsTo(models.Event, {foreignKey: 'EventID'});

//Event many-to-one on EventType
models.Event.belongsTo(models.EventType, { foreignKey: 'EventTypeID' });
models.EventType.hasMany(models.Event, { foreignKey: 'EventTypeID' });

//Event one-to-many on ResourceRequest
models.Event.hasMany(models.ResourceRequest, {foreignKey: 'EventID'});
models.ResourceRequest.belongsTo(models.Event, {foreignKey: 'EventID'});

//Event one-to-many on ResourceLocation
models.Event.hasMany(models.ResourceLocation, {foreignKey: 'EventID'});
models.ResourceLocation.belongsTo(models.Event, {foreignKey: 'EventID'});

//Event many-to-One on Organization
models.Organization.hasMany(models.Event, {foreignKey: 'OrganizationID'});
models.Event.belongsTo(models.Organization, {foreignKey: 'OrganizationID'});

//ResourceLocation one-to-many on ResourceLocationInventory
models.ResourceLocation.hasMany(models.ResourceLocationInventory, {foreignKey: 'ResourceLocationID'});
models.ResourceLocationInventory.belongsTo(models.ResourceLocation, {foreignKey: 'ResourceLocationID'});

//ResourceLocationInventory many-to-one on ResourceType
models.ResourceLocationInventory.belongsTo(models.ResourceType, {foreignKey: 'ResourceTypeID'});
models.ResourceType.hasMany(models.ResourceLocationInventory, {foreignKey: 'ResourceTypeID'});

//ResourceLocationInventory many-to-one on ResourceTypeUnitOfMeasure
models.ResourceLocationInventory.belongsTo(models.ResourceTypeUnitOfMeasure, {foreignKey: 'ResourceTypeUnitOfMeasureID'});
models.ResourceTypeUnitOfMeasure.hasMany(models.ResourceLocationInventory, {foreignKey: 'ResourceTypeUnitOfMeasureID'});

//ResourceLocationTransport many-to-one on TransportType
models.ResourceLocationTransport.belongsTo(models.TransportType, {foreignKey: 'TransportTypeID'});
models.TransportType.hasMany(models.ResourceLocationTransport, { foreignKey: 'TransportTypeID' });

/**
* @apiDefine helpNowHeader 
* @apiHeader {String} authorization Basic Authorization header with API Key & API Secret.
**/

/**
* @apiDefine helpNowSuccessResult 
* @apiSuccess {String} result Result message.
* @apiSuccess {String} error Error message.
**/

/**
* @apiDefine helpNowUnauthorizedResult 
* @apiError {String} 401 Unauthorized.
* @apiError {Object} 500 Internal Server Error.
* @apiError {String} 500.result error.
* @apiError {Object} 500.err Error Message.
**/


var routes = function(){
    var router = express.Router();

    /**
     * @api {get} api/event Get all Events that are active
     * @apiName GetEvent
     * @apiGroup Event
     *
     * @apiUse helpNowHeader
     * @apiUse helpNowSuccessResult
     * @apiUse helpNowUnauthorizedResult
     * @apiSuccess {Object[]} json    The Result data in the form of a json array.
         * @apiSuccess {Number}   json.EventID   Unique ID for the Event.
         * @apiSuccess {Number}   json.EventTypeID Unique ID for the Event Type.
         * @apiSuccess {Number}   json.OrganizationID OrganziationID associated with the Organization for the Event.
         * @apiSuccess {String}   json.Summary Event Title.
         * @apiSuccess {String}   json.Notes Event description or additional information.
         * @apiSuccess {Boolean}   json.Active Status of the event.
         * @apiSuccess {Date}   json.CreateDate Date & Time the Event was created in the system.
         * @apiSuccess {Object[]}   json.EventLocations An Array of EventLocations for the event
         * @apiSuccess {Object[]}   json.Blockages An Array of Blockages for the event.
         * @apiSuccess {Object}   json.EventType the EventType object associated with the event.
         * @apiSuccess {Object}   json.Organization the Organization object associated with the event.
         * @apiSuccess {Object[]}   json.ResourceRequests An Array of ResourceRequests for the event.
         * @apiSuccess {Object[]}   json.ResourceLocations An Array of ResourceLocations for the event.
     */
    router.get('/', function(req, res) {
      models.Event.findAll(
        {
          where: 
          {
            Active: true
          },
          include: [
            
            {model: models.EventLocation},
            // {model: models.SocialMedia},
            // {model: models.Blockage},
            {model: models.EventType},
            {model: models.Organization},
            // {model: models.ResourceRequest},
            // {model: models.ResourceLocation, required: false}
            
          ]
        }
      )
        .then(function(event) {
          res.statusCode = 200;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  event,
              length: event.length
            }
          );
        }
      )
      .catch(function (err) {
       console.error(err);
       res.statusCode = 500;
       res.send({
           result: 'error',
           err:    err.message
       });
      });
    }
  )
  /**
     * @api {get} api/event/mapitems/:eventID Get map items by event ID
     * @apiName GetMapItems
     * @apiGroup Event

     * @apiParam {Number} eventID Event unique ID

     * @apiUse helpNowHeader
     * @apiUse helpNowSuccessResult
     * @apiUse helpNowUnauthorizedResult
     * @apiSuccess {Object} json    The result data in the form of json.
         * @apiSuccess {Object[]}   json.requestClusters an array of ResourceRequest Cluster objects .
         * @apiSuccess {Object[]}   json.requests an array of ResourceRequest objects.
         * @apiSuccess {Object[]}   json.locations an array of ResourceLocation objects of type Deployment for the event.
         * @apiSuccess {Object[]}   json.distributionCenters an array of ResourceLocation objects of type Distribution center for the event.
         
     */
  .get('/mapitems/:eventID', function(req, res) {
      var clusterTasks = [];
	  var tasks = [];

      clusterTasks[0] = models.ResourceRequest.findAll(
          {
              where: {
                  EventID: req.params.eventID
              },
              include: [
                  {model: models.RequestState},
                  {model: models.ResourceType}
              ]
          }
      );

      clusterTasks[1] = models.ResourceLocation.findAll (
          {
          	include: [
          		{
          			model: models.Organization,
          			required: true
                 },
                 {
          			model: models.ResourceLocationType,
          			where: {
          				Description: "Deployment"
          			}
                 },
          		{
          			model: models.ResourceLocationInventory,
          			required: true,
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
          		}
          	],
          	where: {
          		EventID: req.params.eventID
             }
          });
      tasks[0]=promise.all(clusterTasks)
          .then(function(results) {

              var  requests = results[0];
              var  locations = results[1];
              return cluster.clusterRequests(requests, locations);
          });

	  //load requests
	//   tasks[0] = models.ResourceRequest.findAll(
     //    {
     //      where: {
     //        EventID: req.params.eventID
     //      },
     //      include: [
     //        {model: models.RequestState},
     //        {model: models.ResourceType}
     //      ]
     //    }
     //  )
	//   .then(cluster.clusterRequests);
	//
	// //load resource deployments for event
	// tasks[1] = models.ResourceLocation.findAll (
	// {
	// 	include: [
	// 		{
	// 			model: models.Organization,
	// 			required: true
     //        },
     //        {
	// 			model: models.ResourceLocationType,
	// 			where: {
	// 				Description: "Deployment"
	// 			}
     //        },
	// 		{
	// 			model: models.ResourceLocationInventory,
	// 			required: true,
	// 			include: [
	// 			{
	// 				model: models.ResourceType
	// 			},
	// 			{
	// 				model: models.ResourceSubtype
	// 			},
	// 			{
	// 				model: models.ResourceTypeUnitOfMeasure
	// 			}]
	// 		}
	// 	],
	// 	where: {
	// 		EventID: req.params.eventID
     //    }
	// });
	
	//load distribution centers
	tasks[1] = models.ResourceLocation.findAll (
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
			}
		]
	});
	
	//load blockages
	tasks[2] = models.Blockage.findAll (
	{
		where: {
			EventID: req.params.eventID
		}
	});
	
	  //when all data is loaded, send the response
	  promise.all(tasks)
	  .then(function(results) {
		var data = {
			requestClusters: results[0].requestClusters,
			// requests: results[0].requests,
			locations: results[0].locations,
			distributionCenters: results[1],
			blockages: results[2]
		};
		res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  data
          }
        );
	  })
	  .catch(function (err) {
       console.error(err);
       res.statusCode = 500;
       res.send({
           result: 'error',
           err:    err.message
       });
      });
  })
  
    /**
        * @api {get} api/event/:id Get Event by EventID
        * @apiName GetEventByID
        * @apiGroup Event
   
        * @apiParam {Number} id Event unique ID
   
        * @apiUse helpNowHeader
        * @apiUse helpNowSuccessResult
        * @apiUse helpNowUnauthorizedResult
        * @apiSuccess {Object} json    The Result data in the form of json.
         * @apiSuccess {Number}   json.EventID   Unique ID for the Event.
         * @apiSuccess {Number}   json.EventTypeID Unique ID for the Event Type.
         * @apiSuccess {Number}   json.OrganizationID OrganziationID associated with the Organization for the Event.
         * @apiSuccess {String}   json.Summary Event Title.
         * @apiSuccess {String}   json.Notes Event description or additional information.
         * @apiSuccess {Boolean}   json.Active Status of the event.
         * @apiSuccess {Date}   json.CreateDate Date & Time the Event was created in the system.
         * @apiSuccess {Object[]}   json.EventLocations An Array of EventLocations for the event.
         * @apiSuccess {Object[]}   json.Blockages An Array of Blockages for the event.
         * @apiSuccess {Object}   json.EventType the EventType object associated with the event.
         * @apiSuccess {Object}   json.Organization the Organization object associated with the event.
         * @apiSuccess {Object[]}   json.ResourceRequests An Array of ResourceRequests for the event.
         * @apiSuccess {Object[]}   json.ResourceLocations An Array of ResourceLocations for the event.
     */
  .get('/:id', function(req, res) {
      models.Event.findAll(
        {
          where: {
            EventID: req.params.id
          },
          include: [
            {model: models.ResourceLocation},
            {model: models.EventLocation},
            // {model: models.SocialMedia},
            {model: models.Blockage},
            {model: models.EventType},
            {model: models.Organization}
            // {model: models.ResourceRequest}
          ]
        }
      ).then(function(event) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  event,
            length: event.length
          }
        );
      }
     ).catch(function (err) {
       console.error(err);
       res.statusCode = 500;
       res.send({
           result: 'error',
           err:    err.message
       });
      });
    }
  )
  /**
        * @api {post} api/event/ Insert a new Event
        * @apiName PostEvent
        * @apiGroup Event

        * @apiParam {JSON} body representation of the Event object to insert in JSON format
   
        * @apiParam {Number} body.EventTypeID An EventType ID for the EventType to be used
        * @apiParam {Number} body.OrganizationID An Organization ID for the Organization to be used
        * @apiParam {String} body.Summary Short title/desciption of the event
        * @apiParam {String} body.Notes Additional information for the event.
        * @apiParam {Boolean} body.Active Sets the state of the Event
        * @apiParam {Date} body.CreateDate Date the event was created
        * @apiUse helpNowHeader
        * @apiUse helpNowSuccessResult
        * @apiUse helpNowUnauthorizedResult
        * @apiSuccess {Object} json The Event object created from the insert.

        * @apiSuccessExample {json} Success-Response:
             *     HTTP/1.1 200 OK
             *     {
             *       "result": "success",
             *       "err": "",
             *       "json": "<Event object>",
             *     }
 */

  .post('/', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.Event.create(req.body)
    .then(function(event) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  event,
            length: event.length
          }
        );
      }
     ).catch(function (err) {
       console.error(err);
       res.statusCode = 500;
       res.send({
           result: 'error',
           err:    err.message
       });
      });
    }
  )
    /**
        * @api {put} api/event/:id Update an Event
        * @apiName UpdateEvent
        * @apiGroup Event

        * @apiParam {Number} id The unique ID of the Event to update
   
        * @apiParam {JSON} body representation of the Event object to update in JSON format
        
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
              *             1
              *           ]
            *         },
             *         "length": 1
             *     }
 */
  .put('/:id', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.Event.update(
      req.body,
      {
        where: {
          EventID: req.params.id
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
       res.statusCode = 500;
       res.send({
           result: 'error',
           error:  err.message
       });
      });
    }
  )
        /**
        * @api {delete} api/event/:id Delete an Event
        * @apiName DeleteEvent
        * @apiGroup Event

        * @apiParam {Number} id The unique ID of the Event to delete
        
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
  .delete('/:id', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.Event.destroy(
      {
        where: {
          EventID: req.params.id
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
       res.statusCode = 500;
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