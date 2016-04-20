/**
 * Created by major on 4/19/16.
 */


var models  = require('../models'),
    express = require('express');

var routes = function(){
    var router  = express.Router();
    router.get('/', function(req, res) {
            models.Blockage.findAll()
                .then(function(blockage) {
                        res.statusCode = 201;
                        res.send(
                            {
                                result: 'success',
                                err:    '',
                                json:  blockage,
                                length: blockage.length
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
        //find Blockge by ID
        .get('/:id', function(req, res) {
                models.Blockage.findAll(
                    {
                        where: {
                            BlockageID: req.params.id
                        }
                    }
                ).then(function(blockage) {
                        res.statusCode = 200;
                        res.send(
                            {
                                result: 'success',
                                err:    '',
                                json:  blockage,
                                length: blockage.length
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
        //insert into Blockage
        .post('/', function(req, res) {
                models.Blockage.create(req.body)
                    .then(function(blockage) {
                            res.statusCode = 200;
                            res.send(
                                {
                                    result: 'success',
                                    err:    '',
                                    json:  blockage,
                                    length: blockage.length
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
        //update into Blockage
        .put('/:id', function(req, res) {
                models.Blockage.update(
                    req.body,
                    {
                        where: {
                            BlockageID: req.params.id
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
                models.Blockage.destroy(
                    {
                        where: {
                            BlockageID: req.params.id
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