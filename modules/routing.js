var promise = require("bluebird"),
webRequest = require('request-promise');

var env = process.env.NODE_ENV || 'aws-development';
var config = require(__dirname + '/../config/config.json')[env];


module.exports.findNearestDistCenters = function(allDistCenters, location) {
	return findNearestDistCenters(allDistCenters, location);
};

function callRoutingService(serviceQuery) {
	var routingBaseUrl = config.routeserver;
	var requestOptions = {
		uri: routingBaseUrl + serviceQuery,
		rejectUnauthorized: false,
		json: true
	};
	//console.log("Route Call: " + requestOptions.uri);
	return webRequest(requestOptions);
}

function findNearestDistCenters(allDistCenters, location) {
        var distCenters = allDistCenters;
	
	//convert the list of dist centers to a query string to find their routed distance from the current location
	var destList = allDistCenters.reduce(function(listSoFar, center) {
                //OSRMV4API
		//if (listSoFar != "") listSoFar += "&";
		//return listSoFar + "dst=" + center.LAT + "," + center.LONG;
                //OSRMV5API
                if (listSoFar != "") listSoFar += ";";
                return listSoFar + center.LONG + "," + center.LAT;
	}, "");

       
	//call the routing web service to calculate the distances
	// OSRMV4API
        // return callRoutingService("table?src=" + location + "&" + destList)
        // OSRMV5API
        var locSplit = location.split(",");
        return callRoutingService("table/v1/profile/" + locSplit[1] + "," + locSplit[0] + ";" + destList + "?sources=0")
	.then(function (distanceData) {
                // OSRMV4API
		// var distances = distanceData.distance_table[0];
                // OSRMV5API
                var distances = distanceData.durations[0];

                var validCenters = 0;
                for (var i = 0; i < distCenters.length; i++)
                {
			if(distances[i] == "null" || distances[i] == null)
			{
				distances[i] = 2147483647;
			}
                        if(distances[i] < 2147483647 && distances[i] > 0)
                                validCenters++;
                }

                if(validCenters > 3)
                        validCenters = 3;

		//add the calculated distance to each dist center as a new field
		distCenters = distCenters.map(function(center, index) {
                        // OSRMV4API
			// var distanceInMinutes = (distances[index] / 600).toFixed(2)
                        // OSRMV5API
                        var distanceInMinutes = (distances[index+1] / 60).toFixed(2)
			center.dataValues.Distance = distanceInMinutes;
			return center;
		});

		//Debug output of results
		//for (var i = 0; i < distCenters.length; i++)		
		//	console.log("Center " + distCenters[i].dataValues.Description + " [" + distCenters[i].dataValues.Organization.dataValues.Name + "] = " + distCenters[i].dataValues.Distance + " / " + distCenters[i].dataValues.PrimaryPOCName + " @ " + distCenters[i].dataValues.LONG + ", " + distCenters[i].dataValues.LAT);		
		
		//sort the dist centers by distance to find the three closest
		distCenters.sort(function(a, b) {
			return a.dataValues.Distance - b.dataValues.Distance;
		});

                // OSRMV4API
		// distCenters = distCenters.slice(0, validCenters);
                // OSRMV5API
		distCenters = distCenters.slice(1, validCenters + 1);
		
		//for each of the closest centers, call the web service to get the route geometry
		var routingTasks = [];
		for (var i = 0; i < distCenters.length; i++) {
			// OSRMV4API
			// var servicePath = "viaroute?compression=false&loc=" + location + "&loc=" + distCenters[i].LAT + "," + distCenters[i].LONG;
                        // OSRMV5API
			var servicePath = "route/v1/profile/" + locSplit[1] + "," + locSplit[0] + ";" + distCenters[i].LONG + "," + distCenters[i].LAT + "?geometries=geojson";
			var task = callRoutingService(servicePath);
			routingTasks.push(task);
		}
		return promise.all(routingTasks);
	}).then(function (routingResults) {
		//add the route geometry to each center
		for (var i = 0; i < distCenters.length; i++) {
			// OSRMV4API
			// var route = routingResults[i].route_geometry;
			// OSRMV5API - OSRM flipped all long/lats, so flip it back for consumers of the service
                        var route = routingResults[i].routes[0].geometry.coordinates;
			for(var j = 0; j < route.length; j++)
			{
				var a = route[j][0];
				route[j][0] = route[j][1];
				route[j][1] = a;
			}
			distCenters[i].dataValues.Route = route;
		}

		return distCenters;
	});
}
