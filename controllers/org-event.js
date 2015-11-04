angular.module("helpNow").controller("OrgEventCtrl", ["$scope", "$routeParams", "$resource", function ($scope, $routeParams, $resource) {
	var map;
	var mapLayers = [];
	$scope.setCurrentView("org-events");
	
	$scope.requestsResource = $resource("/api/event/mapitems/:eventID");
	
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
	$scope.showMedicine = true;
	
	$scope.showHeatmap = true;
	$scope.showNeedsMarkers = true;
	$scope.showLocationMarkers = true;
	
	function getNeedsIcon(resourceType) {
		if (resourceType == "Water") {
			return "style/images/marker-blue.png";
		} else if (resourceType == "First Aid") {
			return "style/images/marker-red.png";
		} else if (resourceType == "Shelter") {
			return "style/images/marker-orange.png";
		} else if (resourceType == "Evacuation") {
			return "style/images/marker-purple.png";
		} else if (resourceType == "Medicine") {
			return "style/images/marker-cyan.png";
		} else {
			return "style/images/marker-green.png";
		}
	}
	
	function getLocationIcon(resourceType) {
		if (resourceType == "Water") {
			return "style/images/marker2-blue.png";
		} else if (resourceType == "First Aid") {
			return "style/images/marker2-red.png";
		} else if (resourceType == "Shelter") {
			return "style/images/marker2-orange.png";
		} else if (resourceType == "Evacuation") {
			return "style/images/marker2-purple.png";
		} else if (resourceType == "Medicine") {
			return "style/images/marker2-cyan.png";
		} else {
			return "style/images/marker2-green.png";
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
	
	function buildLocationMarkers() {
		var selectedLocations = $scope.locations.filter(function(location) {
			var type = location.ResourceType.Description;
			return shouldDisplayMarker(type);
		});
		
		angular.forEach(selectedLocations, function(location) {
			var locationIcon = L.icon({
				iconUrl: getLocationIcon(location.ResourceType.Description),
				iconSize: [27, 41]
			}); 
			var marker = L.marker([location.ResourceLocation.LAT, location.ResourceLocation.LONG], { icon: locationIcon });
			marker.bindPopup("<strong>" + location.ResourceType.Description + " (" + location.Organization.Name + ")</strong><br/>" + location.Notes);
			mapLayers.push(marker);
		});
	}
	
	function shouldDisplayMarker(type) {
		return (type == "Water" && $scope.showWater) || 
				(type == "Shelter" && $scope.showShelter) || 
				(type == "Food" && $scope.showFood) || 
				(type == "Evacuation" && $scope.showEvacuation) || 
				(type == "First Aid" && $scope.showMedical) || 
				(type == "Medicine" && $scope.showMedicine);
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
			return shouldDisplayMarker(type);
		});
		
		if ($scope.showHeatmap)
			buildHeatmap(selectedRequests);
		
		if ($scope.showNeedsMarkers)
			buildNeedsMarkers(selectedRequests);
		
		if ($scope.showLocationMarkers)
			buildLocationMarkers();
		
		angular.forEach(mapLayers, function(layer) {
			map.addLayer(layer);
		});
	}

	function loadRequests() {
		$scope.requestsResource.get({eventID: $scope.eventID}, function(data) {
			$scope.requests = data.json.requests;
			$scope.locations = data.json.locations;
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
	
	$scope.initMap = function(newMap) {
		map = newMap;
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

