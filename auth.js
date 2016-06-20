var environment = "";
var port = "";
var ssl_port = "";
var env       = process.env.NODE_ENV || 'aws-development';
var config    = require(__dirname + '/config/config.json')[env];
var jwtStrategy = require('passport-jwt').Strategy;
var jwtExtractor = require('passport-jwt').ExtractJwt;
var nJwt = require("njwt");
var passport = require('passport');
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

        // app.post('/auth/logout',
        //     function (req, res) {
        //         logout(req, res);
        //     }
        // );
        
        setupFacebookAuthentication(app);
        setupJWTAuthentication(app);
    }
};

// function logout(req, res) {
//     req.logout();
//    
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.write("User successfully logged out.");
//     res.end();
// }

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
              
              models.Account.findAll()

              var http = require('http');
              
              var apiAuth = 'Basic ' + new Buffer('a1ada5ab-b8c2-11e5-847d-00ffd0ea9272:H3lpN0w2016').toString('base64');

              var creds = '{"email":"' + profile.emails[0].value + '"}';
              var options = {
                  host: 'localhost',
                  path: '/api/account/external_login',
                  port: getHttpPort(false),
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': apiAuth }
              };

              callback = function (response) {
                  var str = '';

                  // Another chunk of data has been recieved, so append it to `str`
                  response.on('data', function (chunk) {
                      str += chunk;
                  });

                  // The whole response has been recieved, so know we can use it
                  response.on('end', function () {
                      if (str === "Unauthorized") {
                          console.log("unauthorized");
                          return done(null, false);
                      } else {
                          var jsonObj = JSON.parse(str);
                          var user = jsonObj.json[0];
                          console.log("authorized user: " + user.Email);
                          //return done(null, user.Email, { message: str });
                          return done(null, str);
                      }
                  });
              }

              var req = http.request(options, callback);
              req.write(creds);
              req.end();
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

// function setupBasicAuthForAPI(app) {
//     console.log("setupBasicAuthForAPI");
//     var models = require('./models');
//     var BasicStrategy = require('passport-http').BasicStrategy;
//
//     passport.use('api-basic', new BasicStrategy(
//       function (username, password, done) {
//
//           models.Organization.findAll(
//             {
//                 where: {
//                     APIKey: username
//                 }
//             }
//           ).then(function (organization) {
//               if (organization[0] != null) {
//                   organization[0].validateAPISecret(password, function(error,validated){
//                       if (validated)
//                       {
//                           return done(null, true);
//                       }
//                       else
//                       {
//                           return done(null, false);
//                       }
//                     }
//                   );
//
//               }
//               else {
//                   return done(null, false);
//               }
//           }
//          ).catch(function (err) {
//              console.error(err);
//              return done(err);
//          });
//
//       }
//         ));
//
//     // exports.isAPIAuthenticated = passport.authenticate('api-basic', {session:false});
//
//     // we capture all api requests and authenticate them.
//     // app.all('/api/*',
//     //     passport.authenticate('api-basic', { session: false })
//     // );
// }

function setupJWTAuthentication(app) {
    var opts = {};
    opts.jwtFromRequest = jwtExtractor.fromAuthHeader();
    opts.secretOrKey = config.jwt_secret;
    opts.issuer = config.jwt_issuer;

    var models = require('./models');

    passport.use('jwt-auth-api', new jwtStrategy(opts, function(jwt_payload, done) {
        console.log("here is the id: "+jwt_payload.id);
        console.log("here is the sub: "+jwt_payload.sub);

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

    // module.exports.isAPIAuthenticated = passport.authenticate('jwt-auth-api', {session:false});

    // app.all('/api/*',
    //     passport.authenticate('jwt-auth-api', { session: false })
    // );
}

var cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies["cookie.helpnowmap.org"];
    }
    return token;
};