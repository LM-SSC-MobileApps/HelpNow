angular.module("helpNow").controller("ForgotPasswordCtrl", ["$scope", "$http", "Account", "$location", "$routeParams", "$resource", function ($scope, $http, Account, $location, $routeParams, $resource) {
    $scope.setCurrentView("forgot_password");
    $scope.setTitle($scope.text.forgot_password_title);

    $scope.emailAddress = '';

    $scope.accountResource = $resource("/api/account/email/:email");

    $scope.loadAccount = function () {
        $scope.accountResource.get({ email: $scope.emailAddress }, function (data) {
            $scope.account = data.json;
            if ($scope.account == null)// || $scope.account[0] == null || $scope.account[0].AccountID <= 0)
                alert("Account could not be found");
            else
                alert(JSON.stringify($scope.account));
        });
    };
}]);