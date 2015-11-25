angular.module("helpNow").controller("EventMapCtrl", ["$scope", "$routeParams", "$resource", function ($scope, $routeParams, $resource) {
    //$scope.resources = $scope.getResourcesForEvent($scope.eventID);
    //$scope.resource = $scope.resources[0];
    var map;
    var mapLayers = [];
    $scope.setCurrentView("event-map");

    $scope.requestsResource = $resource("/api/event/mapitems/:eventID");

    $scope.eventID = $routeParams.eventID * 1;
    if ($scope.events) {
        $scope.event = $scope.getEvent($scope.eventID);
        loadRequests();
    }

    $scope.requests = [];

    $scope.showFilters = false;
    $scope.showEventDetails = true;
    $scope.showHelp = false;
    $scope.showNeeds = false;

    $scope.showMedical = true;
    $scope.showShelter = true;
    $scope.showFood = true;
    $scope.showWater = true;
    $scope.showEvacuation = true;
    $scope.showMedicine = true;

    $scope.showLocationMarkers = true;

    $scope.$on("EventDataLoaded", function () {
        $scope.event = $scope.getEvent($scope.eventID);
        loadRequests();
        updateMap();
    });

    function buildLocationMarkers() {
        var selectedLocations = $scope.locations.filter(function (location) {
            var type = location.ResourceType.Description;
            return shouldDisplayMarker(type);
        });

        angular.forEach(selectedLocations, function (location) {
            var locationIcon = L.icon({
                iconUrl: $scope.getLocationIcon(location.ResourceType.Description),
				iconSize: [60, 60],
				iconAnchor: [30, 30]
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
        var selectedRequests = $scope.requests.filter(function (request) {
            var type = request.ResourceType.Description;
            return shouldDisplayMarker(type);
        });

        if ($scope.showLocationMarkers)
            buildLocationMarkers();

        angular.forEach(mapLayers, function (layer) {
            map.addLayer(layer);
        });
    }

    function loadRequests() {
        $scope.requestsResource.get({ eventID: $scope.eventID }, function (data) {
            $scope.requests = data.json.requests;
            $scope.locations = data.json.locations;
            updateMap();
        });
    }

    $scope.toggleButtonClass = function (id) {
        var status = $scope[id];
        return status ? "btn btn-toggle active" : "btn btn-toggle";
    };

    $scope.toggleButton = function (id) {
        $scope[id] = !$scope[id];
        updateMap();
        return false;
    };

    $scope.toggleNeed = function (id) {
        $scope[id] = !$scope[id];
        return false;
    }

    $scope.initMap = function (newMap) {
        map = newMap;
        updateMap();
    };

    $scope.filterButtonClass = function () {
        return $scope.showFilters ? "glyphicon glyphicon-eye-close" : "glyphicon glyphicon-eye-open";
    };

    $scope.filterButtonText = function () {
        return $scope.showFilters ? "Hide" : "Show";
    };

    $scope.toggleFilters = function () {
        $scope.showFilters = !$scope.showFilters;
        return false;
    };

    $scope.toggleHelp = function () {
        $scope.showEventDetails = !$scope.showEventDetails;
        $scope.showHelp = !$scope.showHelp;
        return false;
    }

    $scope.toggleNeeds = function () {
        $scope.showHelp = !$scope.showHelp;
        $scope.showNeeds = !$scope.showNeeds;
        return false;
    }

    $scope.sendNeedRequest = function () {
        $scope.showNeeds = !$scope.showNeeds;
        $scope.showEventDetails = !$scope.showEventDetails;
        return false;
    }

    /*$scope.initMap = function(map) {
		map.on('click', function (e) {
			if (locationOutline !== undefined) {
				map.removeLayer(locationOutline);
			}
			locationOutline = L.circle(e.latlng, overlayRadius).addTo(map);
		});

		var firstAidIcon = L.icon({
		    iconUrl: 'style/images/icons/FirstAidResource.png',
		    iconSize: [128, 158.25]
		});

		var waterIcon = L.icon({
		    iconUrl: 'style/images/icons/WaterResource.png',
		    iconSize: [72, 73]
		});

		var evacuationIcon = L.icon({
		    iconUrl: 'style/images/icons/EvacuationIcon.png',
		    iconSize: [72, 73]
		});

		for (var i = 0; i < $scope.resources.length; i++) {
		    var resource = $scope.resources[i];
		    var resourceIcon;
		    if (resource.resourceType == "First Aid") {
		        resourceIcon = firstAidIcon;
		    }
		    else if (resource.resourceType == "Water") {
		        resourceIcon = waterIcon;
		    }
		    else if (resource.resourceType == "Evacuation Site") {
		        resourceIcon = evacuationIcon;
		    }
		    var resourceMarker = L.marker([resource.lat, resource.long], { icon: resourceIcon }).addTo(map);
		    resourceMarker.on('click', function (e) {
		        for (var j = 0; j < $scope.resources.length; j++) {
		            var resourceLatLng = L.latLng($scope.resources[j].lat, $scope.resources[j].long);
		            if(e.latlng.lat == resourceLatLng.lat && e.latlng.lng == resourceLatLng.lng)
		            {
		                $scope.resource = $scope.resources[j];
		                $scope.$apply();
		            }
		        }
		        if ($scope.resource.resourceType == "Evacuation Site") showResourcePanel(false);
		        else showResourcePanel(true);
		    });
		}
	};*/
}]);