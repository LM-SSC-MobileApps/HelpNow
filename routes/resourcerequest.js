
var models  = require('../models'),
    express = require('express');

//ResourceRequest one-to-one on RequestState
models.ResourceRequest.belongsTo(models.RequestState, {foreignKey: 'RequestStateID'});

//ResourceRequest one-to-one on ResourceType
models.ResourceRequest.belongsTo(models.ResourceType, {foreignKey: 'ResourceTypeID'});

//ResourceRequest one-to-many on ResourceResponse
models.ResourceRequest.hasMany(models.ResourceResponse, {foreignKey: 'ResourceRequestID'});
models.ResourceResponse.belongsTo(models.ResourceRequest, {foreignKey: 'ResourceRequestID'});

//ResourceRequest many-to-One on Event
models.Event.hasMany(models.ResourceRequest, {foreignKey: 'EventID'});
models.ResourceRequest.belongsTo(models.Event, {foreignKey: 'EventID'});

//ResourceRequest many-to-One on RequestUrgency
models.RequestUrgency.hasMany(models.ResourceRequest, {foreignKey: 'RequestUrgencyID'});
models.ResourceRequest.belongsTo(models.RequestUrgency, {foreignKey: 'RequestUrgencyID'});

var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.ResourceRequest.findAll(
        {
          include: [
            {model: models.Event},
            {model: models.RequestState},
            {model: models.ResourceResponse},
            // {model: models.ResourceRegistry},
            {model: models.RequestUrgency}
          ]
        }        
      )
        .then(function(resourceRequest) {
          res.statusCode = 201;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  resourceRequest,
              length: resourceRequest.length
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
  //find ResourceRequest by ID
  .get('/:id', function(req, res) {
      models.ResourceRequest.findAll(
        {
          where: {
            ResourceRequestID: req.params.id
          },
          include: [
            {model: models.Event},
            {model: models.RequestState},
            {model: models.ResourceResponse},
            // {model: models.ResourceRegistry},
            {model: models.RequestUrgency}
          ]
        }
      ).then(function(resourceRequest) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  resourceRequest,
            length: resourceRequest.length
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
  //find ResourceRequest by event ID
  .get('/event/:eventID', function(req, res) {
      models.ResourceRequest.findAll(
        {
          where: {
            EventID: req.params.eventID
          },
          include: [
            {model: models.RequestState},
            {model: models.ResourceType},
            {model: models.RequestUrgency}
          ]
        }
      ).then(function(resourceRequest) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  resourceRequest,
            length: resourceRequest.length
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
  //insert into ResourceRequest
  .post('/', function(req, res) {
    models.ResourceRequest.create(req.body)
    .then(function(resourceRequest) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  resourceRequest,
            length: resourceRequest.length
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
  //update into ResourceRequest
  .put('/:id', function(req, res) {
    models.ResourceRequest.update(
      req.body,
      {
        where: {
          ResourceRequestID: req.params.id
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
    models.ResourceRequest.destroy(
      {
        where: {
          ResourceRequestID: req.params.id
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