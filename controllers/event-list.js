angular.module("helpNow").controller("EventListCtrl", function($scope) {
	var map;
	
	function addEventsToMap() {
		if (!map || !$scope.events) return;
		angular.forEach($scope.events, function(event) {
			var eventIcon = L.icon({
				iconUrl: $scope.getIcon(event.EventType.Description),
				iconSize: [43, 44]
			}); 
			L.marker([event.EventLocations[0].LAT, event.EventLocations[0].LONG], { icon: eventIcon }).addTo(map)
		})
	}
	
	$scope.setCurrentView("events");
	
	$scope.$on("EventDataLoaded", function() {
		addEventsToMap()
	});
	
	$scope.initMap = function(newMap) {
		map = newMap;
		addEventsToMap();
	}
});