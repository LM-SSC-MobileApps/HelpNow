angular.module("helpNow").controller("OrgEventCtrl", function ($scope, $routeParams, $resource) {
	var map;
	var mapLayers = [];
	
	$scope.requestsResource = $resource("/api/resourcerequest/event/:eventID");
	
    $scope.eventID = $routeParams.eventID * 1;
	$scope.event = $scope.getEvent($scope.eventID);
	$scope.requests = [];
	
	$scope.showMedical = true;
	$scope.showShelter = true;
	$scope.showFood = true;
	$scope.showWater = true;
	
	function getIcon(resourceType) {
		if (resourceType == "Water") {
			return "style/images/marker-blue.png"
		} else if (resourceType == "First Aid") {
			return "style/images/marker-red.png"
		} else if (resourceType == "Shelter") {
			return "style/images/marker-orange.png"
		} else {
			return "style/images/marker-green.png"
		}
	}
	
	function updateMap() {
		if (!map) return;
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
				|| (type == "First Aid" && $scope.showMedical);
		});
		
		 var heatmapConfig = {
			// radius should be small ONLY if scaleRadius is true (or small radius is intended)
			// if scaleRadius is false it will be the constant radius used in pixels
			"radius": 200,
			"maxOpacity": .8,
			// scales the radius based on map zoom
			"scaleRadius": false,
			// if set to false the heatmap uses the global maximum for colorization
			// if activated: uses the data maximum within the current map boundaries
			//   (there will always be a red spot with useLocalExtremas true)
			"useLocalExtrema": true,
			// which field name in your data represents the latitude - default "lat"
			latField: 'lat',
			// which field name in your data represents the longitude - default "lng"
			lngField: 'lng',
			// which field name in your data represents the data value - default "value"
			valueField: 'count'
		};
		/*var heatmapLayer = new HeatmapOverlay(heatmapConfig);
		var testData = {
			max: 8,
			data: [{ lat: 24.6408, lng: 46.7728, count: 3 }, { lat: 23.7301, lng: 90.3065, count: 2 }]
		};
		heatmapLayer.setData(testData);
		//heatmapLayer.setData(selectedRequests);
		mapLayers.push(heatmapLayer);
		*/
		
		angular.forEach(selectedRequests, function(request) {
			var requestIcon = L.icon({
				iconUrl: getIcon(request.ResourceType.Description),
				iconSize: [27, 41]
			}); 
			var marker = L.marker([request.LAT, request.LONG], { icon: requestIcon });
			mapLayers.push(marker);
		});
		
		angular.forEach(mapLayers, function(layer) {
			map.addLayer(layer);
		});
	}

	$scope.requestsResource.get({eventID: $scope.eventID}, function(data) {
		$scope.requests = data.json;
		updateMap();
	});
	
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
	
	$scope.setCurrentView("org-event");
});

