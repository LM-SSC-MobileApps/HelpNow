var promise = require("bluebird"),
webRequest = require('request-promise');

module.exports.findNearestDistCenters = function(allDistCenters, location) {
	return findNearestDistCenters(allDistCenters, location);
};

function callRoutingService(serviceQuery) {
	//var routingBaseUrl = "https://router.project-osrm.org/";
	var routingBaseUrl = "http://ec2-52-196-82-173.ap-northeast-1.compute.amazonaws.com/";
	var requestOptions = {
		uri: routingBaseUrl + serviceQuery,
		rejectUnauthorized: false,
		json: true
	};
	return webRequest(requestOptions);
}

function findNearestDistCenters(allDistCenters, location) {
	var distCenters = allDistCenters;
	
	//convert the list of dist centers to a query string to find their routed distance from the current location
	var destList = allDistCenters.reduce(function(listSoFar, center) {
		if (listSoFar != "") listSoFar += "&";
		return listSoFar + "dst=" + center.LAT + "," + center.LONG;
	}, "");
	//call the routing web service to calculate the distances
	return callRoutingService("table?src=" + location + "&" + destList)
	.then(function (distanceData) {
		var distances = distanceData.distance_table[0];
		
		//add the calculated distance to each dist center as a new field
		distCenters = distCenters.map(function(center, index) {
			var distanceInMinutes = (distances[index] / 600).toFixed(2)
			center.dataValues.Distance = distanceInMinutes;
			return center;
		});
		
		//sort the dist centers by distance to find the three closest
		distCenters.sort(function(a, b) {
			return a.dataValues.Distance - b.dataValues.Distance;
		});
		distCenters = distCenters.slice(0, 3);
		
		//for each of the closest centers, call the web service to get the route geometry
		var routingTasks = [];
		for (var i = 0; i < distCenters.length; i++) {
			var servicePath = "viaroute?compression=false&loc=" + location + "&loc=" + distCenters[i].LAT + "," + distCenters[i].LONG;
			var task = callRoutingService(servicePath);
			routingTasks.push(task);
		}
		return promise.all(routingTasks);
	}).then(function (routingResults) {
		//add the route geometry to each center
		for (var i = 0; i < distCenters.length; i++) {
			var route = routingResults[i].route_geometry;
			distCenters[i].dataValues.Route = route;
		}
		return distCenters;
	});
}