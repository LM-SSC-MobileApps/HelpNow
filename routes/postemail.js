var nodemailer = require('nodemailer'),
    sesTransport = require('nodemailer-ses-transport'),
    express = require('express');


var env       = process.env.NODE_ENV || 'aws-development';
var config    = require(__dirname + '/../config/config.json')[env];
var sesconfig    = require(__dirname + '/../config/ses_secret.json');

var routes = function () {
    var router = express.Router();
    router.post('/', function (req, res) {

            var transport = nodemailer.createTransport((sesTransport({
                accessKeyId:  sesconfig.AccessKeyId,
                secretAccessKey:  sesconfig.SecretAccessKey,
                region: config.ses_region,
                httpOptions: "",
                rateLimit: "5",
                sessionToken: ""
            })));

            console.log('SES Configured');


            // setup e-mail data with unicode symbols
            var mailOptions = {
                from: "HelpNowMap.com ✔ <dave.s.jennings@gmail.com>", // sender address
                to: "dave.s.jennings@gmail.com", // list of receivers
                subject: "Test from AWS ✔", // Subject line
                text: "Test from AWS ✔", // plaintext body
                html: "<b>Test from AWS ✔</b>" // html body
            };


            console.log('Sending Mail');

            // send mail with defined transport object
            transport.sendMail(mailOptions, function (error, response) {
                if (error) {
                    console.log('Error occurred');
                    console.log(error);
                    res.statusCode = 400;
                    res.send({
                        result: 'error',
                        err: error.message
                    });
                } else {
                    console.log("Message sent: " + response.message);
                    res.statusCode = 200;
                    res.send(
                        {
                            result: 'success',
                            err: ''

                        }
                    );
                }

            // if you don't want to use this transport object anymore, uncomment following line
                transport.close(); // shut down the connection pool, no more messages
            });


        }


    );

    return router;
}

module.exports = routes;