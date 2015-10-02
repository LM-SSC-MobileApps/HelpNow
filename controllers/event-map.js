angular.module("helpNow").controller("EventMapCtrl", function ($scope, $routeParams) {
    $scope.eventID = $routeParams.eventID * 1;
	$scope.event = $scope.getEvent($scope.eventID);
	$scope.setCurrentView("event-map");
	
	$scope.initMap = function(map) {
		map.on('click', function (e) {
			if (locationOutline != undefined) {
				map.removeLayer(locationOutline);
			}
			locationOutline = L.circle(e.latlng, overlayRadius).addTo(map);
		});
	}
});