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

//Event one-to-many on ResourceRegistry
models.Event.hasMany(models.ResourceRegistry, {foreignKey: 'EventID'});
models.ResourceRegistry.belongsTo(models.Event, {foreignKey: 'EventID'});

//Event many-to-One on Organization
models.Organization.hasMany(models.Event, {foreignKey: 'OrganizationID'});
models.Event.belongsTo(models.Organization, {foreignKey: 'OrganizationID'});

//ResourceLocation one-to-many on ResourceLocationInventory
models.ResourceLocation.hasMany(models.ResourceLocationInventory, {foreignKey: 'ResourceLocationID'});
models.ResourceLocationInventory.belongsTo(models.ResourceLocation, {foreignKey: 'ResourceLocationID'});

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
            {model: models.ResourceRegistry}
            
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
	  
	  //load resource locations
	  tasks[1] = models.ResourceRegistry.findAll(
		{
		  where: {
			   EventID: req.params.eventID
		  },
      include: [
        {model: models.ResourceLocation,
          include: [{
            model: models.ResourceLocationInventory,
              include: [
                  {
                    model: models.ResourceType,
                    required: false
                  },
                  {
                    model: models.ResourceTypeUnitOfMeasure,
                    required: false
                  }
              ],
            required: false
          }]
        },
        {model: models.Organization}
      ]
	  });
	  
	  //when all data is loaded, send the response
	  promise.all(tasks)
	  .then(function(results) {
		var data = {
			requestClusters: results[0].requestClusters,
			requests: results[0].requests,
			locations: results[1]
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
            {model: models.ResourceRegistry},
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