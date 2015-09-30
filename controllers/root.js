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
	
	$scope.getEvent = function(eventID) {
		for (var i = 0; i < $scope.events.length; i++) {
			var event = $scope.events[i];
			if (event.id == eventID) return event;
		}
		return {};
	}
	
	$scope.events = [
		{
			id: 1,
			location: "Dhaka, Bangladesh",
			eventType: "Flood",
			lat: 23.713,
			long: 90.39,
			eventRadius: "542 km",
			eventDate: "9/23/2015",
			eventTime: "4:36 PM",
			contactPhone: "+880 2 555 5555"
		},
		{
			id: 2,
			location: "Port Moresby, Papua New Guinea",
			eventType: "Tsunami",
			lat: -9.46,
			long: 147.18,
			eventRadius: "1024 km",
			eventDate: "9/24/2015",
			eventTime: "2:16 PM",
			contactPhone: "+880 2 555 5555"
		},
		{
			id: 3,
			location: "Tacna, Peru",
			eventType: "Earthquake",
			lat: -18.04,
			long: -70.174,
			eventRadius: "860 km",
			eventDate: "9/25/2015",
			eventTime: "1:06 PM",
			contactPhone: "+880 2 555 5555"
		}
	]
});