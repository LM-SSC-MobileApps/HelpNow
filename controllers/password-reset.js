angular.module("helpNow").controller("PasswordResetCtrl", ["$scope", "$http", "Account", "$location", "$routeParams", "$resource", function ($scope, $http, Account, $location, $routeParams, $resource) {
    $scope.setCurrentView("password_reset");
    $scope.setTitle($scope.text.reset_password_title);

    $scope.accountID = $routeParams.accountID * 1;
    $scope.guid = $routeParams.guid;

    $scope.showOldPasswordField = $scope.guid == 0 ? true : false;

    $scope.accountResource = $resource("/api/account/:id");
    $scope.inviteRequestResource = $resource("/api/inviterequest/passwordupdate/");

    if ($scope.guid == 0) loadAccount();

    function loadAccount() {
        $scope.accountResource.get({ id: $scope.accountID }, function (data) {
            $scope.account = data.json;
            if ($scope.account == null)
                alert("Account could not be found");
        });
    }

    $scope.updatePassword = function () {
        if ($scope.newPassword === $scope.confirmedPassword) {
            if ($scope.guid == 0) {
                $scope.account[0].Password = $scope.newPassword;
                Account.update({ id: $scope.accountID }, JSON.stringify($scope.account[0])).$promise.then(function (response) {
                    $location.path('#');
                },
                function (response) { // optional
                    alert("Error: " + response.data.err);
                });
            }
            else {
                var postdata = 'Password=' + $scope.newPassword + '&' + 'InviteRequestID=' + $scope.guid;
                var webCall = $http({
                    method: 'POST',
                    url: '/api/inviterequest/passwordupdate',
                    async: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: postdata
                });

                webCall.then(function (response) {
                    if (response.data.json != false) {
                        $location.path('#');
                    }
                    else {
                        alert("Error: " + response.data.err);
                    }
                });
            }
        }
        else {
            alert("Passwords do not match.")
        }
    };
}]);