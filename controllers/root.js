angular.module("helpNow").controller("RootCtrl", function($scope) {
	var currentView = "events";
	var currentLanguage = "Eng";
	
	$scope.getMenuClass = function(viewName) {
		return viewName == currentView ? "active" : "";
	}
	
	$scope.setCurrentView = function(viewName) {
		currentView = viewName;
	}
	
	$scope.setCurrentLanguage = function(language) {
		currentLanguage = language;
	}
	
	$scope.getLanguageClass = function(language) {
		return currentLanguage == language ? "active" : "";
	}
});