
var models  = require('../models'),
    express = require('express'),
    passport = require('passport');

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
    var router = express.Router();
    /**
        * @api {get} api/resourcerequest Get all ResourceRequests
        * @apiName GetResourceRequests
        * @apiGroup ResourceRequest
        *
        * @apiUse helpNowHeader
        * @apiUse helpNowSuccessResult
        * @apiUse helpNowUnauthorizedResult
        * @apiSuccess {Object[]} json    The Result data in the form of a json array of ResourceRequest objects.
        * @apiSuccess {Number} json.RequestResourceID The RequestResource ID for the ResourceRequest object.
        * @apiSuccess {Number} json.EventID An Event ID for the Event associated with the ResourceRequest
        * @apiSuccess {Number} json.RequestStateID An RequestState ID for the RequestState to be used
        * @apiSuccess {Number} json.OrganizationID An Organization ID for the Organization to be used
        * @apiSuccess {Number} json.Quantity Number of resources needed
        * @apiSuccess {Number} json.ResourceTypeID An ResourceType ID for the ResourceType to be used
        * @apiSuccess {Float} json.LAT Lattitude coordinate for the location of the ResourceRequest
        * @apiSuccess {Float} json.LONG Longitude coordinate for the location of the ResourceRequest
        * @apiSuccess {Decimal} json.AreaSize The area size for the ResourceRequest
        * @apiSuccess {Number} json.RequestUrgencyID A ResourceUrgency ID for the ResourceUrgency to be used
        * @apiSuccess {String} json.UnitOfMeasure for the AreaSize
        * @apiSuccess {String} json.RequestorName Individual who is creating the request
        * @apiSuccess {String} json.RequestorPhone Contact phone number for who is creating the request
        * @apiSuccess {String} json.RequestorEmail Email address for who is creating the request
        * @apiSuccess {Boolean} json.RequestorUpdatePref indicates if Requestor would like to be updated on request status
        * @apiSuccess {Date} json.CreateDate Date the ResourceRequest was created.
        * @apiSuccess {Object}   json.Event the Event object associated with the ResourceRequest.
        * @apiSuccess {Object}   json.RequestState the RequestState object associated with the ResourceRequest.
        * @apiSuccess {Object[]}   json.ResourceResponses An Array of ResourceResponses for the ResourceRequest.
        * @apiSuccess {Object[]}   json.RequestUrgency the RequestUrgency object associated with the ResourceRequest.
     */


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
  /**
        * @api {get} api/resourcerequest/:id Get ResourceRequest by ResourceRequestID
        * @apiName GetResourceRequestByID
        * @apiGroup ResourceRequest

        * @apiParam {Number} id ResourceRequest unique ID
        *
        * @apiUse helpNowHeader
        * @apiUse helpNowSuccessResult
        * @apiUse helpNowUnauthorizedResult
        * @apiSuccess {Object} json    The result data in the form of a json ResourceRequest object.
     */
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
  /**
        * @api {get} api/resourcerequest/event/:eventID Get ResourceRequests by Event ID
        * @apiName GetResourceRequestByEventID
        * @apiGroup ResourceRequest

        * @apiParam {Number} eventID Event unique ID
        *
        * @apiUse helpNowHeader
        * @apiUse helpNowSuccessResult
        * @apiUse helpNowUnauthorizedResult
        * @apiSuccess {Object} json    The result data in the form of a json array ResourceRequest objects.
     */
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
  /**
        * @api {post} api/resourcerequest/ Insert a new ResourceRequest
        * @apiName PostResourceRequest
        * @apiGroup ResourceRequest
   
        * @apiParam {JSON} body representation of the ResourceRequest object to insert in JSON format
        
        * @apiParam {Number} body.EventID An Event ID for the Event associated with the ResourceRequest
        * @apiParam {Number} body.RequestStateID An RequestState ID for the RequestState to be used
        * @apiParam {Number} body.OrganizationID An Organization ID for the Organization to be used
        * @apiParam {Number} body.Quantity Number of resources needed
        * @apiParam {Number} body.ResourceTypeID An ResourceType ID for the ResourceType to be used
        * @apiParam {Float} body.LAT Lattitude coordinate for the location of the ResourceRequest
        * @apiParam {Float} body.LONG Longitude coordinate for the location of the ResourceRequest
        * @apiParam {Decimal} body.AreaSize The area size for the ResourceRequest
        * @apiParam {Number} body.RequestUrgencyID A ResourceUrgency ID for the ResourceUrgency to be used
        * @apiParam {String} body.UnitOfMeasure for the AreaSize
        * @apiParam {String} body.RequestorName Individual who is creating the request
        * @apiParam {String} body.RequestorPhone Contact phone number for who is creating the request
        * @apiParam {String} body.RequestorEmail Email address for who is creating the request
        * @apiParam {Boolean} body.RequestorUpdatePref indicates if Requestor would like to be updated on request status

        * @apiUse helpNowHeader
        * @apiUse helpNowSuccessResult
        * @apiUse helpNowUnauthorizedResult
        * @apiSuccess {Object} json The ResourceRequest object created from the insert.

        * @apiSuccessExample {json} Success-Response:
             *     HTTP/1.1 200 OK
             *     {
             *       "result": "success",
             *       "err": "",
             *       "json": "<ResourceRequest object>",
             *     }
 */
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
  /**
        * @api {put} api/resourcerequest/:id Update a ResourceRequest
        * @apiName UpdateResourceRequest
        * @apiGroup ResourceRequest

        * @apiParam {Number} id The unique ID of the ResourceRequest to update
   
        * @apiParam {JSON} body representation of the ResourceRequest object to update in JSON format
        
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
        /**
        * @api {delete} api/resourcerequest/:id Delete a ResourceRequest
        * @apiName DeleteResourceRequest
        * @apiGroup ResourceRequest

        * @apiParam {Number} id The unique ID of the ResourceRequest to delete
        
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
  )

  .delete('/', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.ResourceRequest.destroy(
	{
		where: {}
	})
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