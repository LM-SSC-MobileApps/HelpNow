
var models  = require('../models'),
    express = require('express');


//Organization one-to-many on OrganizationRegulations    
models.Organization.hasMany(models.OrganizationRegulations, {foreignKey: 'OrganizationID'});
models.OrganizationRegulations.belongsTo(models.Organization, {foreignKey: 'OrganizationID'});

//Organization one-to-one on OrganizationType
models.Organization.hasOne(models.OrganizationType, {foreignKey: 'OrganizationTypeID'});
models.OrganizationType.belongsTo(models.Organization, {foreignKey: 'OrganizationTypeID'});

//Organization one-to-many on ResourceRegistry
models.Organization.hasMany(models.ResourceRegistry, {foreignKey: 'OrganizationID'});
models.ResourceRegistry.belongsTo(models.Organization, {foreignKey: 'OrganizationID'});

//Organization many-to-One on Event
models.Organization.hasMany(models.Event, {foreignKey: 'OrganizationID'});
models.Event.belongsTo(models.Organization, {foreignKey: 'OrganizationID'});


var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.Organization.findAll(
        {
          include: [
            {model: models.OrganizationRegulations},
            {model: models.OrganizationType},
            {model: models.Event},
            {model: models.ResourceRegistry}
          ]
        }
      )
        .then(function(organization) {
          res.statusCode = 201;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  organization,
              length: organization.length
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
  //find Organization by ID
  .get('/:id', function(req, res) {
      models.Organization.findAll(
        {
          where: {
            OrganizationID: req.params.id
          },
          include: [
            {model: models.OrganizationRegulations},
            {model: models.OrganizationType},
            {model: models.Event},
            {model: models.ResourceRegistry}
          ]
        }
      ).then(function(organization) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  organization,
            length: organization.length
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
  .post('/', function(req, res) {
    models.Organization.create(req.body)
    .then(function(organization) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  organization,
            length: organization.length
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
  //update into Organization
  .put('/:id', function(req, res) {
    models.Organization.update(
      req.body,
      {
        where: {
          OrganizationID: req.params.id
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
    models.Organization.destroy(
      {
        where: {
          OrganizationID: req.params.id
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