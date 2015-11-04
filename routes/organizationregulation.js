
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
  //find OrgainzationsRegulations by AccountID
  .get('/account/:id', function(req, res) {
        //get the distinct organizatins where the account is either primary or secondary poc
        var query = "select distinct(OrganizationID) from OrganizationGroup WHERE (PrimaryPOC = "+req.params.id+" OR SecondaryPOC = "+req.params.id+")";
        models.sequelize.query(query, { type: models.sequelize.QueryTypes.SELECT}
      ).then(function(orgIDs) {
        var promises = [];
        orgIDs.forEach(
          function(element)
          {
            console.info("here is the org id: "+element.OrganizationID);
            promises.push(
              models.OrganizationRegulations.findAll(
                {
                  where: {
                    OrganizationID: element.OrganizationID
                  }
                }
              )  
            );
          }
        );
        return Promise.all(promises);
      }
     ).then(function(organizationRegulations) {
       var orgRegs = [];
       //instead of returning an array for each result, we combine them into one array or OrganizaitonRegulations
       organizationRegulations.forEach(function(element) {
         element.forEach(function(organizationReg) {
           orgRegs.push(organizationReg);
         }, this);
       }, this);
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  orgRegs,
            length: orgRegs.length
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