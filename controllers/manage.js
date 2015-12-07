/**
 * ManageCtrl
 */

angular.module("helpNow").controller("ManageCtrl", ["$scope", "$location" , function($scope, $location) {



	$scope.go = function ( path ) {
		$location.path( path );
	};



}]);