/**
 * Created by mmajor on 6/16/16.
 */

var models  = require('../models'),
    express = require('express'),
    passport = require('passport')
    // uuid = require('uuid'),
    nJwt = require('njwt');

var env       = process.env.NODE_ENV || 'aws-development';
var config    = require(__dirname + '/../config/config.json')[env];

var routes = function(){
    var router  = express.Router();
    var signingKey = config.jwt_secret;

    //this is for user login, returns JWT
    router.post('/login/', function (req, res) {
            models.Account.findAll(
                {
                    include: [
                        {
                            model: models.Organization
                        }
                    ],
                    where: {
                        Username: req.body.username
                    }
                }
            ).then(function(accounts) {
                    if (accounts.length>0){
                        accounts[0].validatePassword(req.body.password, function(err, isMatch)
                        {
                            if (isMatch){

                                var claims = {
                                    iss: config.jwt_issuer,
                                    sub: accounts[0].Username,
                                    scope: "user"
                                }
                                var jwt = nJwt.create(claims, signingKey);

                                var token = jwt.compact();

                                res.cookie("cookie.helpnowmap.org", token);
                                res.statusCode = 200;
                                res.send(
                                    {
                                        result: 'success',
                                        err: '',
                                        json: accounts,
                                        length: accounts.length
                                    }
                                );
                            }
                            else {
                                res.sendStatus(401);
                            }

                        });
                    }
                    else
                    {
                        res.sendStatus(401)
                    }

                }
            ).catch(function (err) {
                console.error(err);
                res.statusCode = 400;
                res.send({
                    result: 'error',
                    err: err.message
                });
            });
        }
    )
    //this is for client (organization) login, , returns JWT
    .post('/client/', function (req, res) {
        console.log("we are in the client login!: key: "+req.body.apikey+" secret: "+req.body.apisecret);
        models.Organization.find(
            {
                where: {
                    APIKey: req.body.apikey
                }
            }
        ).then(function(org) {
                if (org){
                    org.validateAPISecret(req.body.apisecret, function(err, isMatch)
                    {
                        if (isMatch){

                            var claims = {
                                iss: config.jwt_issuer,
                                sub: org.APIKey,
                                scope: "organization"
                            }
                            var jwt = nJwt.create(claims, signingKey);

                            var token = jwt.compact();

                            res.statusCode = 200;
                            res.send(
                                {
                                    result: 'success',
                                    err: '',
                                    token: token
                                }
                            );
                        }
                        else {
                            res.sendStatus(401);
                        }
                    });
                }
                else
                {
                    res.sendStatus(401)
                }
            }
        ).catch(function (err) {
            console.error(err);
            res.statusCode = 400;
            res.send({
                result: 'error',
                err: err.message
            });
        });
    })
    //this is a password update to validate the old password first
    router.post('/validate/', passport.authenticate('jwt-auth-api', {session:false}), function (req, res) {
            models.Account.findAll(
                {
                    where: {
                        Username: req.body.username
                    }
                }
            ).then(function(accounts) {
                    if (accounts.length>0){
                        accounts[0].validatePassword(req.body.password, function(err, isMatch)
                        {
                            if (isMatch){
                                res.statusCode = 200;
                                res.send(
                                    {
                                        result: 'success',
                                        err: '',
                                        json: true
                                    }
                                );
                            }
                            else {
                                res.statusCode = 200;
                                res.send(
                                    {
                                        result: 'success',
                                        err: '',
                                        json: false
                                    }
                                );
                            }

                        });
                    }
                    else
                    {
                        res.statusCode = 200;
                        res.send(
                            {
                                result: 'success',
                                err: '',
                                json: false
                            }
                        );
                    }

                }
            ).catch(function (err) {
                console.error(err);
                res.statusCode = 400;
                res.send({
                    result: 'error',
                    err: err.message
                });
            });
        }
    )
    //this is for client (organization) login, , returns JWT
    .post('/logout/', function (req, res) {
        req.logout();
        res.clearCookie("cookie.helpnowmap.org");
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write("User successfully logged out.");
        res.end();

    });


    return router;
}

module.exports = routes;