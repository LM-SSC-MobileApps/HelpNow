angular.module("helpNow").controller("RootCtrl", function($scope, $http) {
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
		if (language == "Ben")
			$http.get("i18n/text-BEN.json")
				.success(function (data) {
					$scope.text = data;
				})
				.error(function (data) {
					alert(data);
				});
		else {
			$http.get("i18n/text-ENG.json")
				.success(function (data) {
					$scope.text = data;
				})
				.error(function (data) {
					alert(data);
				});
		}	
	}
	
	$scope.getLanguageClass = function(language) {
		return currentLanguage == language ? "active" : "";
	}
	
	$scope.setCurrentLanguage("Eng");
});