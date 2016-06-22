var nodemailer = require('nodemailer'),
    sesTransport = require('nodemailer-ses-transport'),
    express = require('express'),
    passport = require('passport');


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

        //console.log('req.body.InviteID : ' + req.body.InviteID);

            var mailOptions = {
                from: "HelpNowMap.com  <invite@helpnowmap.com>", // sender address
                to: req.body.email , // list of receivers
                subject: "Registration Invitation from HelpNowMap.com", // Subject line
                //text: "Test from AWS ", // plaintext body
                html: "Please click on link to register:  http://" + config.ses_host_name + "/#/reg_account/"   + req.body.InviteID
            };

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


    )


    return router;
}

module.exports = routes;