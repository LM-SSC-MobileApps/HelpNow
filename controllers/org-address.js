angular.module("helpNow").controller("OrgAddressCtrl", ["$scope", "$http", "$location", "Organization", "$routeParams", "$resource", function ($scope, $http, $location, Organization, $routeParams, $resource) {
    $scope.setCurrentView("org-address");
    $scope.setTitle("Organization Address");

    $scope.orgID = $routeParams.orgID * 1;
    $scope.loadOrg = function () {
        $scope.Organization.get({}, function (data) {
            $scope.org = data.json;
            alert(JSON.stringify($scope.org));
            $scope.$broadcast("OrgLoaded", {});
        });
    };

    $scope.loadOrg();

    $scope.submitOrgAddress = function () {
        submitPost();
    };

    function submitPost() {
        var orgAddressData = JSON.stringify($scope.orgAddress);
        var webCall = $http({
            method: 'POST',
            url: '/api/address',
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: orgAddressData
        });
        webCall.then(function (response) {
            alert("Address Successfully Submitted");
            $location.path('#');
        },
        function (response) { // optional
            alert("Error: ");
        });
    }

    function appendToOrganization() {
        
        var orgAddressData = JSON.stringify($scope.orgAddress);
        var webCall = $http({
            method: 'POST',
            url: '/api/address',
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: orgAddressData
        });
        webCall.then(function (response) {
            alert(JSON.stringify(response));
            alert("Address Successfully Submitted");
            $location.path('#');
        },
        function (response) { // optional
            alert("Error: ");
        });
    }
}]);