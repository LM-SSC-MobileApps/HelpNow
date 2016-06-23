angular.module("helpNow").controller("UpdateAccountCtrl", ["$scope", "$http", "Account", "$location", "$routeParams", "$resource", function ($scope, $http, Account, $location, $routeParams, $resource) {
    $scope.setCurrentView("update_account");
    $scope.setTitle($scope.text.update_contact_info);

    $scope.accountID = $routeParams.accountID * 1;

    $scope.accountResource = $resource("/api/account/:id");

    loadAccount();

    function loadAccount() {
        $scope.accountResource.get({ id: $scope.accountID }, function (data) {
            $scope.userAccount = data.json[0];
            if ($scope.userAccount == null)
                alert("Account could not be found");
        });
    }

    $scope.updateAccountInfo = function () {
        var hasError = false;
        if ($scope.userAccount.FirstName === undefined || $scope.userAccount.LastName === undefined || $scope.userAccount.Email === undefined) {
            alert($scope.text.missing_fields_alert);
            hasError = true;
        }
        if (!hasError) {
            Account.update({ id: $scope.accountID }, JSON.stringify($scope.userAccount)).$promise.then(function (response) {
                $location.path('#');
            },
            function (response) { // optional
                alert("Error: " + response.data.err);
            });
        }
    };
}]);