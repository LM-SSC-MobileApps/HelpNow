var models = require('../models'),
    express = require('express'),
    passport = require('passport');

//Account many-to-one on Organization
models.Account.belongsTo(models.Organization, {foreignKey: 'OrganizationID'});
models.Organization.hasMany(models.Account, {foreignKey: 'OrganizationID'});


/**
 * @api {get} api/account/ Get all Accounts
 * @apiName GetAccounts
 * @apiGroup Account

 * @apiUse helpNowHeader
 * @apiUse helpNowSuccessResult
 * @apiUse helpNowUnauthorizedResult
 * @apiSuccess {Object} json    The Result data in the form of json.
 * @apiSuccess {Number}   json.AccountID Unique ID for the Account.
 * @apiSuccess {String}   json.Username A users unique Username.
 * @apiSuccess {String}   json.FirstName A users first name.
 * @apiSuccess {String}   json.LastName A users last name.
 * @apiSuccess {String}   json.MiddleInitial A users middile initial.
 * @apiSuccess {Number}   json.OrganizationID OrganziationID associated with the Organization for the Event.
 * @apiSuccess {String}   json.Summary Event Title.
 * @apiSuccess {String}   json.Notes Event description or additional information.
 * @apiSuccess {Boolean}   json.Active Status of the event.
 * @apiSuccess {Date}   json.CreateDate Date & Time the Event was created in the system.
 * @apiSuccess {Object[]}   json.EventLocations An Array of EventLocations for the event.
 * @apiSuccess {Object[]}   json.Blockages An Array of Blockages for the event.
 * @apiSuccess {Object}   json.EventType the EventType object associated with the event.
 * @apiSuccess {Object}   json.Organization the Organization object associated with the event.
 * @apiSuccess {Object[]}   json.ResourceRequests An Array of ResourceRequests for the event.
 * @apiSuccess {Object[]}   json.ResourceLocations An Array of ResourceLocations for the event.
 */
var routes = function () {
    var router = express.Router();
    router.get('/', passport.authenticate('jwt-auth-api', {session: false}), function (req, res) {
        models.Account.findAll()
            .then(function (account) {
                res.statusCode = 200;
                res.send({
                    result: 'success',
                    err: '',
                    json: account,
                    length: account.length
                });
            })
            .catch(function (err) {
                console.error(err);
                res.statusCode = 400;
                res.send({
                    result: 'error',
                    err: err.message
                });
            });
    })
    //find Account by AccountID
        .get('/:id', passport.authenticate('jwt-auth-api', {session: false}), function (req, res) {
            models.Account.findAll(
                {
                    include: [
                        {
                            model: models.Organization
                        }
                    ],
                    where: {
                        AccountID: req.params.id,
                        Active: true
                    }
                }).then(function (account) {
                res.statusCode = 200;
                res.send({
                    result: 'success',
                    err: '',
                    json: account,
                    length: account.length
                });
            }).catch(function (err) {
                console.error(err);
                res.statusCode = 400;
                res.send({
                    result: 'error',
                    err: err.message
                });
            });
        })
        //find Account by Email
        .get('/email/:email', passport.authenticate('jwt-auth-api', {session: false}), function (req, res) {
            models.Account.findAll({
                include: [
                    {
                        model: models.Organization
                    }
                ],
                where: {
                    Email: req.params.email,
                    Active: true
                }
            }).then(function (account) {
                res.statusCode = 200;
                res.send({
                    result: 'success',
                    err: '',
                    json: account,
                    length: account.length
                });
            }).catch(function (err) {
                console.error(err);
                res.statusCode = 400;
                res.send({
                    result: 'error',
                    err: err.message
                });
            });
        })


        //find Accounts by organizationid
        .get('/organization/:id', passport.authenticate('jwt-auth-api', {session: false}), function (req, res) {
            models.Account.findAll({
                where: {
                    OrganizationID: req.params.id,
                    Active: true
                }
            }).then(function (account) {
                if (account.length > 0) {
                    res.statusCode = 200;
                    res.send({
                        result: 'success',
                        err: '',
                        json: account,
                        length: account.length
                    });
                }
                else {
                    res.sendStatus(401);
                }
            }).catch(function (err) {
                console.error(err);
                res.statusCode = 400;
                res.send({
                    result: 'error',
                    err: err.message
                });
            });
        })
        //find organzation team members by accountid (will not include account passed by parameter)
        .get('/organizationmembers/:id', passport.authenticate('jwt-auth-api', {session: false}), function (req, res) {
            models.Account.findAll({
                include: [
                    {
                        model: models.Organization
                    }
                ],
                where: {
                    AccountID: req.params.id,
                    Active: true
                }
            }).then(function (account) {
                if (account.length > 0) {
                    models.Account.findAll({
                            where: {
                                OrganizationID: account[0].OrganizationID,
                                Active: true
                            }
                        }
                    ).then(function (team) {
                        res.statusCode = 200;
                        res.send({
                            result: 'success',
                            err: '',
                            json: team,
                            length: team.length
                        });
                    });
                }
                else {
                    res.statusCode = 200;
                    res.send({
                        result: 'success',
                        err: '',
                        json: account,
                        length: account.length
                    });
                }
            }).catch(function (err) {
                console.error(err);
                res.statusCode = 400;
                res.send({
                    result: 'error',
                    err: err.message
                });
            });
        })

        //find login which retrieves account
        .post('/external_login/', function (req, res) {
            models.Account.findAll({
                include: [
                    {
                        model: models.Organization
                    }
                ],
                where: {
                    Email: req.body.email
                }
            }).then(function (account) {
                if (account.length > 0) {

                    req.session.accountid = account[0].AccountID;
                    req.session.organizationid = account[0].OrganizationID;
                    res.statusCode = 200;
                    res.send({
                        result: 'success',
                        err: '',
                        json: account,
                        length: account.length
                    });
                }
                else {
                    res.sendStatus(401)
                }

            }).catch(function (err) {
                console.error(err);
                res.statusCode = 400;
                res.send({
                    result: 'error',
                    err: err.message
                });
            });
        })
        //insert into Account
        .post('/', function (req, res) {
            //we first check the uuid on the request to make sure there is a valid inviterequest in the db.
            models.InviteRequest.find({
                where: {
                    InviteID: req.body.InviteID
                }
            }).then(function (invite) {
                if (invite) {
                    //need to check to make sure the username is unique
                    models.Account.find({
                        where: {
                            Username: req.body.Username
                        }
                    }).then(function (account) {
                        if (account) {
                            res.statusCode = 200;
                            res.send({
                                result: 'The username is already in use, please select a different username.',
                                err: '',
                                json: false,
                                length: 0
                            });
                        }
                        else {
                            //we are good to create the Account
                            models.Account.create(req.body)
                                .then(function (account) {
                                    //account created, delete the invite request.
                                    models.InviteRequest.destroy({
                                        where: {
                                            InviteID: req.body.InviteID
                                        }
                                    });
                                    res.statusCode = 200;
                                    res.send({
                                        result: 'New account created.',
                                        err: '',
                                        json: true,
                                        length: 0
                                    });
                                }).catch(function (err) {
                                console.error(err);
                                res.statusCode = 400;
                                res.send({
                                    result: 'error',
                                    err: err.message
                                });
                            });
                        }
                    }).catch(function (err) {
                        console.error(err);
                        res.statusCode = 400;
                        res.send({
                            result: 'error',
                            err: err.message
                        });
                    });
                }
                else {
                    res.statusCode = 200;
                    res.send({
                        result: 'Invite to create an account is no longer valid.  Please re-request an invite or contact a system administrator.',
                        err: '',
                        json: false,
                        length: 0
                    });
                }
            }).catch(function (err) {
                console.error(err);
                res.statusCode = 400;
                res.send({
                    result: 'error',
                    err: err.message
                });
            });
        })
        //update into Account
        .put('/:id', passport.authenticate('jwt-auth-api', {session: false}), function (req, res) {
            models.Account.update(
                req.body, {
                    individualHooks: true,
                    where: {
                        AccountID: req.params.id
                    }
                })
                .then(function (rowsUpdated) {
                    res.statusCode = 200;
                    res.send({
                        result: 'success',
                        err: '',
                        json: {rows: rowsUpdated},
                        length: rowsUpdated.length
                    });
                }).catch(function (err) {
                console.error(err);
                res.statusCode = 400;
                res.send({
                    result: 'error',
                    error: err.message
                });
            });
        })
        .delete('/:id', passport.authenticate('jwt-auth-api', {session: false}), function (req, res) {
            models.Account.destroy({
                where: {
                    AccountID: req.params.id
                }
            })
                .then(function (numDelete) {
                    res.statusCode = 200;
                    res.send({
                        result: 'success',
                        err: '',
                        json: {rows: numDelete}
                    });
                }).catch(function (err) {
                console.error(err);
                res.statusCode = 400;
                res.send({
                    result: 'error',
                    err: err.message
                });
            });
        });

    return router;
}

module.exports = routes;