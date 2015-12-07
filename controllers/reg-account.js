angular.module("helpNow").controller("RegAccountCtrl", ["$scope", "$http", "$routeParams", "$resource", function ($scope, $http, $routeParams, $resource) {
    $scope.setCurrentView("reg-account");

    $scope.showUsername = true;
    $scope.showUser = false;

    $scope.showUserForm = function () {
        $scope.showUser = true;
        $scope.showUsername = false;
    }

    $scope.showUsernameForm = function () {
        $scope.showUser = false;
        $scope.showUsername = true;
    }
}]);