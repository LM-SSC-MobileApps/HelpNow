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
        Organization.save(org).$promise.then(function (response) {
            $location.path('/administration');
        },
        function (response) { // optional
            alert("Error: ");
        });;
    };

    $scope.enterAddress = function (org) {
        Organization.save(org).$promise.then(function (response) {
            var returnedOrg = response.json[0];
            $location.path('/org_address/' + returnedOrg.OrganizationID);
        },
        function (response) { // optional
            alert("Error: ");
        });;;
    };

}]);
