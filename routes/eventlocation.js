
var models  = require('../models'),
    express = require('express'),
    boundingbox = require('../modules/boundingbox'),
    passport = require('passport');

var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.EventLocation.findAll()
        .then(function(eventLocation) {
          res.statusCode = 200;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  eventLocation,
              length: eventLocation.length
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
  //find EventLocation by ID
  .get('/:id', function(req, res) {
      models.EventLocation.findAll(
        {
          where: {
            EventLocationID: req.params.id
          }
        }
      ).then(function(eventLocation) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  eventLocation,
            length: eventLocation.length
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

  //find bounding box for Event by eventID
    .get('/boundingbox/list', function(req, res) {
            models.EventLocation.findAll(
                {
                    include: [
                        {
                            model: models.Event,
                            where: {Active: true}
                        }
                    ]
                }
            ).then(function(eventLocations) {
                var resultString = '';
                eventLocations.sort(function(a, b) {
                    return parseFloat(a.LONG) - parseFloat(b.LONG);
                });
                eventLocations.forEach(function(el){
                    resultString += boundingbox.getBoundingBox([parseFloat(el.LAT), parseFloat(el.LONG)], el.Radius) +'\n';
                    // boxes.push(boundingbox.getBoundingBox([parseFloat(el.LAT), parseFloat(el.LONG)], el.Radius))
                })
                // var boundBox = boundingbox.getBoundingBox([parseFloat(eventLocation[0].LAT), parseFloat(eventLocation[0].LONG)], eventLocation[0].Radius)

                    res.statusCode = 200;
                    res.send(resultString);
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


  //insert into EventLocation
  .post('/', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.EventLocation.create(req.body)
    .then(function(eventLocation) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  eventLocation,
            length: eventLocation.length
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
  //update into EventLocation
  .put('/:id', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
    models.EventLocation.update(
      req.body,
      {
        where: {
          EventLocationID: req.params.id
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
    models.EventLocation.destroy(
      {
        where: {
          EventLocationID: req.params.id
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
