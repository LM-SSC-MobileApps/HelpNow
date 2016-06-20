angular.module("helpNow").controller("PasswordResetCtrl", ["$scope", "$http", "Account", "$location", "$routeParams", "$resource", function ($scope, $http, Account, $location, $routeParams, $resource) {
    $scope.setCurrentView("password_reset");
    $scope.setTitle($scope.text.reset_password_title);

    $scope.accountID = $routeParams.accountID * 1;

    $scope.accountResource = $resource("/api/account/:id");

    loadAccount();

    function loadAccount() {
        $scope.accountResource.get({ id: $scope.accountID }, function (data) {
            $scope.account = data.json;
            if ($scope.account == null)
                alert("Account could not be found");
        });
    }

    $scope.updatePassword = function () {
        if ($scope.newPassword === $scope.confirmedPassword) {
            $scope.account[0].Password = $scope.newPassword;
            Account.update({id: $scope.accountID}, JSON.stringify($scope.account[0])).$promise.then(function (response) {
                $location.path('#');
            },
            function (response) { // optional
                alert("Error: " + response.data.err);
            });
        }
        else {
            alert("Passwords do not match.")
        }
    };
}]);