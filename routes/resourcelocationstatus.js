
var models = require('../models'),
    express = require('express'),
    passport = require('passport');

//ResourceLocationStatus one-to-many on ResourceLocation   
models.ResourceLocationStatus.hasMany(models.ResourceLocation, { foreignKey: 'ResourceLocationStatusID' });
models.ResourceLocation.belongsTo(models.ResourceLocationStatus, { foreignKey: 'ResourceLocationStatusID' });

var routes = function () {
    var router = express.Router();
    router.get('/', function (req, res) {
        models.ResourceLocationStatus.findAll(
          // {
          //   include: [
          //     {model: models.ResourceLocation}
          //   ]
          // }
        )
          .then(function (resourceLocationStatus) {
              res.statusCode = 200;
              res.send(
                {
                    result: 'success',
                    err: '',
                    json: resourceLocationStatus,
                    length: resourceLocationStatus.length
                }
              );
          }
        )
        .catch(function (err) {
            console.error(err);
            res.statusCode = 502;
            res.send({
                result: 'error',
                err: err.message
            });
        });
    }
  )
  //find ResourceLocationStatus by ID
  .get('/:id', function (req, res) {
      models.ResourceLocationStatus.findAll(
        {
            where: {
                ResourceLocationStatusID: req.params.id
            }
            //,
            //include: [
            //  { model: models.ResourceLocation }
            //]
        }
      ).then(function (resourceLocationStatus) {
          res.statusCode = 200;
          res.send(
            {
                result: 'success',
                err: '',
                json: resourceLocationStatus,
                length: resourceLocationStatus.length
            }
          );
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
  //insert into ResourceLocationStatus
  .post('/', passport.authenticate('jwt-auth-api', {session:false}), function (req, res) {
      models.ResourceLocationStatus.create(req.body)
      .then(function (resourceLocationStatus) {
          res.statusCode = 200;
          res.send(
            {
                result: 'success',
                err: '',
                json: resourceLocationStatus,
                length: resourceLocationStatus.length
            }
          );
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
  //update into ResourceLocationStatus
  .put('/:id', passport.authenticate('jwt-auth-api', {session:false}), function (req, res) {
      models.ResourceLocationStatus.update(
        req.body,
        {
            where: {
                ResourceLocationStatusID: req.params.id
            }
        }
      )
      .then(function (rowsUpdated) {
          res.statusCode = 200;
          res.send(
            {
                result: 'success',
                err: '',
                json: { rows: rowsUpdated },
                length: rowsUpdated.length
            }
          );
      }
       ).catch(function (err) {
           console.error(err);
           res.statusCode = 502;
           res.send({
               result: 'error',
               error: err.message
           });
       });
  }
  )
  .delete('/:id', passport.authenticate('jwt-auth-api', {session:false}), function (req, res) {
      models.ResourceLocationStatus.destroy(
        {
            where: {
                ResourceLocationStatusID: req.params.id
            }
        }
      )
      .then(function (numDelete) {
          res.statusCode = 200;
          res.send(
            {
                result: 'success',
                err: '',
                json: { rows: numDelete }
            }
          );
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
  );

    return router;
}

module.exports = routes;