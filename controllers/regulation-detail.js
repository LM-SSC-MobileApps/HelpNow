/**
 * RegulationDetailCtrl
 */

angular.module("helpNow").controller("RegulationDetailCtrl", ["$scope", "$resource", "$routeParams", "Regulation", "$location" , function ($scope, $resource, $routeParams, Regulation, $location) {

    $scope.regulationResource = Regulation.get({id: $routeParams.organizationRegulationsID}, function (data) {
        $scope.regulation = data.json;
        $scope.$broadcast("RegulationDataLoaded", {});
    });

    $scope.go = function ( path ) {
        $location.path( path );
    };

}]);
