var models  = require('../models'),
    express = require('express');


//OrganizationGroup many-to-One on Organization
models.Organization.hasMany(models.OrganizationGroup, {foreignKey: 'OrganizationID'});
models.OrganizationGroup.belongsTo(models.Organization, {foreignKey: 'OrganizationID'});

//OrganizationGroup many-to-One on Address
models.Address.hasMany(models.OrganizationGroup, {foreignKey: 'AddressID'});
models.OrganizationGroup.belongsTo(models.Address, {foreignKey: 'AddressID'});

//OrganizationGroup many-to-One on Account (PrimaryPOC attribute)
// models.Account.hasMany(models.OrganizationGroup, {foreignKey: 'AccountID'});
models.OrganizationGroup.belongsTo(models.Account, {as: 'PrimaryPOCAccount', foreignKey: 'PrimaryPOC'});

//OrganizationGroup many-to-One on Account (SecondaryPOC attribute)
// models.Account.hasMany(models.OrganizationGroup, {foreignKey: 'AccountID'});
models.OrganizationGroup.belongsTo(models.Account, {as: 'SecondaryPOCAccount', foreignKey: 'SecondaryPOC'});

var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.OrganizationGroup.findAll(
        {
          include: [
            {model: models.Organization},
            {model: models.Address},
            {model: models.Account, as: 'PrimaryPOCAccount'},
            {model: models.Account, as: 'SecondaryPOCAccount'}
          ]
        }
      )
        .then(function(organizationgroup) {
          res.statusCode = 201;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  organizationgroup,
              length: organizationgroup.length
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
  //find OrganizationGroup by ID
  .get('/:id', function(req, res) {
      models.OrganizationGroup.findAll(
        {
          where: {
            OrganizationGroupID: req.params.id
          },
          include: [
            {model: models.Organization},
            {model: models.Address},
            {model: models.Account, as: 'PrimaryPOCAccount'},
            {model: models.Account, as: 'SecondaryPOCAccount'}
          ]
        }
      ).then(function(organizationgroup) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  organizationgroup,
            length: organizationgroup.length
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
//   )
//   //insert into OrganizationType
//   .post('/', function(req, res) {
//     models.Organization.create(req.body)
//     .then(function(organization) {
//         res.statusCode = 200;
//         res.send(
//           {
//             result: 'success',
//             err:    '',
//             json:  organization,
//             length: organization.length
//           }
//         );
//       }
//      ).catch(function (err) {
//        console.error(err);
//        res.statusCode = 502;
//        res.send({
//            result: 'error',
//            err:    err.message
//        });
//       });
//     }
//   )
//   //update into Organization
//   .put('/:id', function(req, res) {
//     models.Organization.update(
//       req.body,
//       {
//         where: {
//           OrganizationID: req.params.id
//         }
//       }
//     )
//     .then(function(rowsUpdated) {
//         res.statusCode = 200;
//         res.send(
//           {
//             result: 'success',
//             err:    '',
//             json:  {rows: rowsUpdated},
//             length: rowsUpdated.length
//           }
//         );
//       }
//      ).catch(function (err) {
//        console.error(err);
//        res.statusCode = 502;
//        res.send({
//            result: 'error',
//            error:  err.message
//        });
//       });
//     }
//   )
//   .delete('/:id', function(req, res) {
//     models.Organization.destroy(
//       {
//         where: {
//           OrganizationID: req.params.id
//         }
//       }
//     )
//     .then(function(numDelete) {
//         res.statusCode = 200;
//         res.send(
//           {
//             result: 'success',
//             err:    '',
//             json:  {rows: numDelete}
//           }
//         );
//       }
//      ).catch(function (err) {
//        console.error(err);
//        res.statusCode = 502;
//        res.send({
//            result: 'error',
//            err:    err.message
//        });
//       });
//     }
//   );
  
  return router;
}

module.exports = routes;