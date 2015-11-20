angular.module("helpNow").controller("EventMapCtrl", ["$scope", "$routeParams", "$resource", function ($scope, $routeParams, $resource) {

    var map;
    var mapLayers = [];

    $scope.setCurrentView("event-map");

    $scope.requestsResource = $resource("/api/event/mapitems/:eventID");
    $scope.urgencyResource = $resource("/api/requesturgency");
    $scope.needRequestResource = $resource("/api/resourcerequest");
    
    $scope.helpRequest = { eventID: '', requestStateID: '1', notes: 'Reported from App', areaSize: '', unitOfMeasure: '', quantity: '', requestUrgencyID: '1' };

    $scope.eventID = $routeParams.eventID * 1;
    if ($scope.events) {
        $scope.event = $scope.getEvent($scope.eventID);
        loadRequests();
        loadUrgencyList();
    }

    $scope.requests = [];

    $scope.overlayRadius = 1000;
    $scope.radiusRawVal = 1;
    $scope.sliderLabel = "1 km";
    $scope.isMetric = true;

    $scope.showFilters = true;
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
    $scope.locationPref = { value: 'Current' };

    $scope.showValue = function () {
        if ($scope.radiusRawVal == 0)
            $scope.radiusRawVal = 1;

        if ($scope.isMetric) {
            $scope.overlayRadius = $scope.radiusRawVal * 1000;
            $scope.sliderLabel = $scope.radiusRawVal + " km";
        }
        else {
            $scope.overlayRadius = $scope.radiusRawVal * 1000;
            $scope.sliderLabel = $scope.radiusRawVal + " mi";
        }
        $scope.helpRequest.areaSize = $scope.sliderLabel;

        if ($scope.locationOutline != undefined)
            $scope.locationOutline.setRadius($scope.overlayRadius);
    };

    $scope.changeUnits = function () {
        if ($scope.isMetric) {
            $scope.sliderLabel = $scope.radiusRawVal + " km";
            $scope.overlayRadius = $scope.overlayRadius / 0.62137119;
            if ($scope.locationOutline != undefined)
                $scope.locationOutline.setRadius($scope.overlayRadius);
        }
        else {
            $scope.sliderLabel = $scope.radiusRawVal + " mi";
            $scope.overlayRadius = $scope.overlayRadius * 0.62137119;
            if ($scope.locationOutline != undefined)
                $scope.locationOutline.setRadius($scope.overlayRadius);
        }
        $scope.helpRequest.areaSize = $scope.sliderLabel;
    }

    function resetNeedsButtons() {
        $scope.showMedicalNeed = false;
        $scope.showShelterNeed = false;
        $scope.showFoodNeed = false;
        $scope.showWaterNeed = false;
        $scope.showEvacuationNeed = false;
        $scope.showMedicineNeed = false;
        return false;
    }

    function getLocationIcon(resourceType) {
        if (resourceType == "Water") {
            return "style/images/icons/WaterResource.png";
        } else if (resourceType == "First Aid") {
            return "style/images/icons/FirstAidResource.png";
        } else if (resourceType == "Shelter") {
            return "style/images/marker2-orange.png";
        } else if (resourceType == "Evacuation") {
            return "style/images/icons/EvacuationIcon.png";
        } else if (resourceType == "Medicine") {
            return "style/images/marker2-cyan.png";
        } else {
            return "style/images/marker2-green.png";
        }
    }

    $scope.$on("EventDataLoaded", function () {
        $scope.event = $scope.getEvent($scope.eventID);
        loadRequests();
        loadUrgencyList();
        resetNeedsButtons();
        updateMap();
    });

    function buildLocationMarkers() {
        var selectedLocations = $scope.locations.filter(function (location) {
            var type = location.ResourceType.Description;
            return shouldDisplayMarker(type);
        });

        angular.forEach(selectedLocations, function (location) {
            var resourceIconSize = [0, 0];
            if (location.ResourceType.Description == "Water" || location.ResourceType.Description == "Evacuation") resourceIconSize = [72, 73];
            else if (location.ResourceType.Description == "First Aid") resourceIconSize = [128, 158.25];
            else resourceIconSize = [27, 41];
            var locationIcon = L.icon({
                iconUrl: getLocationIcon(location.ResourceType.Description),
                iconSize: resourceIconSize
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

    function loadUrgencyList() {
        $scope.urgencyResource.get({}, function (data) {
            $scope.urgencyList = data.json;
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
    };

    $scope.initMap = function (newMap) {
        map = newMap;
        map.on('click', function (e) {
            if ($scope.locationOutline !== undefined) {
                map.removeLayer($scope.locationOutline);
            }
            $scope.locationOutline = L.circle(e.latlng, $scope.overlayRadius).addTo(map);
            if ($scope.locationPref.value == "Other") {
                $scope.helpRequest.lat = e.latlng.lat.toFixed(3);
                $scope.helpRequest.long = e.latlng.lng.toFixed(3);
                $scope.$digest();
            }
        });
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
    };

    $scope.toggleNeeds = function () {
        $scope.showHelp = !$scope.showHelp;
        $scope.showNeeds = !$scope.showNeeds;
        return false;
    };

    $scope.sendNeedRequest = function () {
        $scope.helpRequest.eventID = $scope.eventID;
        var splitString = $scope.helpRequest.areaSize.split(" ");
        $scope.helpRequest.areaSize = splitString[0];
        $scope.helpRequest.unitOfMeasure = splitString[1];
        /*alert($scope.helpRequest.eventID);
        alert($scope.helpRequest.requestStateID);
        alert($scope.helpRequest.notes);
        alert($scope.helpRequest.quantity);
        alert($scope.helpRequest.lat);
        alert($scope.helpRequest.long);
        alert($scope.helpRequest.requestUrgencyID);
        alert($scope.helpRequest.areaSize);
        alert($scope.helpRequest.unitOfMeasure);
        alert($scope.helpRequest.requestorName);
        alert($scope.helpRequest.requestorPhone);
        alert($scope.helpRequest.requestorEmail);
        alert($scope.helpRequest.requestorUpdatePref);*/
        if ($scope.showMedicalNeed) {
            $scope.helpRequest.resourceTypeID = '4';
            alert("Needs First Aid");
        }
        if ($scope.showShelterNeed) {
            $scope.helpRequest.resourceTypeID = '3';
            alert("Needs Shelter");
        }
        if ($scope.showFoodNeed) {
            $scope.helpRequest.resourceTypeID = '1';
            alert("Needs Food");
        }
        if ($scope.showMedicineNeed) {
            $scope.helpRequest.resourceTypeID = '6';
            alert("Needs Medicine");
        }
        if ($scope.showWaterNeed) {
            $scope.helpRequest.resourceTypeID = '2';
            alert("Needs Water");
        }
        if ($scope.showEvacuationNeed) {
            $scope.helpRequest.resourceTypeID = '5';
            alert("Needs Evacuation");
        }
        resetNeedsButtons();
        $scope.showNeeds = !$scope.showNeeds;
        $scope.showEventDetails = !$scope.showEventDetails;
        return false;
    };

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