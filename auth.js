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
    }

    if (process.platform.indexOf("linux") >= 0) {
        var child_process = require("child_process");
        var hostname = child_process.execSync("curl -s http://169.254.169.254/latest/meta-data/public-hostname");
        if (hostname.indexOf("") == 0) {
            return "localhost";
        } else {
            return hostname;
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
            var options = {
                host: 'localhost',
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
                  host: 'localhost',
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