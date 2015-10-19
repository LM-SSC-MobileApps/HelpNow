
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