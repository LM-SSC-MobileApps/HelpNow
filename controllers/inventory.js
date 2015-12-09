angular.module("helpNow").controller("InventoryCtrl", ["$scope", "$http", "$routeParams", "$resource", function ($scope, $http, $routeParams, $resource) {

    var map;
    var mapLayers = [];

    $scope.setCurrentView("inventory");

    $scope.requestsResource = $resource("/api/event/mapitems/");
    $scope.resourceLocation = $resource("/api/resourcelocation");

    $scope.eventID = $routeParams.eventID * 1;
    alert($scope.eventID);
    if ($scope.events) {
        $scope.event = $scope.getEvent($scope.eventID);
        loadResourceLocations();
    }

    $scope.userOrgID = 1;

    $scope.overlayRadius = 250;
    $scope.radiusRawVal = 0.25;
    $scope.sliderLabel = "0.25 km";
    $scope.isMetric = true;

    $scope.showResourceLocations = true;
    $scope.showNewForm = false;
    $scope.showTransportationOptions = false;

    $scope.showAir = false;
    $scope.showGround = false;
    $scope.showWater = false;

    $scope.$on("EventDataLoaded", function () {
        $scope.event = $scope.getEvent($scope.eventID);
        loadResourceLocations();
        //loadRequests();
        resetNeedsButtons();
        updateMap();
    });

    function updateMap() {
        if (!map || !$scope.resourceLocations) return;

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

    function loadResourceLocations() {
        $scope.resourceLocation.get({}, function (data) {
            $scope.resourceLocations = data.json;
            var filteredResourceLocations = $scope.resourceLocations.filter(function (resLocation) {
                return resLocation.OrganizationID == $scope.userOrgID;
            });
            $scope.resourceLocations = filteredResourceLocations;
        });
    }

    //function loadRequests() {
    //    $scope.requestsResource.get({ eventID: $scope.eventID }, function (data) {
    //        $scope.requests = data.json.requests;
    //        $scope.locations = data.json.locations;
    //        updateMap();
    //    });
    //}

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

    $scope.toggleTransportClass = function (id) {
        var status = $scope[id];
        return status ? "btn btn-toggle active" : "btn btn-toggle";
    };

    $scope.toggleTransport = function (id) {
        $scope[id] = !$scope[id];
        return false;
    };

    $scope.showNewSiteForm = function () {
        $scope.showNewForm = !$scope.showNewForm;
        $scope.showResourceLocations = !$scope.showResourceLocations;
        return false;
    };

    $scope.showTransportation = function () {
        $scope.showTransportationOptions = !$scope.showTransportationOptions;
        $scope.showNewForm = !$scope.showNewForm;
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
}]);