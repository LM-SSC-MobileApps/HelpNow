var eventLat;
var eventLong;

angular.module("helpNow").controller("OrgEventCtrl", function ($scope, $routeParams) {
    eventLat = $routeParams.lat;
    eventLong = $routeParams.long;
	$scope.setCurrentView("event-map");
	$scope.location = $routeParams.location;
	$scope.eventType = $routeParams.eventType;
	$scope.lat = $routeParams.lat;
	$scope.long = $routeParams.long;
	$scope.eventRadius = $routeParams.eventRadius;
	$scope.eventDate = $routeParams.eventDate.replace(/-/g, "/");
	$scope.eventTime = $routeParams.eventTime;
	$scope.contactPhone = $routeParams.contactPhone;
});

angular.module("helpNow").directive('map', function () {
    return {
        link: function () {
            var baseLayer = L.tileLayer(
              'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                  maxZoom: 18
              }
            );

            var map = new L.map('map', {
                layers: [baseLayer]
            }).setView([eventLat, eventLong], 13);

            L.control.scale().addTo(map);

            map.on('click', function (e) {
                if (locationOutline != undefined) {
                    map.removeLayer(locationOutline);
                }
                locationOutline = L.circle(e.latlng, overlayRadius).addTo(map);
            });
        }
    };
});

