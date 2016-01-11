angular.module("helpNow").controller("AboutCtrl", ["$scope", "$http", "$location", "$routeParams", "$resource", function ($scope, $http, $location, $routeParams, $resource) {
    $scope.setCurrentView("about");
    $scope.setTitle($scope.text.about_title);
}]);