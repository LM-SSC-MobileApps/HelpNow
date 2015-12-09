
var models  = require('../models'),
    express = require('express');


var routes = function(){
  var router  = express.Router();
    router.get('/', function(req, res) {
      models.InviteRequest.findAll()
        .then(function(inviteRequest) {
          res.statusCode = 201;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  inviteRequest,
              length: inviteRequest.length
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
  //find InviteRequest by InviteID
  .get('/:inviteid', function(req, res) {
      models.InviteRequest.findAll(
        {
          where: {
            InviteID: req.params.inviteid
          }
        }
      ).then(function(inviteRequest) {
        res.statusCode = 200;
        res.send(
          {
            result: 'success',
            err:    '',
            json:  inviteRequest,
            length: inviteRequest.length
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
  //insert into InviteRequest
  .post('/', function(req, res) {
    models.InviteRequest.create(req.body)
    .then(function(result) {
        models.InviteRequest.findAll(
          {
            where: {
              InviteRequestID: result.InviteRequestID
            }
          }
        ).then(function(inviteRequest){
          res.statusCode = 200;
          res.send(
            {
              result: 'success',
              err:    '',
              json:  inviteRequest,
              length: inviteRequest.length
            }
          );
        })
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
  //must send inviteid GUID to delete.
  .delete('/:inviteid', function(req, res) {
    models.InviteRequest.destroy(
      {
        where: {
          InviteID: req.params.inviteid
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