/**
 * Created by major on 5/3/16.
 */

var models  = require('../models'),
    express = require('express');

var routes = function(){
    var router  = express.Router();
    router.get('/', function(req, res) {
            //whatever you need here


        
            }
        )
        //find by ID
        .get('/:id', function(req, res) {
                //whatever you need here



            }
        );


    return router;
}

module.exports = routes;