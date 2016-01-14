angular.module("helpNow").controller("RootCtrl", ["$scope", "$route", "$location", "$http", "$resource", function ($scope, $route, $location, $http, $resource) {
    var currentLanguage = "Eng";
    var currentView = "";

    $scope.eventsResource = $resource("/api/event");
    $scope.currentUser = JSON.parse(sessionStorage.getItem("user"));
    if ($scope.currentUser != null) {
        if ($scope.currentUser.AccountRoleID == 1) {
            $scope.isSuperAdmin = true;
        }
        else {
            $scope.isSuperAdmin = false;
        }
    }
    $scope.currentOrg = JSON.parse(sessionStorage.getItem("user"));

    $scope.loadEvents = function () {
        $scope.eventsResource.get({}, function (data) {
            $scope.events = data.json;
            $scope.$broadcast("EventDataLoaded", {});
        });
    };

    $scope.getShowLogin = function () {
        if (!$scope.title) {
            return true;
        } else if ($scope.title.indexOf($scope.text.login_title) == 0) {
            return false;
        } else if ($scope.currentUser) {
            return false;
        } else {
            return true;
        }
    };

    $scope.getEventIcon = function (eventType) {
        if (eventType == "Flood") {
            return "style/images/flood.png";
        } else if (eventType == "Tsunami") {
            return "style/images/Tsunami.png";
        } else {
            return "style/images/earthquake.png";
        }
    };

    $scope.getMenuClass = function (viewName) {
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
        if ($scope.currentUser.AccountRoleID == 1) {
            $scope.isSuperAdmin = true;
        }
        else {
            $scope.isSuperAdmin = false;
        }
    };

    $scope.getCurrentUser = function () {
        return $scope.currentUser;
    }

    $scope.setCurrentOrg = function (org) {
        $scope.currentOrg = org;
    };

    $scope.setCurrentLanguage = function (language) {
        currentLanguage = language;
        if (language == "Ben")
            $http.get("i18n/text-BEN.json")
				.success(function (data) {
				    $scope.text = data;
				    $route.reload();
				})
				.error(function (data) {
				    console.log("setCurrentLanguage: " + data);
				});
        else if (language == "Fre") {
            $http.get("i18n/text-FRE.json")
                .success(function (data) {
                    $scope.text = data;
                    $route.reload();
                })
                .error(function (data) {
                    console.log("setCurrentLanguage: " + data);
                });
        }
        else if (language == "Esp") {
            $http.get("i18n/text-ESP.json")
				.success(function (data) {
				    $scope.text = data;
				    $route.reload();
				})
				.error(function (data) {
				    console.log("setCurrentLanguage: " + data);
				});
        }
        else {
            $http.get("i18n/text-ENG.json")
				.success(function (data) {
				    $scope.text = data;
				    $route.reload();
				})
				.error(function (data) {
				    console.log("setCurrentLanguage: " + data);
				});
        }
    };

    $scope.getLanguageClass = function (language) {
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

    $scope.getEvent = function (eventID) {
        for (var i = 0; i < $scope.events.length; i++) {
            var event = $scope.events[i];
            if (event.EventID == eventID) return event;
        }
        return {};
    };

    $scope.getLocationIcon = function (location) {
        var inventories = location.ResourceLocationInventories;
        var belongsToUser = $scope.currentOrg && location.OrganizationID == $scope.currentOrg.OrganizationID;

        if (inventories.length > 1)
            return belongsToUser ? "style/images/Resources-DBox-Blue.png" : "style/images/Resources-Box-Blue.png";

        var iconType = belongsToUser ? "DDiamond-Blue" : "Diamond-Blue";
        var resourceType = inventories[0].ResourceType.Description;
        if (resourceType == "Water") {
            return "style/images/Water-" + iconType + ".png";
        } else if (resourceType == "First Aid") {
            return "style/images/First Aid-" + iconType + ".png";
        } else if (resourceType == "Shelter") {
            return "style/images/Shelter-" + iconType + ".png";
        } else if (resourceType == "Evacuation") {
            return "style/images/Evacuation-" + iconType + ".png";
        } else if (resourceType == "Clothing") {
            return "style/images/Clothing-" + iconType + ".png";
        } else if (resourceType == "Rescue") {
            return "style/images/Rescue-" + iconType + ".png";
        } else if (resourceType == "Medicine") {
            return "style/images/Medicine-" + iconType + ".png";
        } else {
            return "style/images/Food-" + iconType + ".png";
        }
    };

    $scope.buildLocationDetails = function (location) {
        var popupText = "<strong>" + location.Organization.Name + "</strong><br/>" +
			location.PrimaryPOCName + "<br/>" +
			location.PrimaryPOCPhone + "<hr/>";
        location.ResourceLocationInventories.forEach(function (inventory) {
            popupText += inventory.ResourceType.Description + ": " + inventory.Quantity + " " +
				inventory.ResourceTypeUnitOfMeasure.Description + "<br/>";
        });
        return popupText;
    };

    $scope.buildLocationMarker = function (location, icon, onClick) {
        var marker = L.marker([location.LAT, location.LONG], { icon: icon });
        if (onClick)
            marker.on("click", function () {
                $scope.$apply(function () {
                    onClick(location);
                });
            });
        else
            marker.bindPopup($scope.buildLocationDetails(location));
        return marker;
    };

    $scope.buildLocationMarkers = function (locations, mapLayers, flags, onClick) {
        if (!locations) return;
        var selectedLocations = locations.filter(function (location) {
            return $scope.shouldDisplayLocationMarker(location, flags);
        });

        angular.forEach(selectedLocations, function (location) {
            var locationIcon = L.icon({
                iconUrl: $scope.getLocationIcon(location),
                iconSize: [60, 60],
                iconAnchor: [30, 30]
            });

            var marker = $scope.buildLocationMarker(location, locationIcon, onClick);
            mapLayers.push(marker);
        });
    };

    $scope.shouldDisplayMarker = function (type, flags) {
        return (type == "Water" && flags.showWater) ||
				(type == "Shelter" && flags.showShelter) ||
				(type == "Food" && flags.showFood) ||
                (type == "Clothing" && flags.showClothing) ||
                (type == "Rescue" && flags.showRescue) ||
				(type == "Evacuation" && flags.showEvacuation) ||
				(type == "First Aid" && flags.showMedical) ||
				(type == "Medicine" && flags.showMedicine);
    };

    $scope.shouldDisplayLocationMarker = function (location, flags) {
        var inventories = location.ResourceLocationInventories;
        for (var i = 0; i < inventories.length; i++) {
            if ($scope.shouldDisplayMarker(inventories[i].ResourceType.Description, flags))
                return true;
        }
        return false;
    };

    $scope.loadEvents();

    $scope.$on('$locationChangeSuccess', function (evt, absNewUrl, absOldUrl) {
        // Check for Facebook redirect and then set client session object from server
        var facebookUrl = "_=_";

        if (absNewUrl.indexOf(facebookUrl) > 0 &&
            absOldUrl.indexOf(facebookUrl) > 0) {

            var webCall = $http({
                method: 'POST',
                url: '/auth/account',
                async: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            webCall.then(function (response) {
                $scope.users = response.data.json;
                $scope.currentUser = $scope.users[0];
                if ($scope.currentUser === undefined) {
                    alert($scope.text.incorrect_login_alert);
                }
                else {
                    var userSessionObject = {
                        AccountID: $scope.currentUser.AccountID,
                        FirstName: $scope.currentUser.FirstName,
                        LastName: $scope.currentUser.LastName,
                        OrganizationID: $scope.currentUser.Organization.OrganizationID,
                        OrganizationTypeID: $scope.currentUser.Organization.OrganizationTypeID,
                        OrganizationName: $scope.currentUser.Organization.Name
                    };
                    $scope.setCurrentUser(userSessionObject);
                    $scope.setCurrentOrg($scope.currentUser.Organization);
                    sessionStorage.setItem("user", JSON.stringify(userSessionObject));
                    $scope.$broadcast("CurrentUserLoaded", {});
                }
            },
            function (response) { // optional
                alert($scope.text.incorrect_login_alert);
            });
        }
    });

    $scope.redirectToLogin = function () {
        $location.path('/login');
    };

    $scope.redirectToLogout = function () {
        // Logout client
        $scope.currentUser = false;
        $scope.isSuperAdmin = false;
        sessionStorage.removeItem("user");

        // Logout server
        var webCall = $http({
            method: 'POST',
            url: '/auth/logout',
            async: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        webCall.then(function (response) {
            //alert("You have been successfully logged out.");
        },
        function (response) {
            alert("Logout Error - " + response);
        });

        $location.path('#');
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