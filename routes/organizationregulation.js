
var models  = require('../models'),
    express = require('express'),
    passport = require('passport');

var routes = function(){
    var router = express.Router();

    /**
        * @api {get} api/organizationregulation Get all OrganizationRegulations
        * @apiName GetOrganizationRegulations
        * @apiGroup OrganizationRegulation
        *
        * @apiUse helpNowHeader
        * @apiUse helpNowSuccessResult
        * @apiUse helpNowUnauthorizedResult
        * @apiSuccess {Object[]} json    The result data in the form of a json array of OrganizationRegulation objects.
        * @apiSuccess {Number} json.OrganizationRegulationsID The OrganizationRegulation ID for the OrganizationRegulation object.
        * @apiSuccess {Number} json.OrganizationID An Organization ID for the Organization associated
        * @apiSuccess {String} json.Summary Title/Description of the OrganizationRegulation
        * @apiSuccess {String} json.Narrative Text of the OrganizationRegulation
     */
    router.get('/', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
      models.OrganizationRegulations.findAll()
        .then(function(organizationRegulations) {
          res.statusCode = 200;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  organizationRegulations,
              length: organizationRegulations.length
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
        * @api {get} api/organizationregulation/:id Get OrganizationRegulation by OrganizationRegulationID
        * @apiName GetOrganizationRegulationByID
        * @apiGroup OrganizationRegulation

        * @apiParam {Number} id OrganizationRegulation unique ID
        *
        * @apiUse helpNowHeader
        * @apiUse helpNowSuccessResult
        * @apiUse helpNowUnauthorizedResult
        * @apiSuccess {Object} json    The result data in the form of a json OrganizationRegulation object.
    */
  .get('/:id', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
      models.OrganizationRegulations.findAll(
        {
          where: {
            OrganizationRegulationsID: req.params.id
          }
        }
      ).then(function(organizationRegulations) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  organizationRegulations,
            length: organizationRegulations.length
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
        * @api {get} api/organizationregulation/account/:id Get OrganizationRegulations by AccountID
        * @apiName GetOrganizationRegulationByAccountID
        * @apiGroup OrganizationRegulation

        * @apiParam {Number} id Account unique ID
        *
        * @apiUse helpNowHeader
        * @apiUse helpNowSuccessResult
        * @apiUse helpNowUnauthorizedResult
        * @apiSuccess {Object} json    The result data in the form of a json array of OrganizationRegulation objects.
    */
  .get('/account/:id', passport.authenticate('jwt-auth-api', {session:false}), function (req, res) {
      models.Account.findAll(
        {
          include: [
            {
              model: models.Organization,
            }
          ],
          where: {
            AccountID: req.params.id,
            Active: true
          }
        }
      ).then(function (account) {
          if (account.length>0)
          {
            models.OrganizationRegulations.findAll({
                where: {
                  OrganizationID: account[0].OrganizationID
                }
              }
            ).then(function (orgreg) {
                res.statusCode = 200;
                res.send(
                  {
                      result: 'success',
                      err: '',
                      json: orgreg,
                      length: orgreg.length
                  }
                );
              }
            );
          }
          else
          {
            res.statusCode = 200;
                res.send(
                  {
                      result: 'success',
                      err: '',
                      json: account,
                      length: account.length
                  }
                );
          }
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
        * @api {post} api/organizationregulation/ Insert a new OrganizationRegulation
        * @apiName PostOrganizationRegulation
        * @apiGroup OrganizationRegulation
   
        * @apiParam {JSON} body representation of the OrganizationRegulations object to insert in JSON format
        
        * @apiParam {Number} body.OrganizationID An RequestState ID for the RequestState to be used
        * @apiParam {String} body.Summary Title/Description of the OrganizationRegulation
        * @apiParam {String} body.Narrative Text of the OrganizationRegulation

        * @apiUse helpNowHeader
        * @apiUse helpNowSuccessResult
        * @apiUse helpNowUnauthorizedResult
        * @apiSuccess {Object} json The OrganizationRegulations object created from the insert.

        * @apiSuccessExample {json} Success-Response:
             *     HTTP/1.1 200 OK
             *     {
             *       "result": "success",
             *       "err": "",
             *       "json": "<OrganizationRegulation object>",
             *     }
 */
  .post('/', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.OrganizationRegulations.create(req.body)
    .then(function(organizationRegulations) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  organizationRegulations,
            length: organizationRegulations.length
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
        * @api {put} api/organizationregulation/:id Update an OrganizationRegulation
        * @apiName UpdateOrganizationRegulation
        * @apiGroup OrganizationRegulation

        * @apiParam {Number} id The unique ID of the OrganizationRegulation to update
   
        * @apiParam {JSON} body representation of the OrganizationRegulations object to update in JSON format
        
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
    models.OrganizationRegulations.update(
      req.body,
      {
        where: {
            OrganizationRegulationsID: req.params.id
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
        * @api {delete} api/organizationregulation/:id Delete a OrganizationRegulation
        * @apiName DeleteOrganizationRegulation
        * @apiGroup OrganizationRegulation

        * @apiParam {Number} id The unique ID of the OrganizationRegulation to delete
        
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
    models.OrganizationRegulations.destroy(
      {
        where: {
            OrganizationRegulationsID: req.params.id
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