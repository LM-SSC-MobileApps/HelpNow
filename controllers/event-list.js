angular.module("helpNow").controller("EventListCtrl", function($scope) {
	var map;
	
	$scope.setCurrentView("events");
	
	$scope.$on("EventDataLoaded", function() {});
	
	$scope.initMap = function(newMap) {
		map = newMap;
	}
});