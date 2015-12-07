/**
 * TeamInviteCtrl
 */

angular.module("helpNow").controller("TeamInviteCtrl", ["$scope", "$resource", "$routeParams", "$location", function ($scope, $resource, $routeParams, $location) {


    $scope.go = function (path) {
        $location.path(path);
    };


}]);