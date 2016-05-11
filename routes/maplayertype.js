/**
 * Created by major on 5/11/16.
 */

var models  = require('../models'),
    express = require('express');

var routes = function(){
    var router  = express.Router();
    router.get('/', function(req, res) {
            models.MapLayerType.findAll()
                .then(function(mapLayerType) {
                        res.statusCode = 200;
                        res.send(
                            {
                                result: 'success',
                                err:    '',
                                json:  mapLayerType,
                                length: mapLayerType.length
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
        //find MapLayerType by ID
        .get('/:id', function(req, res) {
                models.MapLayerType.findAll(
                    {
                        where: {
                            MapLayerTypeID: req.params.id
                        }
                    }
                ).then(function(mapLayerType) {
                        res.statusCode = 200;
                        res.send(
                            {
                                result: 'success',
                                err:    '',
                                json:  mapLayerType,
                                length: mapLayerType.length
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
        //insert into MapLayerType
        .post('/', function(req, res) {
                models.MapLayerType.create(req.body)
                    .then(function(mapLayerType) {
                            res.statusCode = 200;
                            res.send(
                                {
                                    result: 'success',
                                    err:    '',
                                    json:  mapLayerType,
                                    length: mapLayerType.length
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
        //update into MapLayerType
        .put('/:id', function(req, res) {
                models.MapLayerType.update(
                    req.body,
                    {
                        where: {
                            MapLayerTypeID: req.params.id
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
                models.MapLayerType.destroy(
                    {
                        where: {
                            MapLayerTypeID: req.params.id
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