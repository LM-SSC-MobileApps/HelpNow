angular.module("helpNow").controller("TomnodCtrl", ["$scope", "$location", "$resource", "Event", "$uibModal",
	function ($scope, $location, $resource, Event, $uibModal) {

	    $scope.orgEvents = [];
	    $scope.noEvents = true;

	    $scope.setTitle($scope.text.tomnod_title);
	    $scope.setCurrentView("tomnod");	    

	}]);