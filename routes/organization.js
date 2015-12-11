
var models  = require('../models'),
    express = require('express');


//Organization one-to-many on OrganizationRegulations    
models.Organization.hasMany(models.OrganizationRegulations, {foreignKey: 'OrganizationID'});
models.OrganizationRegulations.belongsTo(models.Organization, {foreignKey: 'OrganizationID'});

//Organization one-to-one on OrganizationType
models.Organization.hasOne(models.OrganizationType, {foreignKey: 'OrganizationTypeID'});
models.OrganizationType.belongsTo(models.Organization, {foreignKey: 'OrganizationTypeID'});

//Organization one-to-many on ResourceLocation
models.Organization.hasMany(models.ResourceLocation, {foreignKey: 'OrganizationID'});
models.ResourceLocation.belongsTo(models.Organization, {foreignKey: 'OrganizationID'});

//Organization many-to-One on Event
models.Organization.hasMany(models.Event, {foreignKey: 'OrganizationID'});
models.Event.belongsTo(models.Organization, {foreignKey: 'OrganizationID'});


//OrganizationGroup many-to-One on Address
models.Address.hasMany(models.Organization, {foreignKey: 'AddressID'});
models.Organization.belongsTo(models.Address, {foreignKey: 'AddressID'});

//OrganizationGroup many-to-One on Account (PrimaryPOC attribute)
// models.Account.hasMany(models.OrganizationGroup, {foreignKey: 'AccountID'});
models.Organization.belongsTo(models.Account, {as: 'PrimaryPOCAccount', foreignKey: 'PrimaryPOC'});

//OrganizationGroup many-to-One on Account (SecondaryPOC attribute)
// models.Account.hasMany(models.OrganizationGroup, {foreignKey: 'AccountID'});
models.Organization.belongsTo(models.Account, {as: 'SecondaryPOCAccount', foreignKey: 'SecondaryPOC'});


var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.Organization.findAll(
        {
          include: [
            {model: models.OrganizationRegulations},
            {model: models.OrganizationType},
            {model: models.Event},
            {model: models.ResourceLocation}
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
            {model: models.ResourceLocation}
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
  //find Orgainzation by AccountID
  .get('/account/:id', function(req, res) {
        //get the distinct organizations where the account is either primary or secondary poc
        var query = "select distinct(OrganizationID) from OrganizationGroup WHERE (PrimaryPOC = "+req.params.id+" OR SecondaryPOC = "+req.params.id+")";
        models.sequelize.query(query, { type: models.sequelize.QueryTypes.SELECT}
      ).then(function(orgIDs) {
        var promises = [];
        orgIDs.forEach(
          function(element)
          {
            console.info("here is the org id: "+element.OrganizationID);
            promises.push(
              models.Organization.findAll(
                {
                  where: {
                    OrganizationID: element.OrganizationID
                  },
                    include: [
                      {model: models.OrganizationType}
                    ]
                }
              )  
            );
          }
        );
        return Promise.all(promises);
      }
     ).then(function(organizations) {
       var orgs = [];
       //instead of returning an array for each result, we combine them into one array or Organizaiton
       organizations.forEach(function(organzation) {
         orgs.push(organzation);
       }, this);
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  orgs,
            length: orgs.length
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