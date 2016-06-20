var environment = "";
var port = "";
var ssl_port = "";
var env       = process.env.NODE_ENV || 'aws-development';
var config    = require(__dirname + '/config/config.json')[env];
var jwtStrategy = require('passport-jwt').Strategy;
var jwtExtractor = require('passport-jwt').ExtractJwt;
var nJwt = require('njwt');
var passport = require('passport');
// var authheader = require('auth-header');
// var localStrategy = require('passport-local').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;

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

        setupFacebookAuthentication(app);
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

function getClientID() {
    if (getEnvironment() === 'production') {
        return '508069382708084';
    } else if (getEnvironment() === 'qas') {
        return '545286995652989';
    } else {
        return '545287402319615';
    }
}

function getClientSecret() {
    if (getEnvironment() === 'production') {
        return 'df3684bd3cceadb1b7eb344846bfbcc8';
    } else if (getEnvironment() === 'qas') {
        return 'd8c52ed189c00d6f45de9f80bc1f776d';
    } else {
        return '543c8b04c2d94a489eba3243cd9cef5a';
    }
}


function setupFacebookAuthentication(app) {
    console.log("setupFacebookAuthentication");

    var callbackURL = getHttp() + getHost() + getHttpPort(true) + "/auth/facebook/callback";
    console.log("callbackURL = " + callbackURL + " clientID = " + getClientID() + " clientSecret = " + getClientSecret());

    var models = require('./models');

    // Use the FacebookStrategy within Passport.
    // Strategies in Passport require a `verify` function, which accept
    // credentials (in this case, an accessToken, refreshToken, and Facebook
    // profile), and invoke a callback with a user object.
    passport.use('facebook', new facebookStrategy({
        clientID: getClientID(),
        clientSecret: getClientSecret(),
        callbackURL: callbackURL,
        profileFields: ['id', 'emails', 'name']
    },
      function (accessToken, refreshToken, profile, done) {
          // asynchronous verification, for effect...
          process.nextTick(function () {
              // To keep the example simple, the user's Facebook profile is returned to
              // represent the logged-in user.  In a typical application, you would want
              // to associate the Facebook account with a user record in your database,
              // and return that user instead.

              //console.log(JSON.stringify(profile));
              //var profileStr = profile.name.givenName + '|' + profile.name.familyName + '|' + profile.emails[0].value
              //console.log(profileStr);

              models.Account.findAll(
                  {
                      include: [
                          {
                              model: models.Organization
                          }
                      ],
                      where: {
                          Username: profile.emails[0].value
                      }
                  }
              ).then(function(account){
                  if (accounts.length>0){
                      var claims = {
                          iss: "https://helpnowmap.org",
                          sub: accounts[0].Username,
                          scope: "user"
                      }
                      var jwt = nJwt.create(claims, signingKey);

                      var token = jwt.compact();

                      res.cookie("cookie.helpnowmap.org", token);
                      req.session.accountid =  accounts[0].AccountID;
                      req.session.organizationid =  accounts[0].OrganizationID;
                      res.statusCode = 200;
                      done(null, true);

                  }
                  else {
                    done(null, false);
                  }
              }).catch(function (err) {
                  console.error(err);
                  return done(err, null);
              });

          });
      }
    ));

    // GET /auth/facebook
    // Use passport.authenticate() as route middleware to authenticate the
    // request.  The first step in Facebook authentication will involve
    // redirecting the user to facebook.com.  After authorization, Facebook will
    // redirect the user back to this application at /auth/facebook/callback
    app.get('/auth/facebook',
        passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

    // GET /auth/facebook/callback
    // Use passport.authenticate() as route middleware to authenticate the
    // request.  If authentication fails, the user will be redirected back to the
    // login page.  Otherwise, the primary route function function will be called,
    // which, in this example, will redirect the user to the home page.
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '../../#/login?error=invalid_account' }),
        function (req, res) {
            //console.log('req = ' + JSON.stringify(req.user));

            // Successful authentication, redirect home.            
            res.redirect('/');
        }
    );   

    app.post('/auth/account', function (req, res) {
        //console.log("req.isAuthenticated() = " + req.isAuthenticated() + " user = " + req.user);
        if (req.isAuthenticated()) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(req.user);
            res.end();
        } else {
            res.redirect('/login');
        }
    });
}


function setupJWTAuthentication(app) {
    var opts = {};
    opts.jwtFromRequest = jwtExtractor.fromAuthHeader();
    opts.secretOrKey = config.jwt_secret;
    opts.issuer = config.jwt_issuer;
    opts.passReqToCallback = true;

    var models = require('./models');

    passport.use('jwt-auth-api', new jwtStrategy(opts, function(req, jwt_payload, done) {

        // Get authorization header.
        var auth = authheader.parse(req.get('authorization'));

        // models.AuthToken.Find(
        //     {
        //         where: {
        //             Value: auth.token
        //         }
        //     }
        // ).then(function(authcode) {
        //     if (authcode)
        //     {
        //         return done(null, true);
        //     }
        //     else {
        //         return done(null, false);
        //     }
        //
        // }).catch(function (err) {
        //     console.error(err);
        //     return done(err, null);
        // });

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