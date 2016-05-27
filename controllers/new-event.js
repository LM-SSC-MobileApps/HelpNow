angular.module("helpNow").controller("NewEventCtrl", ["$scope", "$http", "$location", "$routeParams", "$resource", function ($scope, $http, $location, $routeParams, $resource) {

    var map;
    var mapLayers = [];

    $scope.setCurrentView("new-event");
    $scope.setTitle($scope.text.new_event_title, "/style/images/New Emergency Event.png");

    var existingEvent = false;

    $scope.eventID = $routeParams.eventID * 1;
    if ($scope.events && $scope.eventID > 0) {
        existingEvent = true;
        $scope.existingEvent = $scope.getEvent($scope.eventID);
        $scope.newEvent = $scope.existingEvent;
        $scope.newEvent.LAT = $scope.existingEvent.EventLocations[0].LAT;
        $scope.newEvent.LONG = $scope.existingEvent.EventLocations[0].LONG;
        $scope.radiusRawVal = $scope.newEvent.EventLocations[0].Radius;
        $scope.overlayRadius = $scope.newEvent.EventLocations[0].Radius * 1000;
        $scope.sliderLabel = $scope.radiusRawVal + " km";
        $scope.selectedEvent = { selectedEventTypeID: $scope.newEvent.EventTypeID };
        $scope.selectedEvent.selectedEventType = $scope.newEvent.EventType;
        $scope.selectedEvent.selectedEventTypeDescription = $scope.newEvent.EventType.Description;
        $scope.locationData = $scope.newEvent.EventLocations[0];
        //$scope.locationOutline = L.circle([$scope.newEvent.LAT, $scope.newEvent.LONG], $scope.overlayRadius, { color: "#00ff00", opacity: 1, fillOpacity: 0.7 }).addTo(map);
    }
    else {
        existingEvent = false;
        $scope.newEvent = { Notes: '', Keywords: '', OrganizationID: $scope.currentOrg.OrganizationID, Active: '1', AreaSize: '15 km' };
        $scope.overlayRadius = 15000;
        $scope.radiusRawVal = 15;
        $scope.sliderLabel = "15 km";
        $scope.selectedEvent = { selectedEventTypeID: '1' };
        $scope.locationData = { Radius: '' };
    }

    $scope.eventTypesResource = $resource("/api/eventtype/");
    $scope.eventTypes = [];
    
    $scope.isMetric = true;

    $scope.showEventDetails = true;
    $scope.showContacts = false;

    loadEventTypes();

    function loadEventTypes() {
        $scope.eventTypesResource.get({}, function (data) {
            $scope.eventTypes = data.json;
            $scope.selectedEvent.selectedEventType = $scope.eventTypes[$scope.selectedEvent.selectedEventTypeID - 1];
            $scope.selectedEvent.selectedEventTypeDescription = $scope.selectedEvent.selectedEventType.Description;
            $scope.getSelectedEventType();
        });
    }

    $scope.getSelectedEventType = function () {
        $scope.newEvent.EventTypeID = $scope.selectedEvent.selectedEventType.EventTypeID;
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

    $scope.postNewEvent = function () {
        var newEventData = JSON.stringify($scope.newEvent);
        var webCall = $http({
            method: 'POST',
            url: '/api/event',
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: newEventData
        });
        webCall.then(function (response) {
            $scope.locationData.EventID = response.data.json.EventID;
            //alert("Request successfully submitted");
        },
        function (response) { // optional
            alert("Error: " + response.data.err);
            $scope.hasSubmissionError = true;
        });
        webCall.finally(function (data) {
            if ($scope.locationData.EventID !== undefined && $scope.locationData.EventID != '') {
                $scope.postEventLocation();
            }
        });
    }

    $scope.updateNewEvent = function () {
        var newEventData = JSON.stringify($scope.newEvent);
        var webCall = $http({
            method: 'PUT',
            url: '/api/event/' + $scope.newEvent.EventID,
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: newEventData
        });
        webCall.then(function (response) {
            //$scope.locationData.EventID = $scope.newEvent.EventID;
            //alert("Request successfully submitted");
        },
        function (response) { // optional
            alert("Error: " + response.data.err);
            $scope.hasSubmissionError = true;
        });
        webCall.finally(function (data) {
            if ($scope.locationData.EventID !== undefined && $scope.locationData.EventID != '') {
                $scope.updateEventLocation();
            }
        });
    }

    $scope.postEventLocation = function () {
        var splitString = $scope.newEvent.AreaSize.split(" ");
        $scope.locationData.Radius = splitString[0];
        $scope.locationData.LAT = $scope.newEvent.LAT;
        $scope.locationData.LONG = $scope.newEvent.LONG;
        $scope.locationData.Description = $scope.newEvent.Summary;
        var locationData = JSON.stringify($scope.locationData);
        var webCall = $http({
            method: 'POST',
            url: '/api/eventlocation',
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: locationData
        });
        webCall.then(function (response) {
            //alert("Request successfully submitted");
            $location.path("#");
            $scope.loadEvents();
        },
        function (response) { // optional
            alert("Error: " + response.data.err);
            $scope.hasSubmissionError = true;
        });
    };

    $scope.updateEventLocation = function () {
        var splitString = $scope.newEvent.AreaSize.split(" ");
        $scope.locationData.Radius = splitString[0];
        $scope.locationData.LAT = $scope.newEvent.LAT;
        $scope.locationData.LONG = $scope.newEvent.LONG;
        $scope.locationData.Description = $scope.newEvent.Summary;
        var locationData = JSON.stringify($scope.locationData);
        var webCall = $http({
            method: 'PUT',
            url: '/api/eventlocation/' + $scope.locationData.EventLocationID,
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: locationData
        });
        webCall.then(function (response) {
            //alert("Request successfully submitted");
            $location.path("#");
            $scope.loadEvents();
        },
        function (response) { // optional
            alert("Error: " + response.data.err);
            $scope.hasSubmissionError = true;
        });
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
            $scope.$digest();
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
            $scope.radiusRawVal = 15;

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
        addOverlay();
    };

    function addOverlay() {
        if ($scope.eventID > 0 && map) {
            $scope.locationOutline = L.circle([$scope.newEvent.LAT, $scope.newEvent.LONG], $scope.overlayRadius, { color: "#00ff00", opacity: 1, fillOpacity: 0.7 }).addTo(map);
        }
    }
}]);