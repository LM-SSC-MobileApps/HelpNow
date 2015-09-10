angular.module("helpNow").controller("EventMapCtrl", function($scope, $routeParams) {
	$scope.setCurrentView("event-map");
	$scope.eventID = $routeParams.eventID;
});