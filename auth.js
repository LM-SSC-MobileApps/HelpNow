var environment = "";
var port = "";
var ssl_port = "";

module.exports =
{
    setupAuthentication: function (environment_val, port_val, ssl_port_val, app) {
        console.log("setupAuthentication");

        environment = environment_val;
        port = port_val;
        ssl_port = ssl_port_val;

        var passport = require('passport');
        var LocalStrategy = require('passport-local').Strategy;
        var FacebookStrategy = require('passport-facebook').Strategy;

        app.use(passport.initialize());
        app.use(passport.session());

        passport.serializeUser(function (user, done) {
            done(null, user);
        });

        passport.deserializeUser(function (user, done) {
            done(null, user);
        });

        app.post('/auth/logout',
            function (req, res) {
                logout(req, res);
            }
        );

        setupLocalAuthentication(app, passport, LocalStrategy);
        setupFacebookAuthentication(app, passport, FacebookStrategy);
        setupBasicAuthForAPI(app, passport);

        //setupDigestAuthForAPI(app, passport);
    }
};

function logout(req, res) {
    req.logout();

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("User successfully logged out.");
    res.end();
}

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

function setupLocalAuthentication(app, passport, strategy) {
    console.log("setupLocalAuthentication");
    passport.use('local', new strategy({
        usernameField: 'username',
        passwordField: 'password'
    },
        function (username, password, done) {
            var http = require('http');

            var creds = '{"username":"' + username + '","password":"' + password + '"}';
            
            var apiAuth = 'Basic ' + new Buffer('a1ada5ab-b8c2-11e5-847d-00ffd0ea9272:H3lpN0w2016').toString('base64');
            
            var options = {
                host: 'localhost',
                path: '/api/account/login',
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
                        return done(null, user.Email, { message: str });
                    }                        
                });
            }
            console.log('here are the options: ' + JSON.stringify(options));

            var req = http.request(options, callback);
            req.write(creds);
            req.end();
        }
    ));


    app.post('/auth/login', function (req, res, next) {            
        passport.authenticate('local', function (err, user, info) {
            //console.log("err = " + err + " user = " + user + " next = " + next + " info = " + info);
            if (err) { return next(err) }
            if (!user) {
                res.writeHead(502, { 'Content-Type': 'application/json' });
                res.write("Incorrect username or password. Please try again.");
                res.end();
                return;
            }
            req.logIn(user, function (err) {
                if (err) { return next(err); }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(info.message);
                res.end();
                return;
            });
        })(req, res, next);
    });
}

function setupFacebookAuthentication(app, passport, strategy) {
    console.log("setupFacebookAuthentication");

    var callbackURL = getHttp() + getHost() + getHttpPort(true) + "/auth/facebook/callback";
    console.log("callbackURL = " + callbackURL + " clientID = " + getClientID() + " clientSecret = " + getClientSecret());

    // Use the FacebookStrategy within Passport.
    // Strategies in Passport require a `verify` function, which accept
    // credentials (in this case, an accessToken, refreshToken, and Facebook
    // profile), and invoke a callback with a user object.
    passport.use('facebook', new strategy({
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

function setupBasicAuthForAPI(app, passport, strategy) {
    console.log("setupBasicAuthForAPI");
    var models = require('./models');
    var BasicStrategy = require('passport-http').BasicStrategy;

    passport.use(new BasicStrategy(
      function (username, password, done) {
          
          models.Organization.findAll(
            {
                where: {
                    APIKey: username
                }
            }
          ).then(function (organization) {
              if (organization[0] != null) {
                  if (organization[0].APISecret == password) { 
                      return done(null, true);
                  }
                  else {      
                      return done(null, false);
                  }
              }
              else {
                  return done(null, false);
              }
          }
         ).catch(function (err) {
             console.error(err);
             return done(err);
         });
         
      }
        ));

    //we capture all api requests and authenticate them.
    app.all('/api/*',
        passport.authenticate('basic', { session: false })
    );
}

//function setupDigestAuthForAPI(app, passport) {
//    console.log("setupDigestAuthForAPI");
//    var models = require('./models');
//    var DigestStrategy = require('passport-http').DigestStrategy;
//    passport.use(new DigestStrategy(
//        { qop: 'auth' },
//      function (username, done) {
//          console.log("HERE WE GO!  : username: " + username);
//          models.Organization.findAll(
//            {
//                where: {
//                    APIKey: username
//                }
//            }
//          ).then(function (organization) {
//              if (organization[0] != null) {
//                  console.error("org found!: " + organization[0].APISecret);
//                  return done(null, organization[0], organization[0].APISecret);
//              }
//              else {
//                  console.error("no organization found!");
//                  return done(null, false);
//              }
//          }
//         ).catch(function (err) {
//             console.error(err);
//             return done(err);
//         });;
//      },
//      function (params, done) {
//          console.log("validate nonces as necessary");
//          // validate nonces as necessary
//          done(null, true)
//      }
//    ));

//    //we capture all api requests and authenticate them.
//    app.all('/api/*',
//        passport.authenticate('digest', { session: false })
//    );
//}
