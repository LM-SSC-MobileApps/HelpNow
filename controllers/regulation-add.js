/**
 * RegulationAddCtrl
 */

angular.module("helpNow").controller("RegulationAddCtrl", ["$scope", "$resource", "$routeParams", "Regulation", "$location", function ($scope, $resource, $routeParams, Regulation, $location) {

    $scope.newReg = new Regulation();
    $scope.newReg.OrganizationID = $scope.currentOrg.OrganizationID;


    $scope.go = function (path) {
        $location.path(path);
    };

    $scope.addRegulation = function (regulation) {
        console.log(regulation.Narrative);
        console.log(regulation.Summary);
        Regulation.save(regulation);
        $location.path('/regulations');
    };

}]);
