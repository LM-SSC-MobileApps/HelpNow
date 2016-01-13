angular.module("helpNow").controller("OrgAddressCtrl", ["$scope", "$http", "$location", "Organization", "$routeParams", "$resource", function ($scope, $http, $location, Organization, $routeParams, $resource) {
    $scope.setCurrentView("org-address");
    $scope.setTitle($scope.text.address_title);

    $scope.addressResource = $resource("/api/address/:id");
    $scope.orgResource = $resource("/api/organization/:id");

    $scope.orgID = $routeParams.orgID * 1;
    $scope.loadOrg = function () {
        $scope.orgResource.get({ id: $scope.orgID}, function (data) {
            $scope.org = data.json[0];
            $scope.loadAddress();
        });
    };

    $scope.loadAddress = function () {
        if ($scope.org.AddressID) {
            $scope.addressResource.get({ id: $scope.org.AddressID }, function (data) {
                $scope.orgAddress = data.json[0];
                if (data.json[0]) {
                    $scope.hasAddress = true;
                }
            });
        }
    };

    function loadOrgAddress() {
        $scope.loadOrg();
    }

    loadOrgAddress();

    $scope.submitOrgAddress = function () {
        if ($scope.hasAddress) {
            updateAddress();
        }
        else {
            submitPost();
        }
    };

    function updateAddress() {
        var orgAddressData = JSON.stringify($scope.orgAddress);
        var webCall = $http({
            method: 'PUT',
            url: '/api/address/' + $scope.org.AddressID,
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
            alert(JSON.stringify(response));
        });
    }

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
            appendToOrganization(response.data.json.AddressID);
        },
        function (response) { // optional
            alert("Error: ");
        });
    }

    function appendToOrganization(addressID) {
        alert(JSON.stringify($scope.org));
        $scope.org.AddressID = addressID;
        var orgAddressData = JSON.stringify($scope.org);
        alert(orgAddressData);
        var webCall = $http({
            method: 'PUT',
            url: '/api/organization/' + $scope.org.OrganizationID,
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: orgAddressData
        });
        webCall.then(function (response) {
            alert(JSON.stringify(response));
            $location.path('#/manage');
        },
        function (response) { // optional
            alert(JSON.stringify(response));
        });
    }
}]);