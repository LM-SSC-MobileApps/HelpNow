angular.module("helpNow").controller("NewEventCtrl", ["$scope", "$http", "$routeParams", "$resource", function ($scope, $http, $routeParams, $resource) {

    var map;
    var mapLayers = [];

    $scope.setCurrentView("new-event");
    $scope.setTitle($scope.text.new_event_title, "/style/images/New Emergency Event.png");

    $scope.eventTypesResource = $resource("/api/eventtype/");
    $scope.eventTypes = [];

    $scope.newEvent = { EventID: '', AreaSize: '15 km' };

    $scope.overlayRadius = 15000;
    $scope.radiusRawVal = 15;
    $scope.sliderLabel = "15 km";
    $scope.isMetric = true;

    $scope.showEventDetails = true;
    $scope.showContacts = false;

    loadEventTypes();

    function loadEventTypes() {
        $scope.eventTypesResource.get({}, function (data) {
            $scope.eventTypes = data.json;
            $scope.selectedEventType = $scope.eventTypes[0];
            $scope.selectedEventTypeDescription = $scope.selectedEventType.Description;
        });
    }

    $scope.getSelectedEventType = function () {
        $scope.newEvent.EventTypeID = $scope.selectedEventType.EventTypeID;
    };

    $scope.toggleNewEvent = function () {
        var hasError = false;
        if ($scope.showEventDetails) {
            if (($scope.newEvent.LAT === undefined || $scope.newEvent.LAT == "" || $scope.newEvent.LONG === undefined || $scope.newEvent.LONG == "")) {
                hasError = true;
            }
            if ($scope.newEvent.Summary === undefined || $scope.newEvent.Summary == "") {
                hasError = true;
            }
        }
        if (!hasError) {
            $scope.showEventDetails = !$scope.showEventDetails;
            $scope.showContacts = !$scope.showContacts;
        }
        else {
            alert($scope.text.missing_fields_alert);
        }
        return false;
    };

    $scope.submitNewEvent = function () {
        return false;
    };

    $scope.locationPref = { value: 'Other' };

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
            $scope.newEvent.LAT = "";
            $scope.newEvent.LONG = "";
            $scope.digest();
        }
    }

    function showPosition(position) {
        $scope.newEvent.LAT = position.coords.latitude;
        $scope.newEvent.LONG = position.coords.longitude;
        if ($scope.locationOutline !== undefined) {
            map.removeLayer($scope.locationOutline);
        }
        $scope.locationOutline = L.circle([position.coords.latitude, position.coords.longitude], $scope.overlayRadius, { color: "#00ff00", opacity: 1, fillOpacity: 0.7 }).addTo(map);
        $scope.$digest();
    }

    $scope.centerMapToLongLat = function (lat, long) {
        if (!map) return;
        map.setZoom(13);
        map.panTo(new L.LatLng(lat, long));
    };

    $scope.showValue = function () {
        if ($scope.radiusRawVal == 0)
            $scope.radiusRawVal = 5;

        if ($scope.isMetric) {
            $scope.overlayRadius = $scope.radiusRawVal * 1000;
            $scope.sliderLabel = $scope.radiusRawVal + " km";
        }
        else {
            $scope.overlayRadius = $scope.radiusRawVal * 1000;
            $scope.sliderLabel = $scope.radiusRawVal + " mi";
        }
        $scope.newEvent.AreaSize = $scope.sliderLabel;

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
        $scope.newEvent.AreaSize = $scope.sliderLabel;
    };

    function updateMap() {
        if (!map || !$scope.events) return;

        for (var i = 0; i < mapLayers.length; i++) {
            var layer = mapLayers[i];
            map.removeLayer(layer);
        }

        mapLayers = [];

        if ($scope.showLocationMarkers)
            $scope.buildLocationMarkers($scope.locations, mapLayers, $scope.filterFlags);

        angular.forEach(mapLayers, function (layer) {
            map.addLayer(layer);
        });
    }

    $scope.initMap = function (newMap) {
        map = newMap;
        map.on('click', function (e) {
            if ($scope.locationPref.value == "Other") {
                if ($scope.locationOutline !== undefined) {
                    map.removeLayer($scope.locationOutline);
                }
                $scope.locationOutline = L.circle(e.latlng, $scope.overlayRadius, { color: "#00ff00", opacity: 1, fillOpacity: 0.7 }).addTo(map);
                $scope.newEvent.LAT = e.latlng.lat.toFixed(3);
                $scope.newEvent.LONG = e.latlng.lng.toFixed(3);
                $scope.$digest();
            }
        });
        updateMap();
    };
}]);