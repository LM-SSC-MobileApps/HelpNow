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

                // Validate structure of JSON
                if (obj.features[0].properties.type_id === undefined ||
                    obj.features[0].geometry.coordinates[0] === undefined ||
                    obj.features[0].geometry.coordinates[1] === undefined ||
                    obj.features[0].properties.chip_url === undefined ||
                    obj.features[0].properties.id === undefined ||
                    obj.features[0].properties.tag_type === undefined ||
                    obj.features[0].properties.type_id === undefined) {
                    processResult = "Error: JSON missing fields (i.e. type_id, coordinates[0,1], chip_url, id, tag_type or type_id).";
                    return;
                }

                // Process JSON message
                for (var i = 0; i < obj.features.length; i++) {
                    if (obj.features[i].properties.type_id == "97") {
                        console.log("lat = " + obj.features[i].geometry.coordinates[0]);
                        console.log("long = " + obj.features[i].geometry.coordinates[1]);
                        console.log("url = " + obj.features[i].properties.chip_url);
                        console.log("catid = " + obj.features[i].properties.id);
                        console.log("desc = " + obj.features[i].properties.tag_type);
                        console.log("type id = " + obj.features[i].properties.type_id);
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



