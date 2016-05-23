/**
 * Created by major on 5/11/16.
 */

var models  = require('../models'),
    express = require('express');

//MapLayer many-to-one on MapLayerType
models.MapLayer.belongsTo(models.MapLayerType, { foreignKey: 'MapLayerTypeID' });
models.MapLayerType.hasMany(models.MapLayer, { foreignKey: 'MapLayerTypeID' });

//MapLayer many-to-one on Organization
models.MapLayer.belongsTo(models.Organization, { foreignKey: 'OrganizationID' });
models.Organization.hasMany(models.MapLayer, { foreignKey: 'OrganizationID' });

var routes = function(){
    var router  = express.Router();
    router.get('/', function(req, res) {
            models.MapLayer.findAll(
                {
                    include: [
                        {model: models.MapLayerType},
                        {model: models.Organization}
                    ]
                }
                )
                .then(function(maplayer) {
                        res.statusCode = 200;
                        res.send(
                            {
                                result: 'success',
                                err:    '',
                                json:  maplayer,
                                length: maplayer.length
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
        //find MapLayer by ID
        .get('/:id', function(req, res) {
                models.MapLayer.findAll(
                    {
                        where: {
                            MapLayerID: req.params.id
                        },
                        include: [
                            {model: models.MapLayerType},
                            {model: models.Organization}
                        ]
                    }
                ).then(function(maplayer) {
                        res.statusCode = 200;
                        res.send(
                            {
                                result: 'success',
                                err:    '',
                                json:  maplayer,
                                length: maplayer.length
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
        
        //insert into MapLayer
        .post('/', function(req, res) {
                models.MapLayer.create(req.body)
                    .then(function(maplayer) {
                            res.statusCode = 201;
                            res.send(
                                {
                                    result: 'success',
                                    err:    '',
                                    json:  maplayer,
                                    length: maplayer.length
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
        //update into MapLayer
        .put('/:id', function(req, res) {
                models.MapLayer.update(
                    req.body,
                    {
                        where: {
                            MapLayerID: req.params.id
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
        .delete('/:id', function (req, res) {
                models.MapLayer.destroy(
                    {
                        where: {
                            MapLayerID: req.params.id
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