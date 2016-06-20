/**
 * Created by mmajor on 5/31/16.
 */


var models  = require('../models'),
    express = require('express'),
    passport = require('passport');

//ResourceSubtype one-to-many on ResourceTypeUnitOfMeasure
models.ResourceSubtype.hasMany(models.ResourceLocationInventory, {foreignKey: 'ResourceSubtypeID'});
models.ResourceLocationInventory.belongsTo(models.ResourceSubtype, {foreignKey: 'ResourceSubtypeID'});

//ResourceSubtype many-to-one on ResourceType
models.ResourceType.hasMany(models.ResourceSubtype, {foreignKey: 'ResourceTypeID'});
models.ResourceSubtype.belongsTo(models.ResourceType, {foreignKey: 'ResourceTypeID'});

var routes = function(){
    var router  = express.Router();
    router.get('/', function(req, res) {
            models.ResourceSubtype.findAll(
                {
                    include: [
                        {model: models.ResourceType}
                    ]
                }
            )
                .then(function(resourceSubtype) {
                        res.statusCode = 200;
                        res.send(
                            {
                                result: 'success',
                                err:    '',
                                json:  resourceSubtype,
                                length: resourceSubtype.length
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
    //find ResourceSubtype by ID
        .get('/:id', function(req, res) {
                models.ResourceSubtype.findAll(
                    {
                        where: {
                            ResourceSubtypeID: req.params.id
                        },
                        include: [
                            {model: models.ResourceType}
                        ]
                    }
                ).then(function(resourceSubtype) {
                        res.statusCode = 200;
                        res.send(
                            {
                                result: 'success',
                                err:    '',
                                json:  resourceSubtype,
                                length: resourceSubtype.length
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
        //insert into ResourceSubtype
        .post('/', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
                models.ResourceSubtype.create(req.body)
                    .then(function(resourceSubtype) {
                            res.statusCode = 200;
                            res.send(
                                {
                                    result: 'success',
                                    err:    '',
                                    json:  resourceSubtype,
                                    length: resourceSubtype.length
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
        //update into ResourceSubtype
        .put('/:id', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
                models.ResourceSubtype.update(
                    req.body,
                    {
                        where: {
                            ResourceSubtypeID: req.params.id
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
                models.ResourceSubtype.destroy(
                    {
                        where: {
                            ResourceSubtypeID: req.params.id
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