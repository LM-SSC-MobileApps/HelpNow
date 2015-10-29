angular.module("helpNow").controller("OrgEventCtrl", function ($scope, $routeParams, $resource) {
	var map;
	var mapLayers = [];
	
	$scope.setCurrentView("org-events");
	
	$scope.requestsResource = $resource("/api/resourcerequest/event/:eventID");
	
    $scope.eventID = $routeParams.eventID * 1;
	if ($scope.events) {
		$scope.event = $scope.getEvent($scope.eventID);
		loadRequests();
	}
	
	$scope.requests = [];
	
	$scope.showFilters = true;
	
	$scope.showMedical = true;
	$scope.showShelter = true;
	$scope.showFood = true;
	$scope.showWater = true;
	$scope.showEvacuation = true;
	
	$scope.showHeatmap = true;
	$scope.showNeedsMarkers = true;
	
	function getIcon(resourceType) {
		if (resourceType == "Water") {
			return "style/images/marker-blue.png"
		} else if (resourceType == "First Aid") {
			return "style/images/marker-red.png"
		} else if (resourceType == "Shelter") {
			return "style/images/marker-orange.png"
		} else if (resourceType == "Evacuation") {
			return "style/images/marker-purple.png"
		} else {
			return "style/images/marker-green.png"
		}
	}
	
	$scope.$on("EventDataLoaded", function() {
		$scope.event = $scope.getEvent($scope.eventID);
		loadRequests();
		updateMap()
	});
	
	function buildNeedsMarkers(selectedRequests) {
		angular.forEach(selectedRequests, function(request) {
			var requestIcon = L.icon({
				iconUrl: getIcon(request.ResourceType.Description),
				iconSize: [27, 41]
			}); 
			var marker = L.marker([request.LAT, request.LONG], { icon: requestIcon });
			marker.bindPopup("<strong>" + request.ResourceType.Description + " (" + request.Quantity + ")</strong><br/>" + request.Notes);
			mapLayers.push(marker);
		});
	}
	
	function buildHeatmap(selectedRequests) {
		var heatmapConfig = {
			"radius": 100,
			"maxOpacity": .5,
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
		
		for (var i = 0; i < mapLayers.length; i++) {
			var layer = mapLayers[i];
			map.removeLayer(layer);
		}
		
		mapLayers = [];
		var selectedRequests = $scope.requests.filter(function(request) {
			var type = request.ResourceType.Description;
			return (type == "Water" && $scope.showWater)
				|| (type == "Shelter" && $scope.showShelter)
				|| (type == "Food" && $scope.showFood)
				|| (type == "Evacuation" && $scope.showEvacuation)
				|| (type == "First Aid" && $scope.showMedical);
		});
		
		if ($scope.showHeatmap)
			buildHeatmap(selectedRequests);
		
		if ($scope.showNeedsMarkers)
			buildNeedsMarkers(selectedRequests);
		
		angular.forEach(mapLayers, function(layer) {
			map.addLayer(layer);
		});
	}

	function loadRequests() {
		$scope.requestsResource.get({eventID: $scope.eventID}, function(data) {
			$scope.requests = data.json;
			updateMap();
		});
	}
	
	$scope.toggleButtonClass = function(id) {
		var status = $scope[id];
		return status ? "btn btn-toggle active" : "btn btn-toggle";
	}
	
	$scope.toggleButton = function(id) {
		$scope[id] = !$scope[id];
		updateMap();
		return false;
	}
	
	$scope.initMap = function(newMap) {
		map = newMap;
		updateMap();
	}
	
	$scope.filterButtonClass = function() {
		return $scope.showFilters ? "glyphicon glyphicon-eye-close" : "glyphicon glyphicon-eye-open";
	}
	
	$scope.filterButtonText = function() {
		return $scope.showFilters ? "Hide" : "Show";
	}
	
	$scope.toggleFilters = function() {
		$scope.showFilters = !$scope.showFilters;
		return false;
	}
	
	$scope.setCurrentView("org-event");
});

