/**
 * ManageCtrl
 */

angular.module("helpNow").controller("ManageCtrl", ["$scope", "$location" , function($scope, $location) {

    $scope.setTitle("Organization Management");

	$scope.go = function ( path ) {
		$location.path( path );
	};



}]);