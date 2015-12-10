angular.module("helpNow").controller("OrgEventCtrl", ["$scope", "$routeParams", "$resource", function ($scope, $routeParams, $resource) {
	var map;
	var mapLayers = [];
	$scope.setCurrentView("org-events");
	
	$scope.requestsResource = $resource("/api/event/mapitems/:eventID");
	
    $scope.eventID = $routeParams.eventID * 1;
	if ($scope.events) {
	    $scope.event = $scope.getEvent($scope.eventID);
	    $scope.setTitle($scope.event.EventLocations[0].Description);
		loadRequests();
	} 
	
	$scope.requests = [];
	
	$scope.showFilters = false; 
	
	$scope.showHeatmap = false;
	$scope.showClusters = false;
	$scope.showNeedsMarkers = true;
	$scope.showLocationMarkers = false;
	
	function getNeedsIcon(resourceType) {
		if (resourceType == "Water") {
			return "style/images/markers/marker-blue.png";
		} else if (resourceType == "First Aid") {
			return "style/images/markers/marker-red.png";
		} else if (resourceType == "Shelter") {
			return "style/images/markers/marker-orange.png";
		} else if (resourceType == "Evacuation") {
			return "style/images/markers/marker-purple.png";
		} else if (resourceType == "Medicine") {
			return "style/images/markers/marker-cyan.png";
		} else {
			return "style/images/markers/marker-green.png";
		}
	}
	
	function getClusterIcon(resourceType) {
		if (resourceType == "Water") {
			return "style/images/Water-Circle-Red.png";
		} else if (resourceType == "First Aid") {
			return "style/images/First Aid-Circle-Red.png";
		} else if (resourceType == "Shelter") {
			return "style/images/Shelter-Circle-Red.png";
		} else if (resourceType == "Evacuation") {
			return "style/images/Evacuation-Circle-Red.png";
		} else if (resourceType == "Medicine") {
			return "style/images/Medicine-Circle-Red.png";
		} else {
			return "style/images/Food-Circle-Red.png";
		}
	}
	
	$scope.$on("EventDataLoaded", function() {
		$scope.event = $scope.getEvent($scope.eventID);
		loadRequests();
		updateMap();
	});
	
	function buildNeedsMarkers(selectedRequests) {
		angular.forEach(selectedRequests, function(request) {
			var requestIcon = L.icon({
				iconUrl: getNeedsIcon(request.ResourceType.Description),
				iconSize: [27, 41],
				iconAnchor: [13, 41],
				popupAnchor:  [0, -20]
			}); 
			var marker = L.marker([request.LAT, request.LONG], { icon: requestIcon });
			marker.bindPopup("<strong>" + request.ResourceType.Description + " (" + request.Quantity + ")</strong><br/>" + request.Notes);
			mapLayers.push(marker);
		});
	}
	
	function buildClusterMarkers() {
		if (!$scope.requestClusters) return;
		var selectedClusters = $scope.requestClusters.filter(function(cluster) {
			var type = cluster.ResourceType.Description;
			return $scope.shouldDisplayMarker(type);
		});
		
		angular.forEach(selectedClusters, function(cluster) {
			var clusterIcon = L.icon({
				iconUrl: getClusterIcon(cluster.ResourceType.Description),
				iconSize: [50, 50],
				iconAnchor: [25, 25]
			}); 
			var marker = L.marker([cluster.LAT, cluster.LONG], { icon: clusterIcon });
			marker.bindPopup("<strong>" + cluster.ResourceType.Description + "</strong><br/>" + cluster.Notes);
			mapLayers.push(marker);
		});
	}
	
	function buildHeatmap(selectedRequests) {
		var heatmapConfig = {
			"radius": 100,
			"maxOpacity": 0.5,
			"scaleRadius": false,
			"useLocalExtrema": true,
			latField: 'LAT',
			lngField: 'LONG',
			valueField: 'Quantity'
		};
		
		var heatmapLayer = new HeatmapOverlay(heatmapConfig);
		var heatmapData = { data: selectedRequests };
		heatmapLayer.setData(heatmapData);
		mapLayers.push(heatmapLayer);
	}
	
	function updateMap() {
		if (!map || !$scope.events) return;
		
		var zoom = map.getZoom();
		
		for (var i = 0; i < mapLayers.length; i++) {
			var layer = mapLayers[i];
			map.removeLayer(layer);
		}
		
		mapLayers = [];
		var selectedRequests = $scope.requests.filter(function(request) {
			var type = request.ResourceType.Description;
			return $scope.shouldDisplayMarker(type);
		});
		
		if ($scope.showHeatmap)
			buildHeatmap(selectedRequests);
		
		if ($scope.showNeedsMarkers && zoom > 7)
			buildNeedsMarkers(selectedRequests);
		
		if ($scope.showClusters)
			buildClusterMarkers();
		
		if ($scope.showLocationMarkers)
			$scope.buildLocationMarkers($scope.locations, mapLayers);
		
		angular.forEach(mapLayers, function(layer) {
			map.addLayer(layer);
		});
	}

	function loadRequests() {
		$scope.requestsResource.get({eventID: $scope.eventID}, function(data) {
			$scope.requests = data.json.requests;
			$scope.locations = data.json.locations;
			$scope.requestClusters = data.json.requestClusters;
			updateMap();
		});
	}
	
	$scope.toggleButtonClass = function(id) {
		var status = $scope[id];
		return status ? "btn btn-toggle active" : "btn btn-toggle";
	};
	
	$scope.toggleButton = function(id) {
		$scope[id] = !$scope[id];
		updateMap();
		return false;
	};
	
	$scope.toggleParentFlag = function(id) {
		$scope.toggleFlag(id);
		updateMap();
		return false;
	}
	
	$scope.initMap = function(newMap) {
		map = newMap;
		map.on("zoomend", function() {
			updateMap();
		});
		updateMap();
	};
	
	$scope.filterButtonClass = function() {
		return $scope.showFilters ? "glyphicon glyphicon-eye-close" : "glyphicon glyphicon-eye-open";
	};
	
	$scope.filterButtonText = function() {
		return $scope.showFilters ? "Hide" : "Show";
	};
	
	$scope.toggleFilters = function() {
		$scope.showFilters = !$scope.showFilters;
		return false;
	};
	
	$scope.setCurrentView("org-event");
}]);

