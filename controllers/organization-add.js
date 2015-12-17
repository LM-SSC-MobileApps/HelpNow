angular.module("helpNow").controller("OrganizationAddCtrl", ["$scope", "$resource", "$routeParams", "Organization", "$location", function ($scope, $resource, $routeParams, Organization, $location) {

    $scope.orgTypeID = $routeParams.orgTypeID * 1;
    $scope.newOrg = new Organization();
    $scope.newOrg.OrganizationTypeID = $scope.orgTypeID;
    $scope.orgType = $scope.orgTypeID == 1 ? "Government" : "Organization";

    $scope.setTitle("Create " + $scope.orgType);

    $scope.go = function (path) {
        $location.path(path);
    };

    $scope.addOrg = function (org) {
        Organization.save(org);
        $location.path('/administration');
    };

    $scope.enterAddress = function (org) {
        //Organization.save(org);
        $location.path('/org_address/' + org.OrganizationID);
    };

}]);
