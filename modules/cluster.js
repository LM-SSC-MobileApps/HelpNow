var kmeans = require("node-kmeans");
var promise = require("bluebird");

var clusterize = promise.promisify(kmeans.clusterize);

//returns a promise containing the original requests and clusters for each resource type
module.exports.clusterRequests = function(requests) {
	return clusterRequestsByType(requests);
};

function clusterRequestsByType(requests) {
	var resourceTypeIDs = [1, 2, 3, 4, 5, 6, 7, 8];
	return promise.map(resourceTypeIDs, function(id) {
		return clusterRequestsForType(id, requests);
	})
	.then(function(clusterGroups) {
		return {
			requests: requests,
			requestClusters: clusterGroups.reduce(function(clusters, clusterGroup) {
				return clusters.concat(clusterGroup);
			}, [])
		};
	});
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
