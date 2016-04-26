//this will set the database environemnt in the config.json file

var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var https = require('https');
var fs = require('fs');

//the routes for the helpnow api
var accountRouter = require('./routes/account')();
var accountRoleRouter = require('./routes/accountrole')();
var addressRouter = require('./routes/address')();
var eventRouter = require('./routes/event')();
var eventLocationRouter = require('./routes/eventlocation')();
var eventTypeRouter = require('./routes/eventtype')();
var organizationRouter = require('./routes/organization')();
var organizationRegulationRouter = require('./routes/organizationregulation')();
var organizationTypeRouter = require('./routes/organizationtype')();
var requestStateRouter = require('./routes/requeststate')();
var resourceLocationRouter = require('./routes/resourcelocation')();
var resourceLocationTypeRouter = require('./routes/resourcelocationtype')();
var resourceLocationStatusRouter = require('./routes/resourcelocationstatus')();
var resourceLocationInventoryRouter = require('./routes/resourcelocationinventory')();
var resourceLocationTransportRouter = require('./routes/resourcelocationtransport')();
var resourceRequestRouter = require('./routes/resourcerequest')();
var resourceResponseRouter = require('./routes/resourceresponse')();
var resourceTypeRouter = require('./routes/resourcetype')();
var transportTypeRouter = require('./routes/transporttype')();
var resourceTypeUnitOfMeasureRouter = require('./routes/resourcetypeunitofmeasure')();
var responseStateRouter = require('./routes/responsestate')();
var requestUrgencyRouter = require('./routes/requesturgency')();
var requestInviteRequestRouter = require('./routes/inviterequest')();
var blockageRouter = require('./routes/blockage')();
var socialMediaRouter = require('./routes/socialmedia')();

var app = express();

var environment = process.env.ENVIRONMENT || 'qas';
var port = process.env.PORT || 80;
var ssl_port = process.env.SSL_PORT || 443;
var enable_redirect = process.env.ENABLE_REDIRECT || true;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

//for creating the session availability
app.use(
    session({
        secret: 'H3LbN0M_LM',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 600000 }  //max cookie age is 60 minutes
    })
);

// Setup for authentication (must be after all body parsers, cookie parsers and session parsers)
var auth = require('./auth');
auth.setupAuthentication(environment, port, ssl_port, app);

var socialMedia = require('./modules/socialmedia');
//socialMedia.setupTwitter();
//socialMedia.searchTwitter('#HelpNow');

app.use('/api/account', accountRouter);
app.use('/api/accountrole', accountRoleRouter);
app.use('/api/address', addressRouter);
app.use('/api/event', eventRouter);
app.use('/api/eventlocation', eventLocationRouter);
app.use('/api/eventtype', eventTypeRouter);
app.use('/api/organization', organizationRouter);
app.use('/api/organizationregulation', organizationRegulationRouter);
app.use('/api/organizationtype', organizationTypeRouter);
app.use('/api/requeststate', requestStateRouter);
app.use('/api/resourcelocation', resourceLocationRouter);
app.use('/api/resourcelocationtype', resourceLocationTypeRouter);
app.use('/api/resourcelocationstatus', resourceLocationStatusRouter);
app.use('/api/resourcelocationinventory', resourceLocationInventoryRouter);
app.use('/api/resourcelocationtransport', resourceLocationTransportRouter);
app.use('/api/resourcerequest', resourceRequestRouter);
app.use('/api/resourceresponse', resourceResponseRouter);
app.use('/api/resourcetype', resourceTypeRouter);
app.use('/api/transporttype', transportTypeRouter);
app.use('/api/resourcetypeunitofmeasure', resourceTypeUnitOfMeasureRouter);
app.use('/api/responsestate', responseStateRouter);
app.use('/api/requesturgency', requestUrgencyRouter);
app.use('/api/inviterequest', requestInviteRequestRouter);
app.use('/api/blockage', blockageRouter);
app.use('/api/socialmedia', socialMediaRouter);

//set the express.static locations to serve up the static files
app.use(express.static('views'));
app.use(express.static('controllers'));
app.use(express.static('style'));
app.use(express.static('angular'));
app.use(express.static('lib'));
app.use(express.static('i18n'));
app.use(express.static('fonts'));
app.use(express.static('leaflet'));
app.use('/', express.static( __dirname + '/'));



app.get('/', function (req, res) {
    if (req.protocol == "http" && enable_redirect == "true") {
        res.redirect('https://' + req.hostname + ":" + ssl_port + req.url);
    } else {
        res.sendFile(__dirname + '/app.html');
    }
});

app.listen(port, function(){
    console.log('Running on PORT:' + port);
});

https.createServer({
    key: fs.readFileSync('./certs/key.pem'),
    cert: fs.readFileSync('./certs/cert.pem')
}, app).listen(ssl_port, function() {
    console.log('Running on PORT:' + ssl_port);
});
