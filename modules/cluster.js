var kmeans = require("node-kmeans");
var promise = require("bluebird");

var clusterize = promise.promisify(kmeans.clusterize);

//returns a promise containing the original requests and clusters for each resource type
module.exports.clusterRequests = function(requests, locations) {
	return clusterRequestsByType(requests, locations);
};

function clusterRequestsByType(requests, locations) {
	markFulfilledRequests(requests, locations);
	requests = requests.filter(function (request) {
		return !request.fulfilled;
	});
	var resourceTypeIDs = [1, 2, 3, 4, 5, 6, 7, 8];

	return promise.map(resourceTypeIDs, function(id) {
		return clusterRequestsForType(id, requests);
	})
	.then(function(clusterGroups) {
		return {
			requests: requests,
			locations: locations,
			requestClusters: clusterGroups.reduce(function(clusters, clusterGroup) {
				return clusters.concat(clusterGroup);
			}, [])
		};
	});
}

function convertToRadians(degrees) {
	return degrees * (Math.PI / 180)
}

function markFulfilledRequests(requests, locations) {
	locations.forEach( function (deployment) {
		deployment.ResourceLocationInventories.forEach(function (inventory) {
			requests.forEach(function (request) {
				if (!request.fulfilled) {
					request.fulfilled = calculateKmDistance(deployment.LAT, deployment.LONG, request.LAT, request.LONG) < 4 &&
						request.ResourceTypeID == inventory.ResourceTypeID;
				}
			});
		});
	});
}

function calculateKmDistance(lat1, lng1, lat2, lng2) {
	var earthRadius = 6371;
	var dLat = convertToRadians(lat2 - lat1);
	var dLng = convertToRadians(lng2 - lng1);
	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(convertToRadians(lat1)) * Math.cos(convertToRadians(lat2)) *
		Math.sin(dLng / 2) * Math.sin(dLng / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return earthRadius * c;
}

function clusterRequestsForType(typeId, requests) {
	var numClusters = 4;
	
	var filteredReqs = requests.filter(function(req) {
		return req.ResourceTypeID == typeId;
	});
	
	if (filteredReqs.length < numClusters)
		return promise.resolve([]);
	
	var resourceType = filteredReqs.length > 0 ? filteredReqs[0].ResourceType : {};
	
	var vectors = filteredReqs.map(function(req) {
		return [req.LAT, req.LONG];
	});
	
	return clusterize(vectors, {k: numClusters})
		.then(function(clusters) {
			return clusters.map(function(cluster) {
				return {
					LAT: cluster.centroid[0],
					LONG: cluster.centroid[1],
					ResourceType: resourceType,
					Quantity: cluster.cluster.length,
					Notes: "Cluster of " + cluster.cluster.length + " requests"
				};
			});
		});
}
