//this will set the database environemnt in the config.json file
process.env.NODE_ENV = 'aws-development';
//process.env.NODE_ENV = 'local-dev';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var mysql = require('mysql');
var bodyParser = require('body-parser');
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
// var organizationAddressRouter = require('./routes/organizationaddress')();
var organizationRegulationRouter = require('./routes/organizationregulation')();
var organizationTypeRouter = require('./routes/organizationtype')();
var requestStateRouter = require('./routes/requeststate')();
var resourceLocationRouter = require('./routes/resourcelocation')();
var resourceRegistryRouter = require('./routes/resourceregistry')();
var resourceRequestRouter = require('./routes/resourcerequest')();
var resourceResponseRouter = require('./routes/resourceresponse')();
var resourceTypeRouter = require('./routes/resourcetype')();
var responseStateRouter = require('./routes/responsestate')();

var app = express();

var port = process.env.PORT || 80;
var ssl_port = process.env.SSL_PORT || 443;
var enable_redirect = process.env.ENABLE_REDIRECT || true;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use('/api/account', accountRouter);
app.use('/api/accountrole', accountRoleRouter);
app.use('/api/address', addressRouter);
app.use('/api/event', eventRouter);
app.use('/api/eventlocation', eventLocationRouter);
app.use('/api/eventtype', eventTypeRouter);
app.use('/api/organization', organizationRouter);
// app.use('/api/organizationaddress', organizationAddressRouter);
app.use('/api/organizationregulation', organizationRegulationRouter);
app.use('/api/organizationtype', organizationTypeRouter);
app.use('/api/requeststate', requestStateRouter);
app.use('/api/resourcelocation', resourceLocationRouter);
app.use('/api/resourceregistry', resourceRegistryRouter);
app.use('/api/resourcerequest', resourceRequestRouter);
app.use('/api/resourceresponse', resourceResponseRouter);
app.use('/api/resourcetype', resourceTypeRouter);
app.use('/api/responsestate', responseStateRouter);

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