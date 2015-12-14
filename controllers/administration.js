angular.module("helpNow").controller("AdministrationCtrl", ["$scope", "$location", "$resource", function ($scope, $location, $resource) {
    $scope.setTitle("Government & Organization Administration");

    $scope.governmentResource = $resource("/api/organization/type/:id",
			{ id: 1 });
    $scope.organizationResource = $resource("/api/organization/type/:id",
			{ id: 2 });

    $scope.loadGovernments = function () {
        $scope.governmentResource.get({}, function (data) {
            $scope.governmentList = data.json;
            $scope.$broadcast("GovernmentDataLoaded", {});
        });
    };

    $scope.loadOrganizations = function () {
        $scope.organizationResource.get({}, function (data) {
            $scope.organizationList = data.json;
            $scope.$broadcast("OrganizationDataLoaded", {});
        });
    };

    $scope.loadGovernments();
    $scope.loadOrganizations();

    $scope.manage = function (org) {
        $scope.setCurrentOrg(org);
        $location.path('/manage');
    };
}]);