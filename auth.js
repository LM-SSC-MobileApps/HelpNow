var environment = "";
var port = "";
var ssl_port = "";
var env       = process.env.NODE_ENV || 'aws-development';
var config    = require(__dirname + '/config/config.json')[env];
var jwtStrategy = require('passport-jwt').Strategy;
var jwtExtractor = require('passport-jwt').ExtractJwt;
var nJwt = require('njwt');
var passport = require('passport');

module.exports =
{
    setupAuthentication: function (environment_val, port_val, ssl_port_val, app) {
        console.log("setupAuthentication");

        environment = environment_val;
        port = port_val;
        ssl_port = ssl_port_val;


        app.use(passport.initialize());
        app.use(passport.session());

        passport.serializeUser(function (user, done) {
            done(null, user);
        });

        passport.deserializeUser(function (user, done) {
            done(null, user);
        });

        // setupFacebookAuthentication(app);
        setupJWTAuthentication(app);
    }
};


function getEnvironment() {
    return environment;
}

function getHttp() {
    if (getEnvironment() === 'production') {
        return 'http://';
    } else if (getEnvironment() === 'qas') {
        return 'http://';
    } else {
        return 'http://';
    }
}

function getHost() {
    if (getEnvironment() === 'production') {
        return "www.helpnowmap.com";
    } else if (getEnvironment() === 'qas') {
        var os = require("os");
        var hostname = os.hostname();
        if (hostname) {
            return hostname;
        } else {
            return "localhost";
        }
    } else {
        return "localhost";
    }
}

function getHttpPort(addColon) {
    if (getEnvironment() === 'production') {
        return '';
    } else if (getEnvironment() === 'qas') {
        return ''; 
    } else {
        if (addColon == true) {
            return ':' + process.env.PORT
        } else {
            return process.env.PORT;
        }
    }
}

function getHttpsPort(addColon) {
    if (getEnvironment() === 'production') {
        return '';
    } else if (getEnvironment() === 'qas') {
        return '';
    } else {
        if (addColon == true) {
            return ':' + process.env.SSL_PORT
        } else {
            return process.env.SSL_PORT;
        }
    }
}

// function getClientID() {
//     if (getEnvironment() === 'production') {
//         return '508069382708084';
//     } else if (getEnvironment() === 'qas') {
//         return '545286995652989';
//     } else {
//         return '545287402319615';
//     }
// }
//
// function getClientSecret() {
//     if (getEnvironment() === 'production') {
//         return 'df3684bd3cceadb1b7eb344846bfbcc8';
//     } else if (getEnvironment() === 'qas') {
//         return 'd8c52ed189c00d6f45de9f80bc1f776d';
//     } else {
//         return '543c8b04c2d94a489eba3243cd9cef5a';
//     }
// }



function setupJWTAuthentication(app) {
    var opts = {};
    opts.jwtFromRequest = jwtExtractor.fromAuthHeader();
    opts.secretOrKey = config.jwt_secret;
    opts.issuer = config.jwt_issuer;
    opts.passReqToCallback = true;

    var models = require('./models');

    passport.use('jwt-auth-api', new jwtStrategy(opts, function(req, jwt_payload, done) {

        models.Account.findAll(
            {
                where: {
                    Username: jwt_payload.sub
                }
            }
        ).then(function(account){
            if (account){
                return done(null, true);
            }
            else{
                //sub may be APIKey
                models.Organization.findAll(
                    {
                        where: {
                            APIKey: jwt_payload.sub
                        }
                    }
                ).then(function(org){
                    if (org){
                        return done(null, true);
                    }
                    else
                    {
                        return done(null, false);
                    }
                }).catch(function (err) {
                    console.error(err);
                    return done(err, null);
                });
            }
        }).catch(function (err) {
            console.error(err);
            return done(err, null);
        });
    }));

}

var cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies["cookie.helpnowmap.org"];
    }
    return token;
};