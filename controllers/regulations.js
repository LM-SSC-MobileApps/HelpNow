/**
 * RegulationsCtrl
 */

angular.module("helpNow").controller("RegulationsCtrl", ["$scope", "$resource","$location" , function($scope, $resource,$location) {

$scope.regulationsResource = $resource("api/organizationregulation/account/:accountId",
    {accountId: $scope.currentUser.AccountID} );


    $scope.loadRegulations = function() {
		$scope.regulationsResource.get({}, function(data) {
			$scope.regulations = data.json;
			$scope.$broadcast("RegulationDataLoaded", {});
		});
};



$scope.loadRegulations();

$scope.setCurrentView("regulations");

$scope.$on("RegulationDataLoaded", function() {});

    $scope.go = function ( path ) {
        $location.path( path );
    };



}]);
