
var models  = require('../models'),
    express = require('express');

var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.OrganizationRegulations.findAll()
        .then(function(organizationRegulations) {
          res.statusCode = 201;
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
  //find OrganizationRegulations by ID
  .get('/:id', function(req, res) {
      models.OrganizationRegulations.findAll(
        {
          where: {
            AccountID: req.params.id
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
  //insert into OrganizationRegulations
  .post('/', function(req, res) {
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
  //update into OrganizationRegulations
  .put('/:id', function(req, res) {
    models.OrganizationRegulations.update(
      req.body,
      {
        where: {
          AccountID: req.params.id
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
    models.OrganizationRegulations.destroy(
      {
        where: {
          AccountID: req.params.id
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