angular.module("helpNow").controller("TomnodCtrl", ["$scope", "$location", "$resource", "Event", "$uibModal",
	function ($scope, $location, $resource, Event, $uibModal) {

	    $scope.orgEvents = [];
	    $scope.noEvents = true;

	    $scope.setTitle($scope.text.tomnod_title);
	    $scope.setCurrentView("manage_events");

	    //alert("data = " + JSON.stringify($scope.events));

	    $.each($scope.events, function(i, option) {
	        $('#event').append($('<option/>').attr("value", option.EventID).text(option.EventType.Description + " " + option.Summary + " (" + option.EventLocations[0].LAT + ", " + option.EventLocations[0].LONG + ", " + option.EventLocations[0].Radius + " km2)"));
	    });
	}]);