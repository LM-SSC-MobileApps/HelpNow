angular.module("helpNow").controller("LoginCtrl", ["$scope", "$location", "$routeParams", "$resource", function($scope, $location, $routeParams, $resource) {
    $scope.setCurrentView("login");

    $scope.validateUser = function () {
        if ($scope.userCreds.username === undefined || $scope.userCreds.password === undefined) {
            alert("Missing Username or Password");
        }
        else {
            login();
        }
    };

    function login() {
        var creds = JSON.stringify($scope.userCreds);
        alert(creds);
        var webCall = $http({
            method: 'POST',
            url: '/api/account/login',
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: creds
        });
        webCall.then(function (response) {
            alert("Success");
                $scope.users = response.json;
                $scope.currentUser = $scope.users[0];
                if ($scope.currentUser === undefined) {
                    alert("Incorrect Username/Password combination.\nPlease try again");
                }
                else {
                    $scope.setCurrentUser($scope.currentUser);
                    $scope.$broadcast("CurrentUserLoaded", {});
                    $location.path('#');
                }
        },
        function (response) { // optional
            alert("Error: ");
        });
    }
}]);