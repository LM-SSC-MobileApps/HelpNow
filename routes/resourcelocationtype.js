
var models  = require('../models'),
    express = require('express'),
    passport = require('passport');
    
//ResourceLocationType one-to-many on ResourceLocation   
models.ResourceLocationType.hasMany(models.ResourceLocation, {foreignKey: 'ResourceLocationTypeID'});
models.ResourceLocation.belongsTo(models.ResourceLocationType, {foreignKey: 'ResourceLocationTypeID'});

var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.ResourceLocationType.findAll(
        // {
        //   include: [
        //     {model: models.ResourceLocation}
        //   ]
        // }
      )
        .then(function(resourceLocationType) {
          res.statusCode = 200;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  resourceLocationType,
              length: resourceLocationType.length
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
  //find ResourceLocationType by ID - included ResourceLocations
  .get('/:id', function(req, res) {
      models.ResourceLocationType.findAll(
        {
          where: {
            ResourceLocationTypeID: req.params.id
          },
          include: [
            {model: models.ResourceLocation}
          ]
        }
      ).then(function(resourceLocationType) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  resourceLocationType,
            length: resourceLocationType.length
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
  //insert into ResourceLocationType
  .post('/', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.ResourceLocationType.create(req.body)
    .then(function(resourceLocationType) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  resourceLocationType,
            length: resourceLocationType.length
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
  //update into ResourceLocationType
  .put('/:id', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.ResourceLocationType.update(
      req.body,
      {
        where: {
          ResourceLocationTypeID: req.params.id
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
    models.ResourceLocationType.destroy(
      {
        where: {
          ResourceLocationTypeID: req.params.id
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