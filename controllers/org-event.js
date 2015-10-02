angular.module("helpNow").controller("OrgEventCtrl", function ($scope, $routeParams) {
    $scope.eventID = $routeParams.eventID * 1;
	$scope.event = $scope.getEvent($scope.eventID);
	$scope.showMedical = true;
	$scope.showShelter = true;
	$scope.showFood = true;
	$scope.showWater = true;
	
	$scope.toggleButtonClass = function(id) {
		var status = $scope[id];
		return status ? "btn btn-toggle active" : "btn btn-toggle";
	}
	
	$scope.toggleButton = function(id) {
		$scope[id] = !$scope[id];
		return false;
	}
	
	$scope.setCurrentView("org-event");
});

