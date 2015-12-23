angular.module("helpNow").controller("LoginCtrl", ["$scope", "$http", "$location", "$routeParams", "$resource", function ($scope, $http, $location, $routeParams, $resource) {
    $scope.setCurrentView("login");
    $scope.setTitle("Login");

    $scope.validateUser = function () {
        if ($scope.userCreds.username === undefined || $scope.userCreds.password === undefined) {
            alert("Missing Username or Password");
        }
        else {
            login();
        }
    };

    function login() {
        var postdata = 'username=' + $scope.userCreds.username + '&' + 'password=' + $scope.userCreds.password;

        var webCall = $http({
            method: 'POST',
            url: '/auth/login',
            async: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: postdata
        });

        webCall.then(function (response) {
            $scope.users = response.data.json;
            $scope.currentUser = $scope.users[0];
            if ($scope.currentUser === undefined) {
                alert("Incorrect username or password. Please try again.");
            }
            else {
                var userSessionObject = {
                    AccountID: $scope.currentUser.AccountID,
                    FirstName: $scope.currentUser.FirstName,
                    LastName: $scope.currentUser.LastName,
                    OrganizationID: $scope.currentUser.Organization.OrganizationID,
                    OrganizationName: $scope.currentUser.Organization.Name
                };
                $scope.setCurrentUser(userSessionObject);
                $scope.setCurrentOrg($scope.currentUser.Organization);
                sessionStorage.setItem("user", JSON.stringify(userSessionObject));
                $scope.$broadcast("CurrentUserLoaded", {});
                $location.path('#');
            }
        },
        function (response) { // optional
            alert("Incorrect username or password. Please try again.");
        });
    }    
}]);