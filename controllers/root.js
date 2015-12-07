angular.module("helpNow").controller("RootCtrl", ["$scope", "$http", "$resource", function($scope, $http, $resource) {
	var currentLanguage = "Eng";
	var currentView = "";
	
	$scope.eventsResource = $resource("/api/event");
	
	$scope.loadEvents = function() {
		$scope.eventsResource.get({}, function(data) {
			$scope.events = data.json;
			$scope.$broadcast("EventDataLoaded", {});
		});
	}; 
	
	$scope.getEventIcon = function(eventType) {
		if (eventType == "Flood") {
			return "style/images/Flood.png";
		} else if (eventType == "Tsunami") {
			return "style/images/Tsunami.png";
		} else {
			return "style/images/Earthquake.png";
		}
	};
	
	$scope.getMenuClass = function(viewName) {
		return viewName == currentView ? "active" : "";
	};
	
	$scope.setCurrentView = function (viewName) {
		currentView = viewName;
	};
	
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
	};
	
	$scope.getLanguageClass = function(language) {
		return currentLanguage == language ? "active" : "";
	};
	
	$scope.setCurrentLanguage("Eng");

	$scope.getResourcesForEvent = function (eventID) {
	    var resources = [];
	    for (var i = 0; i < $scope.resources.length; i++) {
	        var resource = $scope.resources[i];
	        if (resource.eventID == eventID) resources.push(resource);
	    }
	    if (resources.length > 0) return resources;
	    return {};
	};
	
	$scope.getEvent = function(eventID) {
		for (var i = 0; i < $scope.events.length; i++) {
			var event = $scope.events[i];
			if (event.EventID == eventID) return event;
		}
		return {}; 
	};
	
	$scope.getLocationIcon = function(resourceType) {
		if (resourceType == "Water") {
			return "style/images/Water-Diamond-Blue.png";
		} else if (resourceType == "First Aid") {
			return "style/images/First Aid-Diamond-Blue.png";
		} else if (resourceType == "Shelter") {
			return "style/images/Shelter-Diamond-Blue.png";
		} else if (resourceType == "Evacuation") {
			return "style/images/Evacuation-Diamond-Blue.png";
		} else if (resourceType == "Medicine") {
			return "style/images/Medicine-Diamond-Blue.png";
		} else {
			return "style/images/Food-Diamond-Blue.png";
		}
	}
	
	$scope.loadEvents();


	/* Hard coded until we figure out authentication */
	$scope.usersResource = $resource("/api/account/7");

	$scope.loadCurrentUser = function() {
		$scope.usersResource.get({}, function(data) {
			$scope.users = data.json;
			$scope.currentUser = $scope.users[0];
			$scope.$broadcast("CurrentUserLoaded", {});
		});
	};

	$scope.loadCurrentUser();


	//TODO: Fix undefined error on currentUser. http://stackoverflow.com/questions/23848127/how-can-i-overcome-race-conditions-within-directives-without-a-timeout-function
	//console.log("Current User" + $scope.currentUser.AccountID);  //get undefined
	//$scope.orgAccountResource = $resource("api/organization/account/:accountId", {{accountId: $scope.currentUser.AccountID} );
	$scope.orgAccountResource = $resource("api/organization/account/:accountId", {accountId: 7} );

	$scope.loadCurrentOrg = function() {
		$scope.orgAccountResource.get({}, function(data){
			$scope.orgs = data.json;
			$scope.org = $scope.orgs[0];
			$scope.currentOrg = $scope.org[0];
			$scope.$broadcast("CurrentOrgLoaded", {});
		});
	};

	$scope.loadCurrentOrg();


	$scope.resources = [
        {
            id: 1,
            eventID: 1,
            resourceType: "First Aid",
            lat: 23.718,
            long: 90.355,
            provider: "NGO #1",
            message: ""
        },
        {
            id: 2,
            eventID: 1,
            resourceType: "First Aid",
            lat: 23.719,
            long: 90.374,
            provider: "NGO #2",
            message: ""
        },
        {
            id: 3,
            eventID: 1,
            resourceType: "First Aid",
            lat: 23.765,
            long: 90.398,
            provider: "NGO #3",
            message: ""
        },
        {
            id: 4,
            eventID: 1,
            resourceType: "Water",
            lat: 23.767,
            long: 90.41,
            provider: "NGO #4",
            message: ""
        },
        {
            id: 5,
            eventID: 1,
            resourceType: "Evacuation Site",
            lat: 23.73,
            long: 90.365,
            provider: "",
            message: "No more than 1 bag per person.  Only bring what you can carry."
        },
        {
            id: 6,
            eventID: 1,
            resourceType: "Evacuation Site",
            lat: 23.75,
            long: 90.43,
            provider: "",
            message: "No more than 1 bag per person.  Only bring what you can carry."
        }
	];
	
	var testEvents = [
		{
			id: 1,
			location: "Dhaka, Bangladesh",
			eventType: "Flood",
			lat: 23.74,
			long: 90.39,
			eventRadius: "542 km",
			eventDate: "9/23/2015",
			eventTime: "4:36 PM",
			contactPhone: "+880 2 555 5555",
		    iconPath: "style/images/icons/FloodIcon.png"
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
			contactPhone: "+880 2 555 5555",
			iconPath: "style/images/icons/TsunamiIcon.png"

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
			contactPhone: "+880 2 555 5555",
			iconPath: "style/images/icons/EarthquakeIcon.png"
		}
	];
}]);