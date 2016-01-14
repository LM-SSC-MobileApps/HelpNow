angular.module("helpNow").controller("OrganizationAddCtrl", ["$scope", "$resource", "$routeParams", "Organization", "$location", function ($scope, $resource, $routeParams, Organization, $location) {

    $scope.orgTypeID = $routeParams.orgTypeID * 1;
    $scope.newOrg = new Organization();
    $scope.newOrg.OrganizationTypeID = $scope.orgTypeID;
    $scope.newOrg.CreateDate = new Date();
    $scope.orgType = $scope.orgTypeID == 1 ? $scope.text.gov_name_label : $scope.text.org_name_label;

    $scope.orgResource = $resource("/api/organization/:id");

    $scope.orgID = $routeParams.orgID * 1;
    if ($scope.orgID == 0) $scope.isNew = true;
    $scope.loadOrg = function () {
        $scope.orgResource.get({ id: $scope.orgID }, function (data) {
            $scope.org = data.json[0];
            if ($scope.org.Name != null) {
                $scope.newOrg.Name = $scope.org.Name;
            }
            if ($scope.org.APISecret != null) {
                $scope.newOrg.APISecret = $scope.org.APISecret;
            }
        });
    };

    function loadOrgAddress() {
        if(!$scope.isNew) $scope.loadOrg();
    }

    loadOrgAddress();

    $scope.setTitle($scope.text.create + " " + $scope.orgType);

    $scope.go = function (path) {
        $location.path(path);
    };

    $scope.addOrg = function (org) {
        if (org.Name === undefined || org.Name == null || org.APISecret === undefined || org.APISecret == null) {
            alert($scope.text.missing_fields_alert);
            return;
        }
        if ($scope.isNew) {
            Organization.save(org).$promise.then(function (response) {
                $location.path('/administration');
            },
            function (response) { // optional
                alert("Error: " + response.data.err);
            });;
        }
        else {
            Organization.update({id: $scope.orgID}, org).$promise.then(function (response) {
                $location.path('/administration');
            },
            function (response) { // optional
                alert("Error: " + response.data.err);
            });;
        }
    };

    $scope.enterAddress = function (org) {
        if (org.Name === undefined || org.Name == null || org.APISecret === undefined || org.APISecret == null) {
            alert($scope.text.missing_fields_alert);
            return;
        }
        Organization.save(org).$promise.then(function (response) {
            var returnedOrg = response.json[0];
            $location.path('/org_address/' + returnedOrg.OrganizationID);
        },
        function (response) { // optional
            alert("Error: " + response.data.err);
        });;;
    };

}]);
