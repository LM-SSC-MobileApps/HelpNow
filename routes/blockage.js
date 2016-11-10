/**
 * Created by major on 4/19/16.
 */


var models  = require('../models'),
    express = require('express'),
    passport = require('passport');

//Blockage many-to-one on BlockageSource
models.Blockage.belongsTo(models.BlockageSource, { foreignKey: 'BlockageSourceID' });
models.BlockageSource.hasMany(models.Blockage, { foreignKey: 'BlockageSourceID' });

var routes = function(){
    var router  = express.Router();
    router.get('/', function(req, res) {
            models.Blockage.findAll(
                {
                    include: [
                        {model: models.BlockageSource}
                    ]
                }
            )
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
                        },
                        include: [
                            {model: models.BlockageSource}
                        ]
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
        //blocked routes
        .get('/routes/nodes', function(req, res) {
                models.Blockage.findAll(
                    {
                        include: [
                            {
                                model: models.Event,
                                where: {Active: true}
                            }
                        ]
                    }
                ).then(function(blockage) {
                    //build up the result string
                        blockage.sort(function(a, b) {
                            return a.EventID - b.EventID;
                        });
                        var resultString = "blocked_nodes = {";
                        blockage.forEach(function(block) {
                            resultString += '{["lat"] = '+block.LAT+',';
                            resultString += '["lon"] = '+block.LONG+'},';

                        });
                    //remove the last comma from the forEach
                        resultString = resultString.slice(0, -1);
                        resultString += '}';

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
        //insert into Blockage
        .post('/', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
				models.BlockageSource.findAll( {
					where: {
						Description: 'HelpNow'
					}
				}).then(function(sources) {
					var helpNowSource = sources[0];
					if (!req.body.BlockageSourceID)
						req.body.BlockageSourceID = helpNowSource.BlockageSourceID;
					return models.Blockage.create(req.body);
				}).then(function(blockage) {
					res.statusCode = 201;
					res.send(
						{
							result: 'success',
							err:    '',
							json:  blockage,
							length: blockage.length
						}
					);
				}).catch(function (err) {
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
        .put('/:id', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
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
        .delete('/tomnod/:eventid', passport.authenticate('jwt-auth-api', {session:false}), function (req, res) {
            models.Blockage.destroy(
                {
                    where: {
                        BlockageSourceID: 2,
                        EventID: req.params.eventid
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
        )
        .delete('/:id', passport.authenticate('jwt-auth-api', {session:false}), function(req, res) {
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
