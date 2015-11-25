angular.module("helpNow").controller("EventListCtrl", ["$scope", "$location", function($scope, $location) {
	var map;
	
	$scope.getMapEventIcon = function(eventType) {
		if (eventType == "Flood") {
			return "style/images/Flood-Circle-Red.png";
		} else if (eventType == "Tsunami") {
			return "style/images/Tsunami-Circle-Red.png";
		} else {
			return "style/images/Earthquake-Circle-Red.png";
		}
	};
	
	function addEventsToMap() {
		if (!map || !$scope.events) return;
		angular.forEach($scope.events, function(event) {
			var eventIcon = L.icon({
				iconUrl: $scope.getMapEventIcon(event.EventType.Description),
				iconSize: [43, 44] 
			}); 
			var marker = L.marker([event.EventLocations[0].LAT, event.EventLocations[0].LONG], { icon: eventIcon });
			marker.on("click", function() {
				$scope.$apply(function() {
					$location.url("event_map/" + event.EventID);
				});
			});
			marker.addTo(map);
		});
	}
	
	$scope.setCurrentView("events");
	
	$scope.$on("EventDataLoaded", function() {
		addEventsToMap();
	});
	
	$scope.initMap = function(newMap) {
		map = newMap;
		addEventsToMap();
	};
}]);