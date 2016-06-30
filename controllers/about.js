angular.module("helpNow").controller("AboutCtrl", ["$scope", "$http", "$location", "$routeParams", "$resource", function ($scope, $http, $location, $routeParams, $resource) {
    $scope.setCurrentView("about");
    $scope.setTitle($scope.text.about_page_main_header);

    $scope.getCurrentLanguage();
    if ($scope.currentLanguage == 'Eng') $scope.isEnglish = true;
}]);