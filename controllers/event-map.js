angular.module("helpNow").controller("EventMapCtrl", ["$scope", "$http", "$routeParams", "$resource", function ($scope, $http, $routeParams, $resource) {

    var map;
    var mapLayers = [];

    $scope.setCurrentView("event-map");

    $scope.requestsResource = $resource("/api/event/mapitems/:eventID");
    $scope.urgencyResource = $resource("/api/requesturgency");
    $scope.needRequestResource = $resource("/api/resourcerequest");

    $scope.helpRequest = { EventID: '', RequestStateID: '1', Notes: 'Reported from App', AreaSize: '0.25 km', UnitOfMeasure: '', Quantity: '' };

    $scope.eventID = $routeParams.eventID * 1;
    if ($scope.events) {
        $scope.event = $scope.getEvent($scope.eventID);
        loadRequests();
        loadUrgencyList();
    }

    $scope.requests = [];

    $scope.overlayRadius = 250;
    $scope.radiusRawVal = 0.25;
    $scope.sliderLabel = "0.25 km";
    $scope.isMetric = true;

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
    $scope.locationPref = { value: 'Current' };

    $scope.getLocation = function () {
        requestLocation();
    };

    function requestLocation() {
        if ($scope.locationPref.value == "Current") {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            }
        }
        else {
            map.removeLayer($scope.locationOutline);
            $scope.helpRequest.LAT = "";
            $scope.helpRequest.LONG = "";
            $scope.digest();
        }
    }

    function showPosition(position) {
        $scope.helpRequest.LAT = position.coords.latitude;
        $scope.helpRequest.LONG = position.coords.longitude;
        if ($scope.locationOutline !== undefined) {
            map.removeLayer($scope.locationOutline);
        }
        $scope.locationOutline = L.circle([position.coords.latitude, position.coords.longitude], $scope.overlayRadius).addTo(map);
        $scope.$digest();
    }

    $scope.getSelectedUrgency = function () {
        $scope.helpRequest.RequestUrgencyID = $scope.selectedUrgency.RequestUrgencyID;
    };

    $scope.showValue = function () {
        if ($scope.radiusRawVal == 0)
            $scope.radiusRawVal = 0.05;

        if ($scope.isMetric) {
            $scope.overlayRadius = $scope.radiusRawVal * 1000;
            $scope.sliderLabel = $scope.radiusRawVal + " km";
        }
        else {
            $scope.overlayRadius = $scope.radiusRawVal * 1000;
            $scope.sliderLabel = $scope.radiusRawVal + " mi";
        }
        $scope.helpRequest.AreaSize = $scope.sliderLabel;

        if ($scope.locationOutline !== undefined)
            $scope.locationOutline.setRadius($scope.overlayRadius);
    };

    $scope.changeUnits = function () {
        if ($scope.isMetric) {
            $scope.sliderLabel = $scope.radiusRawVal + " km";
            $scope.overlayRadius = $scope.overlayRadius / 0.62137119;
            if ($scope.locationOutline !== undefined)
                $scope.locationOutline.setRadius($scope.overlayRadius);
        }
        else {
            $scope.sliderLabel = $scope.radiusRawVal + " mi";
            $scope.overlayRadius = $scope.overlayRadius * 0.62137119;
            if ($scope.locationOutline !== undefined)
                $scope.locationOutline.setRadius($scope.overlayRadius);
        }
        $scope.helpRequest.AreaSize = $scope.sliderLabel;
    };

    function resetNeedsButtons() {
        $scope.showMedicalNeed = false;
        $scope.showShelterNeed = false;
        $scope.showFoodNeed = false;
        $scope.showWaterNeed = false;
        $scope.showEvacuationNeed = false;
        $scope.showMedicineNeed = false;
        return false;
    }

    $scope.$on("EventDataLoaded", function () {
        $scope.event = $scope.getEvent($scope.eventID);
        loadRequests();
        loadUrgencyList();
        resetNeedsButtons();
        updateMap();
    });

    function buildLocationMarkers() {
        if (!$scope.locations) return;
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
            marker.bindPopup("<strong>" + location.ResourceType.Description + " (" +
				location.ResourceLocation.ResourceRegistry.Organization.Name + ")</strong><br/>" + location.ResourceLocation.PhoneNumber);
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
            $scope.selectedUrgency = $scope.urgencyList[0];
            $scope.helpRequest.RequestUrgencyID = $scope.selectedUrgency.RequestUrgencyID;
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
            if ($scope.locationPref.value == "Other") {
                if ($scope.locationOutline !== undefined) {
                    map.removeLayer($scope.locationOutline);
                }
                $scope.locationOutline = L.circle(e.latlng, $scope.overlayRadius).addTo(map);
                $scope.helpRequest.LAT = e.latlng.lat.toFixed(3);
                $scope.helpRequest.LONG = e.latlng.lng.toFixed(3);
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
        requestLocation();
        return false;
    };

    $scope.toggleNeeds = function () {
        var hasError = false;
        if ($scope.showHelp) {
            if ($scope.locationPref.value == "Other" && ($scope.helpRequest.LAT === undefined || $scope.helpRequest.LAT == "" || $scope.helpRequest.LONG === undefined || $scope.helpRequest.LONG == "")) {
                hasError = true;
            }
            if ($scope.helpRequest.AreaSize === undefined) {
                hasError = true;
            }
            if ($scope.helpRequest.Quantity === undefined || $scope.helpRequest.Quantity == 0) {
                hasError = true;
            }
        }
        if (!hasError) {
            $scope.showHelp = !$scope.showHelp;
            $scope.showNeeds = !$scope.showNeeds;
        }
        else {
            alert("Missing Required Field(s)");
        }
        return false;
    };

    $scope.validateNumber = function (evt) {
        var e = evt || window.event;
        var key = e.keyCode || e.which;

        if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
            // numbers   
        key >= 48 && key <= 57 ||
            // Backspace and Tab and Enter
        key == 8 || key == 9 || key == 13 ||
            // left and right arrows
        key == 37 || key == 39 ||
            // Del and Ins
        key == 46 || key == 45) {
            // input is VALID
            return false;
        }
        else {
            // input is INVALID
            e.returnValue = false;
            if (e.preventDefault) e.preventDefault();
            return true;
        }
        return false;
    };

    $scope.sendNeedRequest = function () {
        var hasError = false;
        if ($scope.showNeeds) {
            if (!$scope.showMedicalNeed && !$scope.showShelterNeed && !$scope.showFoodNeed &&
                !$scope.showMedicineNeed && !$scope.showWaterNeed && !$scope.showEvacuationNeed) {
                hasError = true;
            }
        }
        if (!hasError) {
            $scope.helpRequest.EventID = $scope.eventID;
            var splitString = $scope.helpRequest.AreaSize.split(" ");
            $scope.helpRequest.AreaSize = splitString[0];
            $scope.helpRequest.UnitOfMeasure = splitString[1];
            if ($scope.showMedicalNeed) {
                $scope.helpRequest.ResourceTypeID = '4';
                postNeedRequest();
            }
            if ($scope.showShelterNeed) {
                $scope.helpRequest.ResourceTypeID = '3';
                postNeedRequest();
            }
            if ($scope.showFoodNeed) {
                $scope.helpRequest.ResourceTypeID = '1';
                postNeedRequest();
            }
            if ($scope.showMedicineNeed) {
                $scope.helpRequest.ResourceTypeID = '6';
                postNeedRequest();
            }
            if ($scope.showWaterNeed) {
                $scope.helpRequest.ResourceTypeID = '2';
                postNeedRequest();
            }
            if ($scope.showEvacuationNeed) {
                $scope.helpRequest.ResourceTypeID = '5';
                postNeedRequest();
            }
            resetNeedsButtons();
            map.removeLayer($scope.locationOutline);
            $scope.showNeeds = !$scope.showNeeds;
            $scope.showEventDetails = !$scope.showEventDetails;
        }
        else {
            alert("Specify a Need");
        }
        return false;
    };

    function postNeedRequest() {
        var needRequestData = JSON.stringify($scope.helpRequest);
        var webCall = $http({
            method: 'POST',
            url: '/api/resourcerequest',
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: needRequestData
        });
        webCall.then(function (response) {
            alert("Request successfully submitted");
        },
        function (response) { // optional
            alert("Error: ");
        });
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