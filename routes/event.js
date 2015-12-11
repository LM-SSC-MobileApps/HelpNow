var promise = require('bluebird');
var cluster = require('../modules/cluster');
var models  = require('../models'),
    express = require('express');

//Event one-to-many on EventLocation    
models.Event.hasMany(models.EventLocation, {foreignKey: 'EventID'});
models.EventLocation.belongsTo(models.Event, {foreignKey: 'EventID'});

//Event one-to-one on EventType
models.Event.hasOne(models.EventType, {foreignKey: 'EventTypeID'});
models.EventType.belongsTo(models.Event, {foreignKey: 'EventTypeID'});

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
models.TransportType.hasMany(models.ResourceLocationTransport, {foreignKey: 'TransportTypeID'});


var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.Event.findAll(
        {
          where: 
          {
            Active: true
          },
          include: [
            
            {model: models.EventLocation},
            {model: models.EventType},
            {model: models.Organization},
            {model: models.ResourceRequest},
            {model: models.ResourceLocation, required: false}
            
          ]
        }
      )
        .then(function(event) {
          res.statusCode = 201;
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
       res.statusCode = 502;
       res.send({
           result: 'error',
           err:    err.message
       });
      });
    }
  )
  //find Map Items for Event
  .get('/mapitems/:eventID', function(req, res) {
	  var tasks = [];
	  
	  //load requests
	  tasks[0] = models.ResourceRequest.findAll(
        {
          where: {
            EventID: req.params.eventID
          },
          include: [
            {model: models.RequestState},
            {model: models.ResourceType}
          ]
        }
      )
	  .then(cluster.clusterRequests);
	
	//load resource deployments for event
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
					model: models.ResourceTypeUnitOfMeasure
				}]
			}
		],
		where: {
			EventID: req.params.eventID
        }
	});
	
	//load distribution centers
	tasks[2] = models.ResourceLocation.findAll (
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
				required: true,
				include: [
				{
					model: models.ResourceType
				},
				{
					model: models.ResourceTypeUnitOfMeasure
				}]
			}
		]
	});
	
	
	
	  //when all data is loaded, send the response
	  promise.all(tasks)
	  .then(function(results) {
		var data = {
			requestClusters: results[0].requestClusters,
			requests: results[0].requests,
			locations: results[1],
			distributionCenters: results[2]
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
       res.statusCode = 502;
       res.send({
           result: 'error',
           err:    err.message
       });
      });
  })
  
  //find Event by ID
  .get('/:id', function(req, res) {
      models.Event.findAll(
        {
          where: {
            EventID: req.params.id
          },
          include: [
            {model: models.ResourceLocation},
            {model: models.EventLocation},
            {model: models.EventType},
            {model: models.Organization},
            {model: models.ResourceRequest}
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
       res.statusCode = 502;
       res.send({
           result: 'error',
           err:    err.message
       });
      });
    }
  )
  //insert into Event
  .post('/', function(req, res) {
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
       res.statusCode = 502;
       res.send({
           result: 'error',
           err:    err.message
       });
      });
    }
  )
  //update into Event
  .put('/:id', function(req, res) {
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
       res.statusCode = 502;
       res.send({
           result: 'error',
           error:  err.message
       });
      });
    }
  )
  .delete('/:id', function(req, res) {
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