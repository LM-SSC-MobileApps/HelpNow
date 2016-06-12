var http = require('http');

module.exports =
{
    setupTomnod: function (app, fs, path, formidable) {
        console.log("setupTomnod");

        app.post('/tomnod_uploads', function (req, res) {
            var processResult = "Success: Processed file successfully.";

            // create an incoming form object
            var form = new formidable.IncomingForm();

            // specify that we want to allow the user to upload multiple files in a single request
            form.multiples = false;

            // store all uploads in the /uploads directory
            var dir = __dirname.replace(/modules/g, '');
            form.uploadDir = path.join(dir, 'tomnod_uploads');
            form.keepExtensions = true;

            form.on('file', function (field, file) {               
                var eventID = file.name.split("End")[0].split("EventID")[1];
                var fileFullPath = form.uploadDir + path.sep + file.name;
                var fileName = file.name;
                var fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length);
                console.log("Processing Tomnod File at: " + file.path);                

                // Ensure JSON file type
                if (fileExtension != "json") {
                    processResult = "Error: Unsupported file type (extension: " + fileExtension + ").";
                    return;
                }

                // Make sure to parse the JSON file
                try {
                    var obj = JSON.parse(fs.readFileSync(file.path, 'utf8'));
                } catch (e) {
                    processResult = "Error: Invalid JSON file. Exception: " + e + ".";
                    return;
                }

                // Remove previously uploaded tomnod data based on event id
                console.log("Remove Old Tomnod Data");
                deleteBlockages(eventID);
              
                // Process JSON message
                console.log("Saving Tomnod Data");
                for (var i = 0; i < obj.features.length; i++) {
                    if (obj.features[i].properties.type_id == "97") {
                        // Validate structure of JSON and if bad skip that record but import the rest
                        if (obj.features[i].properties.type_id === undefined ||
                            obj.features[i].geometry.coordinates[0] === undefined ||
                            obj.features[i].geometry.coordinates[1] === undefined ||
                            obj.features[i].properties.chip_url === undefined ||
                            obj.features[i].properties.id === undefined ||
                            obj.features[i].properties.tag_type === undefined ||
                            obj.features[i].properties.type_id === undefined) {
                            // SKIP BAD RECORD
                        } else {
                            blockage = {
                                "BlockageSourceID": 2,
                                "EventID": eventID,
                                "LAT": "" + obj.features[i].geometry.coordinates[1] + "",
                                "LONG": "" + obj.features[i].geometry.coordinates[0] + "",
                                "Description": "" + obj.features[i].properties.tag_type + "",
                                "ImageURL": "" + obj.features[i].properties.chip_url + "",
                                "CatID": "" + obj.features[i].properties.id + ""
                            }

                            //console.log(JSON.stringify(blockage));
                            saveBlockages(blockage);
                        }
                    }
                }
            });

            // log any errors that occur
            form.on('error', function (err) {
                console.log('An error has occured: \n' + err);
            });

            // once all the files have been uploaded, send a response to the client
            form.on('end', function () {
                if (processResult == "Success: Processed file successfully.") {
                    console.log(processResult);
                    res.send(processResult);
                } else {
                    console.log(processResult);
                    res.send(processResult);
                }
            });

            // parse the incoming request containing the form data
            form.parse(req);            
        });        
    }
};

var deleteBlockageOptions = {
    host: 'localhost',
    port: '8080',
    auth: 'a1ada5ab-b8c2-11e5-847d-00ffd0ea9272:H3lpN0w2016',
    method: 'DELETE',
    headers: {
        "Content-Type": "application/json"
    }
}

function deleteBlockages(eventID) {
    deleteBlockageOptions.path = '/api/blockage/tomnod/' + eventID;
    var req = http.request(deleteBlockageOptions, deleteBlockageCallback).end();
}

deleteBlockageCallback = function (response) {
    var str = '';
    response.on('data', function (chunk) {
        str += chunk;
    });

    response.on('end', function () {
    });
}

var saveBlockageOptions = {
    host: 'localhost',
    path: '/api/blockage',
    port: '8080',
    auth: 'a1ada5ab-b8c2-11e5-847d-00ffd0ea9272:H3lpN0w2016',
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    }
}

function saveBlockages(blockage) {    
    var req = http.request(saveBlockageOptions, saveBlockageCallback);
    req.write(JSON.stringify(blockage));
    req.end();
}

saveBlockageCallback = function (response) {
    var str = '';
    response.on('data', function (chunk) {
        str += chunk;
    });

    response.on('end', function () {
    });
}