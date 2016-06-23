angular.module("helpNow").controller("ForgotPasswordCtrl", ["$scope", "$http", "Account", "$location", "$routeParams", "$resource", function ($scope, $http, Account, $location, $routeParams, $resource) {
    $scope.setCurrentView("forgot_password");
    $scope.setTitle($scope.text.forgot_password_title);

    $scope.emailAddress = '';

    $scope.accountResource = $resource("/api/inviterequest/passwordreset");

    $scope.sendEmail = function () {
        var postdata = 'Email=' + $scope.emailAddress;
        var webCall = $http({
            method: 'POST',
            url: '/api/inviterequest/passwordreset',
            async: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: postdata
        });

        webCall.then(function (response) {
            if (response.data.json == true) {
                $location.path('#');
            }
            else {
                alert("Error: " + response.data.err);
            }
        });
    };
}]);