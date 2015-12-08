angular.module("helpNow").controller("LoginCtrl", ["$scope", "$location", "$routeParams", "$resource", function($scope, $location, $routeParams, $resource) {
    $scope.setCurrentView("login");

    $scope.validateUser = function () {
        if ($scope.username === undefined || $scope.password === undefined) {
            alert("Missing Username or Password");
        }
        else {
            $scope.usersResource = $resource("/api/account/" + $scope.username + "/" + $scope.password);
            $scope.usersResource.get({}, function (data) {
                $scope.users = data.json;
                $scope.currentUser = $scope.users[0];
                if ($scope.currentUser === undefined) {
                    alert("Incorrect Username/Password combination.\nPlease try again");
                }
                else {
                    $scope.setCurrentUser($scope.currentUser);
                    $scope.$broadcast("CurrentUserLoaded", {});
                    $location.path('#');
                }
            });
        }
    };
}]);