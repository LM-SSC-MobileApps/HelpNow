var eventLat;
var eventLong;

angular.module("helpNow").controller("EventMapCtrl", function ($scope, $routeParams) {
    $scope.eventID = $routeParams.eventID * 1;
	$scope.event = $scope.getEvent($scope.eventID);
	eventLat = $scope.event.lat;
    eventLong = $scope.event.long;
	$scope.setCurrentView("event-map");
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

