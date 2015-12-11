angular.module("helpNow").controller("RootCtrl", ["$scope", "$location", "$http", "$resource", function($scope, $location, $http, $resource) {
	var currentLanguage = "Eng";
	var currentView = "";
	
	$scope.eventsResource = $resource("/api/event");
	$scope.currentUser = JSON.parse(sessionStorage.getItem("user"));
	$scope.currentOrg = JSON.parse(sessionStorage.getItem("user"));

	$scope.title = "Worldwide Events";
	
	$scope.loadEvents = function() {
		$scope.eventsResource.get({}, function(data) {
			$scope.events = data.json;
			$scope.$broadcast("EventDataLoaded", {});
		});
	}; 
	
	$scope.getEventIcon = function(eventType) {
		if (eventType == "Flood") {
			return "style/images/flood.png";
		} else if (eventType == "Tsunami") {
			return "style/images/Tsunami.png";
		} else {
			return "style/images/earthquake.png";
		}
	};
	
	$scope.getMenuClass = function(viewName) {
		return viewName == currentView ? "active" : "";
	};
	
	$scope.setCurrentView = function (viewName) {
		currentView = viewName;
	};

	$scope.setTitle = function (title, img) {
	    $scope.title = title;
	    $scope.imageSrc = img;
	};

	$scope.setCurrentUser = function (user) {
	    $scope.currentUser = user;
	};

	$scope.setCurrentOrg = function (org) {
	    $scope.currentOrg = org;
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

	$scope.getLocationIcon = function (location) {
	    var inventories = location.ResourceLocationInventories;
	    if (inventories.length > 1)
	        return "style/images/resources.png";

	    var resourceType = inventories[0].ResourceType.Description;
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
	};
	
	$scope.buildLocationDetails = function(location) {
		var popupText = "<strong>" + location.Organization.Name + "</strong><br/>" + 
			location.PrimaryPOCPhone + "<hr/>";
		location.ResourceLocationInventories.forEach(function(inventory) {
			popupText += inventory.ResourceType.Description + ": " + inventory.Quantity + " " + 
				inventory.ResourceTypeUnitOfMeasure.Description + "<br/>";
		});
		return popupText;
	}
	
	$scope.buildLocationMarker = function(location, icon) {
		var marker = L.marker([location.LAT, location.LONG], { icon: icon });
		marker.bindPopup($scope.buildLocationDetails(location));
		return marker;
	}
	
	$scope.buildLocationMarkers = function(locations, mapLayers, flags) {
		if (!locations) return;
		var selectedLocations = locations.filter(function(location) {
			return $scope.shouldDisplayLocationMarker(location, flags);
		});
		
		angular.forEach(selectedLocations, function(location) {
			var locationIcon = L.icon({
				iconUrl: $scope.getLocationIcon(location),
				iconSize: [60, 60],
				iconAnchor: [30, 30]
			}); 
			
			var marker = $scope.buildLocationMarker(location, locationIcon);
			mapLayers.push(marker);
		});
	}
	
	$scope.shouldDisplayMarker = function(type, flags) {
		return (type == "Water" && flags.showWater) || 
				(type == "Shelter" && flags.showShelter) || 
				(type == "Food" && flags.showFood) || 
				(type == "Evacuation" && flags.showEvacuation) || 
				(type == "First Aid" && flags.showMedical) || 
				(type == "Medicine" && flags.showMedicine);
	}
	
	$scope.shouldDisplayLocationMarker = function(location, flags) {
		var inventories = location.ResourceLocationInventories;
		for (var i = 0; i < inventories.length; i++) {
			if ($scope.shouldDisplayMarker(inventories[i].ResourceType.Description, flags))
				return true;
		}
		return false;
	}
	
	$scope.loadEvents();



	$scope.redirectToLogin = function () {
	    $scope.showLogin = true;
	    $location.path('/login');
	};


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