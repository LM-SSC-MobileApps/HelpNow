module.exports =
{
    setupAuthentication: function (app) {
        console.log("setupAuthentication");
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
    }
};

function logout(req, res) {
    req.logout();

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("User successfully logged out.");
    res.end();
}

function getEnvironment() {
    var os = require('os');
    var host = os.hostname();
    if (host.indexOf('amazonaws.com') > 0) {
        return 'PRD';
    } else {
        return 'DEV';
    }
}

function getHttp() {
    if (getEnvironment() === 'PRD') {
        return 'http://';
    } else {
        return 'http://';
    }
}

function getHost() {
    var os = require('os');
    var host = os.hostname();
    if (getEnvironment() === 'PRD') {
        return host;
    } else {
        return 'localhost';
    }       
}

function getHttpPort(addColon) {
    if (getEnvironment() === 'PRD') {
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
    if (getEnvironment() === 'PRD') {
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
    if (getEnvironment() === 'PRD') {
        return '508069382708084';
    } else {
        return '1735152463375151';
    }
}

function getClientSecret() {
    if (getEnvironment() === 'PRD') {
        return 'df3684bd3cceadb1b7eb344846bfbcc8';
    } else {
        return '4c518502b119e23d3a8c3b861329084f';
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
            var options = {
                host: getHost(),
                path: '/api/account/login',
                port: getHttpPort(false),
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
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

              var creds = '{"email":"' + profile.emails[0].value + '"}';
              var options = {
                  host: getHost(),
                  path: '/api/account/external_login',
                  port: getHttpPort(false),
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' }
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
        passport.authenticate('facebook', { failureRedirect: './#/login' }),
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