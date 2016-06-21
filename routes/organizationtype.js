
var models  = require('../models'),
    express = require('express'),
    passport = require('passport');

var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.OrganizationType.findAll()
        .then(function(organizationType) {
          res.statusCode = 200;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  organizationType,
              length: organizationType.length
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
  //find OrganizationType by ID
  .get('/:id', function(req, res) {
      models.OrganizationType.findAll(
        {
          where: {
            OrganizationTypeID: req.params.id
          }
        }
      ).then(function(organizationType) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  organizationType,
            length: organizationType.length
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
  //insert into OrganizationType
  .post('/', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.OrganizationType.create(req.body)
    .then(function(organizationType) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  organizationType,
            length: organizationType.length
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
  //update into OrganizationType
  .put('/:id', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.OrganizationType.update(
      req.body
      ,
      {
        where: {
          OrganizationTypeID: req.params.id
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
  .delete('/:id', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.OrganizationType.destroy(
      {
        where: {
          OrganizationTypeID: req.params.id
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