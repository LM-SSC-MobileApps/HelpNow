
// var models  = require('../models'),
//     express = require('express');


// //ResourceRegistry many-to-One on Organization
// models.Organization.hasMany(models.ResourceRegistry, {foreignKey: 'OrganizationID'});
// models.ResourceRegistry.belongsTo(models.Organization, {foreignKey: 'OrganizationID'});

// //ResourceRegistry many-to-One on Event
// models.Event.hasMany(models.ResourceRegistry, {foreignKey: 'EventID'});
// models.ResourceRegistry.belongsTo(models.Event, {foreignKey: 'EventID'});

// //ResourceRegistry one-to-many on ResourceLocation
// models.ResourceRegistry.hasMany(models.ResourceLocation, {foreignKey: 'ResourceRegistryID'});
// models.ResourceLocation.belongsTo(models.ResourceRegistry, {foreignKey: 'ResourceRegistryID'});


// var routes = function(){
//   var router  = express.Router();
//     router.get('/', function(req, res) {
//       models.ResourceRegistry.findAll(
//         {
//           include: [
//             {model: models.Organization},
//             {model: models.Event},
//             {model: models.ResourceLocation}
//           ]
//         }
//       )
//         .then(function(resourceRegistry) {
//           res.statusCode = 201;
//           res.send(
//             {
//               result: 'success',
//               err:    '',
//               json:  resourceRegistry,
//               length: resourceRegistry.length
//             }
//           );
//         }
//       )
//       .catch(function (err) {
//        console.error(err);
//        res.statusCode = 502;
//        res.send({
//            result: 'error',
//            err:    err.message
//        });
//       });
//     }
//   )
//   //find ResourceRegistry by ID
//   .get('/:id', function(req, res) {
//       models.ResourceRegistry.findAll(
//         {
//           where: {
//             ResourceRegistryID: req.params.id
//           },
//           include: [
//             {model: models.Organization},
//             {model: models.Event},
//             {model: models.ResourceLocation}
//           ]
//         }
//       ).then(function(resourceRegistry) {
//         res.statusCode = 200;
//         res.send(
//           {
//             result: 'success',
//             err:    '',
//             json:  resourceRegistry,
//             length: resourceRegistry.length
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
//   //insert into ResourceRegistry
//   .post('/', function(req, res) {
//     models.ResourceRegistry.create(req.body)
//     .then(function(resourceRegistry) {
//         res.statusCode = 200;
//         res.send(
//           {
//             result: 'success',
//             err:    '',
//             json:  resourceRegistry,
//             length: resourceRegistry.length
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
//   //update into ResourceRegistry
//   .put('/:id', function(req, res) {
//     models.ResourceRegistry.update(
//       req.body,
//       {
//         where: {
//           ResourceRegistryID: req.params.id
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
//     models.ResourceRegistry.destroy(
//       {
//         where: {
//           ResourceRegistryID: req.params.id
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
  
//   return router;
// }

// module.exports = routes;