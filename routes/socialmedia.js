/**
 * Created by major on 4/25/16.
 */

var models  = require('../models'),
    express = require('express'),
    passport = require('passport');

var routes = function(){
    var router  = express.Router();
    router.get('/', function(req, res) {
            models.SocialMedia.findAll()
                .then(function(socialMedia) {
                        res.statusCode = 200;
                        res.send(
                            {
                                result: 'success',
                                err:    '',
                                json:  socialMedia,
                                length: socialMedia.length
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
        //find SocialMedia by ID
        .get('/:id', function(req, res) {
                models.SocialMedia.findAll(
                    {
                        where: {
                            SocialMediaID: req.params.id
                        }
                    }
                ).then(function(socialMedia) {
                        res.statusCode = 200;
                        res.send(
                            {
                                result: 'success',
                                err:    '',
                                json:  socialMedia,
                                length: socialMedia.length
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
        //insert into SocialMedia
        .post('/', function(req, res) {
                models.SocialMedia.create(req.body)
                    .then(function(socialMedia) {
                            res.statusCode = 200;
                            res.send(
                                {
                                    result: 'success',
                                    err:    '',
                                    json:  socialMedia,
                                    length: socialMedia.length
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
        //update into SocialMedia
        .put('/:id', function(req, res) {
                models.SocialMedia.update(
                    req.body,
                    {
                        where: {
                            SocialMediaID: req.params.id
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
                models.SocialMedia.destroy(
                    {
                        where: {
                            SocialMediaID: req.params.id
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