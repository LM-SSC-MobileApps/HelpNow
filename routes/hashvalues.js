/**
 * Created by mmajor on 6/15/16.
 */


var models  = require('../models'),
    express = require('express');


var routes = function(){
    var router  = express.Router();
    router.get('/', function(req, res) {

        models.Account.findAll({
            where: {
                IsHashed: false,
                Password: {
                    $ne: null
                }
            }
        }).then(function (accounts){
            var promises = [];
            accounts.forEach( function(account){
                promises.push(
                    models.Account.update(account, {
                        individualHooks: true,
                        where: {
                            AccountID: account.AccountID,
                        }
                    })
                );
            });
            Promise.all(promises);
        }).then(function () {
            models.Organization.findAll({
                    where: {
                        IsHashed: false,
                        APISecret: {
                            $ne: null
                        }

                    }
            }).then(function (orgs){
                var orgPromises = [];
                orgs.forEach( function(org){
                    orgPromises.push(
                        models.Organization.update(org, {
                            individualHooks: true,
                            where: {
                                OrganizationID: org.OrganizationID
                            }
                        })
                    );
                });
                Promise.all(orgPromises);
            }).then(function (result) {
                res.statusCode = 200;
                res.send(
                    {
                        result: 'success',
                        err: ''
                    }
                );
            })
        })
        .catch(function (err) {
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
