angular.module("helpNow", ["ngRoute", "ngResource", "ui.bootstrap" ])
	.config(["$routeProvider", function ($routeProvider) {
	    $routeProvider.when("/ind_login", {
	        templateUrl: "views/ind-login.html"
	    });

		$routeProvider.when("/login", {
			templateUrl: "views/login.html"
		});
		
		$routeProvider.when("/events", {
			templateUrl: "views/events.html"
		});
		
		$routeProvider.when("/event_map/:eventID", {
			templateUrl: "views/event-map.html"
		});

		$routeProvider.when("/inventory", {
		    templateUrl: "views/inventory.html"
		});
		
		$routeProvider.when("/gov_login", {
			templateUrl: "views/gov-login.html"
		});
		
		$routeProvider.when("/org_event/:eventID", {
			templateUrl: "views/org-event.html"
		});
		
		$routeProvider.when("/events", {
			templateUrl: "views/events.html"
		});

		$routeProvider.when("/manage/", {
			templateUrl: "views/manage/manage.html"
		});

		$routeProvider.when("/regulations/", {
			templateUrl: "views/manage/regulations.html"
		});

		$routeProvider.when("/regulation_detail/:organizationRegulationsID", {
			templateUrl: "views/manage/regulation-detail.html"
		});

		$routeProvider.when("/regulation_edit/:organizationRegulationsID", {
			templateUrl: "views/manage/regulation-edit.html"
		});

		$routeProvider.when("/regulation_add/", {
			templateUrl: "views/manage/regulation-add.html"
		});

		$routeProvider.when("/regulation_add/", {
			templateUrl: "views/manage/regulation-add.html"
		});

		$routeProvider.when("/invite/", {
			templateUrl: "views/manage/team-invite.html"
		});

		$routeProvider.when("/reg_account/", {
		    templateUrl: "views/reg-account.html"
		});
		
		$routeProvider.otherwise({
			templateUrl: "views/events.html"
		});
	}]);
angular.module("helpNow").controller("EventListCtrl", ["$scope", "$location", function($scope, $location) {
	var map;
	
	$scope.getMapEventIcon = function(eventType) {
		if (eventType == "Flood") {
			return "style/images/Flood-Circle-Red.png";
		} else if (eventType == "Tsunami") {
			return "style/images/Tsunami-Circle-Red.png";
		} else {
			return "style/images/Earthquake-Circle-Red.png";
		}
	};
	
	function addEventsToMap() {
		if (!map || !$scope.events) return;
		angular.forEach($scope.events, function(event) {
			var eventIcon = L.icon({
				iconUrl: $scope.getMapEventIcon(event.EventType.Description),
				iconSize: [43, 44] 
			}); 
			var marker = L.marker([event.EventLocations[0].LAT, event.EventLocations[0].LONG], { icon: eventIcon });
			marker.on("click", function() {
				$scope.$apply(function() {
					$location.url("event_map/" + event.EventID);
				});
			});
			marker.addTo(map);
		});
	}
	
	$scope.setCurrentView("events");
	
	$scope.$on("EventDataLoaded", function() {
		addEventsToMap();
	});
	
	$scope.initMap = function(newMap) {
		map = newMap;
		addEventsToMap();
	};
}]);
angular.module("helpNow").controller("EventMapCtrl", ["$scope", "$http", "$routeParams", "$resource", function ($scope, $http, $routeParams, $resource) {

    var map;
    var mapLayers = [];

    $scope.setCurrentView("event-map");

    $scope.requestsResource = $resource("/api/event/mapitems/:eventID");
    $scope.urgencyResource = $resource("/api/requesturgency");
    $scope.needRequestResource = $resource("/api/resourcerequest");

    $scope.helpRequest = { EventID: '', RequestStateID: '1', Notes: 'Reported from App', AreaSize: '0.25 km', UnitOfMeasure: '', Quantity: '' };

    $scope.eventID = $routeParams.eventID * 1;
    if ($scope.events) {
        $scope.event = $scope.getEvent($scope.eventID);
        loadRequests();
        loadUrgencyList();
    }

    $scope.requests = [];

    $scope.overlayRadius = 250;
    $scope.radiusRawVal = 0.25;
    $scope.sliderLabel = "0.25 km";
    $scope.isMetric = true;

    $scope.showFilters = false;
    $scope.showEventDetails = true;
    $scope.showHelp = false;
    $scope.showNeeds = false;

    $scope.showMedical = true;
    $scope.showShelter = true;
    $scope.showFood = true;
    $scope.showWater = true;
    $scope.showEvacuation = true;
    $scope.showMedicine = true;

    $scope.showLocationMarkers = true;
    $scope.locationPref = { value: 'Current' };

    $scope.getLocation = function () {
        requestLocation();
    };

    function requestLocation() {
        if ($scope.locationPref.value == "Current") {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            }
        }
        else {
            map.removeLayer($scope.locationOutline);
            $scope.helpRequest.LAT = "";
            $scope.helpRequest.LONG = "";
            $scope.digest();
        }
    }

    function showPosition(position) {
        $scope.helpRequest.LAT = position.coords.latitude;
        $scope.helpRequest.LONG = position.coords.longitude;
        if ($scope.locationOutline !== undefined) {
            map.removeLayer($scope.locationOutline);
        }
        $scope.locationOutline = L.circle([position.coords.latitude, position.coords.longitude], $scope.overlayRadius).addTo(map);
        $scope.$digest();
    }

    $scope.getSelectedUrgency = function () {
        $scope.helpRequest.RequestUrgencyID = $scope.selectedUrgency.RequestUrgencyID;
    };

    $scope.showValue = function () {
        if ($scope.radiusRawVal == 0)
            $scope.radiusRawVal = 0.05;

        if ($scope.isMetric) {
            $scope.overlayRadius = $scope.radiusRawVal * 1000;
            $scope.sliderLabel = $scope.radiusRawVal + " km";
        }
        else {
            $scope.overlayRadius = $scope.radiusRawVal * 1000;
            $scope.sliderLabel = $scope.radiusRawVal + " mi";
        }
        $scope.helpRequest.AreaSize = $scope.sliderLabel;

        if ($scope.locationOutline !== undefined)
            $scope.locationOutline.setRadius($scope.overlayRadius);
    };

    $scope.changeUnits = function () {
        if ($scope.isMetric) {
            $scope.sliderLabel = $scope.radiusRawVal + " km";
            $scope.overlayRadius = $scope.overlayRadius / 0.62137119;
            if ($scope.locationOutline !== undefined)
                $scope.locationOutline.setRadius($scope.overlayRadius);
        }
        else {
            $scope.sliderLabel = $scope.radiusRawVal + " mi";
            $scope.overlayRadius = $scope.overlayRadius * 0.62137119;
            if ($scope.locationOutline !== undefined)
                $scope.locationOutline.setRadius($scope.overlayRadius);
        }
        $scope.helpRequest.AreaSize = $scope.sliderLabel;
    };

    function resetNeedsButtons() {
        $scope.showMedicalNeed = false;
        $scope.showShelterNeed = false;
        $scope.showFoodNeed = false;
        $scope.showWaterNeed = false;
        $scope.showEvacuationNeed = false;
        $scope.showMedicineNeed = false;
        return false;
    }

    $scope.$on("EventDataLoaded", function () {
        $scope.event = $scope.getEvent($scope.eventID);
        loadRequests();
        loadUrgencyList();
        resetNeedsButtons();
        updateMap();
    });

    function buildLocationMarkers() {
        if (!$scope.locations) return;
        var selectedLocations = $scope.locations.filter(function (location) {
            var type = location.ResourceType.Description;
            return shouldDisplayMarker(type);
        });

        angular.forEach(selectedLocations, function (location) {
            var locationIcon = L.icon({
                iconUrl: $scope.getLocationIcon(location.ResourceType.Description),
                iconSize: [60, 60],
                iconAnchor: [30, 30]
            });
            var marker = L.marker([location.ResourceLocation.LAT, location.ResourceLocation.LONG], { icon: locationIcon });
            marker.bindPopup("<strong>" + location.ResourceType.Description + " (" +
				location.ResourceLocation.Organization.Name + ")</strong><br/>" + location.ResourceLocation.PrimaryPOCPhone);
            mapLayers.push(marker);
        });
    }

    function shouldDisplayMarker(type) {
        return (type == "Water" && $scope.showWater) ||
				(type == "Shelter" && $scope.showShelter) ||
				(type == "Food" && $scope.showFood) ||
				(type == "Evacuation" && $scope.showEvacuation) ||
				(type == "First Aid" && $scope.showMedical) ||
				(type == "Medicine" && $scope.showMedicine);
    }

    function updateMap() {
        if (!map || !$scope.events) return;

        for (var i = 0; i < mapLayers.length; i++) {
            var layer = mapLayers[i];
            map.removeLayer(layer);
        }

        mapLayers = [];

        if ($scope.showLocationMarkers)
            buildLocationMarkers();

        angular.forEach(mapLayers, function (layer) {
            map.addLayer(layer);
        });
    }

    function loadRequests() {
        $scope.requestsResource.get({ eventID: $scope.eventID }, function (data) {
            $scope.requests = data.json.requests;
            $scope.locations = data.json.locations;
            updateMap();
        });
    }

    function loadUrgencyList() {
        $scope.urgencyResource.get({}, function (data) {
            $scope.urgencyList = data.json;
            $scope.selectedUrgency = $scope.urgencyList[0];
            $scope.helpRequest.RequestUrgencyID = $scope.selectedUrgency.RequestUrgencyID;
        });
    }

    $scope.toggleButtonClass = function (id) {
        var status = $scope[id];
        return status ? "btn btn-toggle active" : "btn btn-toggle";
    };

    $scope.toggleButton = function (id) {
        $scope[id] = !$scope[id];
        updateMap();
        return false;
    };

    $scope.toggleNeed = function (id) {
        $scope[id] = !$scope[id];
        return false;
    };

    $scope.initMap = function (newMap) {
        map = newMap;
        map.on('click', function (e) {
            if ($scope.locationPref.value == "Other") {
                if ($scope.locationOutline !== undefined) {
                    map.removeLayer($scope.locationOutline);
                }
                $scope.locationOutline = L.circle(e.latlng, $scope.overlayRadius).addTo(map);
                $scope.helpRequest.LAT = e.latlng.lat.toFixed(3);
                $scope.helpRequest.LONG = e.latlng.lng.toFixed(3);
                $scope.$digest();
            }
        });
        updateMap();
    };

    $scope.filterButtonClass = function () {
        return $scope.showFilters ? "glyphicon glyphicon-eye-close" : "glyphicon glyphicon-eye-open";
    };

    $scope.filterButtonText = function () {
        return $scope.showFilters ? "Hide" : "Show";
    };

    $scope.toggleFilters = function () {
        $scope.showFilters = !$scope.showFilters;
        return false;
    };

    $scope.toggleHelp = function () {
        $scope.showEventDetails = !$scope.showEventDetails;
        $scope.showHelp = !$scope.showHelp;
        requestLocation();
        return false;
    };

    $scope.toggleNeeds = function () {
        var hasError = false;
        if ($scope.showHelp) {
            if ($scope.locationPref.value == "Other" && ($scope.helpRequest.LAT === undefined || $scope.helpRequest.LAT == "" || $scope.helpRequest.LONG === undefined || $scope.helpRequest.LONG == "")) {
                hasError = true;
            }
            if ($scope.helpRequest.AreaSize === undefined) {
                hasError = true;
            }
            if ($scope.helpRequest.Quantity === undefined || $scope.helpRequest.Quantity == 0) {
                hasError = true;
            }
        }
        if (!hasError) {
            $scope.showHelp = !$scope.showHelp;
            $scope.showNeeds = !$scope.showNeeds;
        }
        else {
            alert("Missing Required Field(s)");
        }
        return false;
    };

    $scope.validateNumber = function (evt) {
        var e = evt || window.event;
        var key = e.keyCode || e.which;

        if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
            // numbers   
        key >= 48 && key <= 57 ||
            // Backspace and Tab and Enter
        key == 8 || key == 9 || key == 13 ||
            // left and right arrows
        key == 37 || key == 39 ||
            // Del and Ins
        key == 46 || key == 45) {
            // input is VALID
            return false;
        }
        else {
            // input is INVALID
            e.returnValue = false;
            if (e.preventDefault) e.preventDefault();
            return true;
        }
        return false;
    };

    $scope.sendNeedRequest = function () {
        var hasError = false;
        if ($scope.showNeeds) {
            if (!$scope.showMedicalNeed && !$scope.showShelterNeed && !$scope.showFoodNeed &&
                !$scope.showMedicineNeed && !$scope.showWaterNeed && !$scope.showEvacuationNeed) {
                hasError = true;
            }
        }
        if (!hasError) {
            $scope.helpRequest.EventID = $scope.eventID;
            var splitString = $scope.helpRequest.AreaSize.split(" ");
            $scope.helpRequest.AreaSize = splitString[0];
            $scope.helpRequest.UnitOfMeasure = splitString[1];
            if ($scope.showMedicalNeed) {
                $scope.helpRequest.ResourceTypeID = '4';
                postNeedRequest();
            }
            if ($scope.showShelterNeed) {
                $scope.helpRequest.ResourceTypeID = '3';
                postNeedRequest();
            }
            if ($scope.showFoodNeed) {
                $scope.helpRequest.ResourceTypeID = '1';
                postNeedRequest();
            }
            if ($scope.showMedicineNeed) {
                $scope.helpRequest.ResourceTypeID = '6';
                postNeedRequest();
            }
            if ($scope.showWaterNeed) {
                $scope.helpRequest.ResourceTypeID = '2';
                postNeedRequest();
            }
            if ($scope.showEvacuationNeed) {
                $scope.helpRequest.ResourceTypeID = '5';
                postNeedRequest();
            }
            resetNeedsButtons();
            map.removeLayer($scope.locationOutline);
            $scope.showNeeds = !$scope.showNeeds;
            $scope.showEventDetails = !$scope.showEventDetails;
        }
        else {
            alert("Specify a Need");
        }
        return false;
    };

    function postNeedRequest() {
        var needRequestData = JSON.stringify($scope.helpRequest);
        var webCall = $http({
            method: 'POST',
            url: '/api/resourcerequest',
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: needRequestData
        });
        webCall.then(function (response) {
            alert("Request successfully submitted");
        },
        function (response) { // optional
            alert("Error: ");
        });
    }

    /*$scope.initMap = function(map) {
		map.on('click', function (e) {
			if (locationOutline !== undefined) {
				map.removeLayer(locationOutline);
			}
			locationOutline = L.circle(e.latlng, overlayRadius).addTo(map);
		});

		var firstAidIcon = L.icon({
		    iconUrl: 'style/images/icons/FirstAidResource.png',
		    iconSize: [128, 158.25]
		});

		var waterIcon = L.icon({
		    iconUrl: 'style/images/icons/WaterResource.png',
		    iconSize: [72, 73]
		});

		var evacuationIcon = L.icon({
		    iconUrl: 'style/images/icons/EvacuationIcon.png',
		    iconSize: [72, 73]
		});

		for (var i = 0; i < $scope.resources.length; i++) {
		    var resource = $scope.resources[i];
		    var resourceIcon;
		    if (resource.resourceType == "First Aid") {
		        resourceIcon = firstAidIcon;
		    }
		    else if (resource.resourceType == "Water") {
		        resourceIcon = waterIcon;
		    }
		    else if (resource.resourceType == "Evacuation Site") {
		        resourceIcon = evacuationIcon;
		    }
		    var resourceMarker = L.marker([resource.lat, resource.long], { icon: resourceIcon }).addTo(map);
		    resourceMarker.on('click', function (e) {
		        for (var j = 0; j < $scope.resources.length; j++) {
		            var resourceLatLng = L.latLng($scope.resources[j].lat, $scope.resources[j].long);
		            if(e.latlng.lat == resourceLatLng.lat && e.latlng.lng == resourceLatLng.lng)
		            {
		                $scope.resource = $scope.resources[j];
		                $scope.$apply();
		            }
		        }
		        if ($scope.resource.resourceType == "Evacuation Site") showResourcePanel(false);
		        else showResourcePanel(true);
		    });
		}
	};*/
}]);
angular.module("helpNow").controller("GovLoginCtrl", ["$scope", function($scope) {
	$scope.setCurrentView("govs");
}]);
angular.module("helpNow").controller("IndLoginCtrl", ["$scope", function($scope) {
	$scope.setCurrentView("inds");
}]);
angular.module("helpNow").controller("InventoryCtrl", ["$scope", "$http", "$routeParams", "$resource", function ($scope, $http, $routeParams, $resource) {

    var map;
    var mapLayers = [];

    $scope.setCurrentView("inventory");

    $scope.requestsResource = $resource("/api/event/mapitems/");
    $scope.registryResource = $resource("/api/resourceregistry");

    $scope.eventID = $routeParams.eventID * 1;
    if ($scope.events) {
        $scope.event = $scope.getEvent($scope.eventID);
        loadRegistries();
    }

    $scope.userOrgID = 1;

    $scope.overlayRadius = 250;
    $scope.radiusRawVal = 0.25;
    $scope.sliderLabel = "0.25 km";
    $scope.isMetric = true;

    $scope.showRegistries = true;
    $scope.showNewForm = false;
    $scope.showTransportationOptions = false;

    $scope.showAir = false;
    $scope.showGround = false;
    $scope.showWater = false;

    $scope.$on("EventDataLoaded", function () {
        $scope.event = $scope.getEvent($scope.eventID);
        loadRegistries();
        loadRequests();
        resetNeedsButtons();
        updateMap();
    });

    function updateMap() {
        if (!map || !$scope.events) return;

        for (var i = 0; i < mapLayers.length; i++) {
            var layer = mapLayers[i];
            map.removeLayer(layer);
        }

        mapLayers = [];
        var selectedRequests = $scope.requests.filter(function (request) {
            var type = request.ResourceType.Description;
            return shouldDisplayMarker(type);
        });

        if ($scope.showLocationMarkers)
            buildLocationMarkers();

        angular.forEach(mapLayers, function (layer) {
            map.addLayer(layer);
        });
    }

    function loadRegistries() {
        $scope.registryResource.get({}, function (data) {
            $scope.registries = data.json;
            var filteredRegistries = $scope.registries.filter(function (registry) {
                return registry.OrganizationID == $scope.userOrgID;
            });
            $scope.registries = filteredRegistries;
        });
    }

    function loadRequests() {
        $scope.requestsResource.get({ eventID: $scope.eventID }, function (data) {
            $scope.requests = data.json.requests;
            $scope.locations = data.json.locations;
            updateMap();
        });
    }

    $scope.initMap = function (newMap) {
        map = newMap;
        map.on('click', function (e) {
            if ($scope.locationPref.value == "Other") {
                if ($scope.locationOutline !== undefined) {
                    map.removeLayer($scope.locationOutline);
                }
                $scope.locationOutline = L.circle(e.latlng, $scope.overlayRadius).addTo(map);
                $scope.helpRequest.LAT = e.latlng.lat.toFixed(3);
                $scope.helpRequest.LONG = e.latlng.lng.toFixed(3);
                $scope.$digest();
            }
        });
        updateMap();
    };

    $scope.toggleTransportClass = function (id) {
        var status = $scope[id];
        return status ? "btn btn-toggle active" : "btn btn-toggle";
    };

    $scope.toggleTransport = function (id) {
        $scope[id] = !$scope[id];
        return false;
    };

    $scope.showNewSiteForm = function () {
        $scope.showNewForm = !$scope.showNewForm;
        $scope.showRegistries = !$scope.showRegistries;
        return false;
    };

    $scope.showTransportation = function () {
        $scope.showTransportationOptions = !$scope.showTransportationOptions;
        $scope.showNewForm = !$scope.showNewForm;
        return false;
    };

    $scope.validateNumber = function (evt) {
        var e = evt || window.event;
        var key = e.keyCode || e.which;

        if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
            // numbers   
        key >= 48 && key <= 57 ||
            // Backspace and Tab and Enter
        key == 8 || key == 9 || key == 13 ||
            // left and right arrows
        key == 37 || key == 39 ||
            // Del and Ins
        key == 46 || key == 45) {
            // input is VALID
            return false;
        }
        else {
            // input is INVALID
            e.returnValue = false;
            if (e.preventDefault) e.preventDefault();
            return true;
        }
        return false;
    };
}]);
angular.module("helpNow").controller("LoginCtrl", ["$scope", "$http", "$location", "$routeParams", "$resource", function($scope, $http, $location, $routeParams, $resource) {
    $scope.setCurrentView("login");

    $scope.validateUser = function () {
        if ($scope.userCreds.username === undefined || $scope.userCreds.password === undefined) {
            alert("Missing Username or Password");
        }
        else {
            login();
        }
    };

    function login() {
        var creds = JSON.stringify($scope.userCreds);
        var webCall = $http({
            method: 'POST',
            url: '/api/account/login',
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: creds
        });
        webCall.then(function (response) {
            $scope.users = response.data.json;
            $scope.currentUser = $scope.users[0];
            if ($scope.currentUser === undefined) {
                alert("Incorrect Username/Password combination.\nPlease try again");
            }
            else {
                $scope.setCurrentUser($scope.currentUser);
                $scope.$broadcast("CurrentUserLoaded", {});
                $location.path('#');
            }
        },
        function (response) { // optional
            alert("Login Error - Please Try Again");
        });
    }
}]);
/**
 * ManageCtrl
 */

angular.module("helpNow").controller("ManageCtrl", ["$scope", "$location" , function($scope, $location) {



	$scope.go = function ( path ) {
		$location.path( path );
	};



}]);
angular.module("helpNow").controller("OrgEventCtrl", ["$scope", "$routeParams", "$resource", function ($scope, $routeParams, $resource) {
	var map;
	var mapLayers = [];
	$scope.setCurrentView("org-events");
	
	$scope.requestsResource = $resource("/api/event/mapitems/:eventID");
	
    $scope.eventID = $routeParams.eventID * 1;
	if ($scope.events) {
		$scope.event = $scope.getEvent($scope.eventID);
		loadRequests();
	} 
	
	$scope.requests = [];
	
	$scope.showFilters = false; 
	
	$scope.showMedical = true;
	$scope.showShelter = true;
	$scope.showFood = true;
	$scope.showWater = true;
	$scope.showEvacuation = true;
	$scope.showMedicine = true;
	
	$scope.showHeatmap = false;
	$scope.showClusters = false;
	$scope.showNeedsMarkers = true;
	$scope.showLocationMarkers = false;
	
	function getNeedsIcon(resourceType) {
		if (resourceType == "Water") {
			return "style/images/markers/marker-blue.png";
		} else if (resourceType == "First Aid") {
			return "style/images/markers/marker-red.png";
		} else if (resourceType == "Shelter") {
			return "style/images/markers/marker-orange.png";
		} else if (resourceType == "Evacuation") {
			return "style/images/markers/marker-purple.png";
		} else if (resourceType == "Medicine") {
			return "style/images/markers/marker-cyan.png";
		} else {
			return "style/images/markers/marker-green.png";
		}
	}
	
	function getClusterIcon(resourceType) {
		if (resourceType == "Water") {
			return "style/images/Water-Circle-Red.png";
		} else if (resourceType == "First Aid") {
			return "style/images/First Aid-Circle-Red.png";
		} else if (resourceType == "Shelter") {
			return "style/images/Shelter-Circle-Red.png";
		} else if (resourceType == "Evacuation") {
			return "style/images/Evacuation-Circle-Red.png";
		} else if (resourceType == "Medicine") {
			return "style/images/Medicine-Circle-Red.png";
		} else {
			return "style/images/Food-Circle-Red.png";
		}
	}
	
	$scope.$on("EventDataLoaded", function() {
		$scope.event = $scope.getEvent($scope.eventID);
		loadRequests();
		updateMap();
	});
	
	function buildNeedsMarkers(selectedRequests) {
		angular.forEach(selectedRequests, function(request) {
			var requestIcon = L.icon({
				iconUrl: getNeedsIcon(request.ResourceType.Description),
				iconSize: [27, 41],
				iconAnchor: [13, 41],
				popupAnchor:  [0, -20]
			}); 
			var marker = L.marker([request.LAT, request.LONG], { icon: requestIcon });
			marker.bindPopup("<strong>" + request.ResourceType.Description + " (" + request.Quantity + ")</strong><br/>" + request.Notes);
			mapLayers.push(marker);
		});
	}
	
	function buildClusterMarkers() {
		if (!$scope.requestClusters) return;
		var selectedClusters = $scope.requestClusters.filter(function(cluster) {
			var type = cluster.ResourceType.Description;
			return shouldDisplayMarker(type);
		});
		
		angular.forEach(selectedClusters, function(cluster) {
			var clusterIcon = L.icon({
				iconUrl: getClusterIcon(cluster.ResourceType.Description),
				iconSize: [50, 50],
				iconAnchor: [25, 25]
			}); 
			var marker = L.marker([cluster.LAT, cluster.LONG], { icon: clusterIcon });
			marker.bindPopup("<strong>" + cluster.ResourceType.Description + "</strong><br/>" + cluster.Notes);
			mapLayers.push(marker);
		});
	}
	
	function buildHeatmap(selectedRequests) {
		var heatmapConfig = {
			"radius": 100,
			"maxOpacity": 0.5,
			"scaleRadius": false,
			"useLocalExtrema": true,
			latField: 'LAT',
			lngField: 'LONG',
			valueField: 'Quantity'
		};
		
		var heatmapLayer = new HeatmapOverlay(heatmapConfig);
		var heatmapData = { data: selectedRequests };
		heatmapLayer.setData(heatmapData);
		mapLayers.push(heatmapLayer);
	}
	
	function buildLocationMarkers() {
		if (!$scope.locations) return;
		var selectedLocations = $scope.locations.filter(function(location) {
			var type = location.ResourceType.Description;
			return shouldDisplayMarker(type);
		});
		
		angular.forEach(selectedLocations, function(location) {
			var locationIcon = L.icon({
				iconUrl: $scope.getLocationIcon(location.ResourceType.Description),
				iconSize: [60, 60],
				iconAnchor: [30, 30]
			}); 
			var marker = L.marker([location.ResourceLocation.LAT, location.ResourceLocation.LONG], { icon: locationIcon });
			marker.bindPopup("<strong>" + location.ResourceType.Description + " (" + 
				location.ResourceLocation.Organization.Name + ")</strong><br/>" + location.ResourceLocation.PrimaryPOCPhone);
			mapLayers.push(marker);
		});
	}
	
	function shouldDisplayMarker(type) {
		return (type == "Water" && $scope.showWater) || 
				(type == "Shelter" && $scope.showShelter) || 
				(type == "Food" && $scope.showFood) || 
				(type == "Evacuation" && $scope.showEvacuation) || 
				(type == "First Aid" && $scope.showMedical) || 
				(type == "Medicine" && $scope.showMedicine);
	}
	
	function updateMap() {
		if (!map || !$scope.events) return;
		
		var zoom = map.getZoom();
		
		for (var i = 0; i < mapLayers.length; i++) {
			var layer = mapLayers[i];
			map.removeLayer(layer);
		}
		
		mapLayers = [];
		var selectedRequests = $scope.requests.filter(function(request) {
			var type = request.ResourceType.Description;
			return shouldDisplayMarker(type);
		});
		
		if ($scope.showHeatmap)
			buildHeatmap(selectedRequests);
		
		if ($scope.showNeedsMarkers && zoom > 7)
			buildNeedsMarkers(selectedRequests);
		
		if ($scope.showClusters)
			buildClusterMarkers();
		
		if ($scope.showLocationMarkers)
			buildLocationMarkers();
		
		angular.forEach(mapLayers, function(layer) {
			map.addLayer(layer);
		});
	}

	function loadRequests() {
		$scope.requestsResource.get({eventID: $scope.eventID}, function(data) {
			$scope.requests = data.json.requests;
			$scope.locations = data.json.locations;
			$scope.requestClusters = data.json.requestClusters;
			updateMap();
		});
	}
	
	$scope.toggleButtonClass = function(id) {
		var status = $scope[id];
		return status ? "btn btn-toggle active" : "btn btn-toggle";
	};
	
	$scope.toggleButton = function(id) {
		$scope[id] = !$scope[id];
		updateMap();
		return false;
	};
	
	$scope.initMap = function(newMap) {
		map = newMap;
		map.on("zoomend", function() {
			updateMap();
		})
		updateMap();
	};
	
	$scope.filterButtonClass = function() {
		return $scope.showFilters ? "glyphicon glyphicon-eye-close" : "glyphicon glyphicon-eye-open";
	};
	
	$scope.filterButtonText = function() {
		return $scope.showFilters ? "Hide" : "Show";
	};
	
	$scope.toggleFilters = function() {
		$scope.showFilters = !$scope.showFilters;
		return false;
	};
	
	$scope.setCurrentView("org-event");
}]);


angular.module("helpNow").controller("RegAccountCtrl", ["$scope", "$http", "$location", "$routeParams", "$resource", function ($scope, $http, $location, $routeParams, $resource) {
    $scope.setCurrentView("reg-account");

    $scope.showUsername = true;
    $scope.showUser = false;

    $scope.userAccount = {OrganizationGroupID: 1, Active: true, AccountRoleID: 3, CreateDate: new Date()};

    $scope.showUserForm = function () {
        var hasError = false;
        if ($scope.userAccount.Username === undefined || $scope.userAccount.Password === undefined || $scope.confirmedPassword === undefined) {
            alert("Missing field(s)");
            hasError = true;
        }
        else if ($scope.userAccount.Password != $scope.confirmedPassword) {
            alert("Passwords do not match");
            hasError = true;
        }
        if (!hasError)
        {
            $scope.showUser = true;
            $scope.showUsername = false;
        }
    };

    $scope.showUsernameForm = function () {
        $scope.showUser = false;
        $scope.showUsername = true;
    };

    $scope.submitUserReg = function () {
        var hasError = false;
        if ($scope.userAccount.FirstName === undefined || $scope.userAccount.LastName === undefined || $scope.userAccount.Email === undefined) {
            alert("Missing field(s)");
            hasError = true;
        }
        if (!hasError) {
            submitPost();
        }
    };

    function submitPost() {
        var userAccountData = JSON.stringify($scope.userAccount);
        var webCall = $http({
            method: 'POST',
            url: '/api/account',
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: userAccountData
        });
        webCall.then(function (response) {
            alert("Account Successfully Created");
            $location.path('#');
        },
        function (response) { // optional
            alert("Error: ");
        });
    }
}]);
/**
 * RegulationAddCtrl
 */

angular.module("helpNow").controller("RegulationAddCtrl", ["$scope", "$resource", "$routeParams", "Regulation", "$location", function ($scope, $resource, $routeParams, Regulation, $location) {

    $scope.newReg = new Regulation();
    $scope.newReg.OrganizationID = $scope.currentOrg.OrganizationID;


    $scope.go = function (path) {
        $location.path(path);
    };

    $scope.addRegulation = function (regulation) {
        console.log(regulation.Narrative);
        console.log(regulation.Summary);
        Regulation.save(regulation);
        $location.path('/regulations');
    };

}]);

/**
 * RegulationDetailCtrl
 */

angular.module("helpNow").controller("RegulationDetailCtrl", ["$scope", "$resource", "$routeParams", "Regulation", "$location" , function ($scope, $resource, $routeParams, Regulation, $location) {

    $scope.regulationResource = Regulation.get({id: $routeParams.organizationRegulationsID}, function (data) {
        $scope.regulation = data.json;
        $scope.$broadcast("RegulationDataLoaded", {});
    });

    $scope.go = function ( path ) {
        $location.path( path );
    };

}]);

/**
 * RegulationEditCtrl
 */
angular.module("helpNow").controller("RegulationEditCtrl", ["$scope", "$resource", "$routeParams", "Regulation", "$location", "$uibModal", function ($scope, $resource, $routeParams, Regulation, $location, $uibModal) {

    $scope.regulationResource = Regulation.get({id: $routeParams.organizationRegulationsID}, function (data) {
        $scope.editRegulations = data.json;
        $scope.editReg = $scope.editRegulations[0];
        $scope.$broadcast("RegulationDataLoaded", {});
    });

    $scope.updateRegulation = function (regulation) {
        Regulation.update({id: $routeParams.organizationRegulationsID}, regulation);
        $location.path("/regulations");
    };

    $scope.deleteRegulation = function (regulation) {
        $scope.modalInstance = $uibModal.open(
            {
                templateUrl: '/manage/regulations-modal-delete.html',
                controller: function ($scope) {
                    this.regulation = regulation;
                    this.Regulation = Regulation;

                    $scope.deleteReg = function () {
                        Regulation.delete({id: regulation.OrganizationRegulationsID});
                        $location.path("/regulations");
                    };
                },
                controllerAs: "model"
            });
    };

    $scope.go = function (path) {
        $location.path(path);
    };
}]);

/**
 * RegulationsCtrl
 */

angular.module("helpNow").controller("RegulationsCtrl", ["$scope", "$resource","$location" , function($scope, $resource,$location) {

$scope.regulationsResource = $resource("api/organizationregulation/account/:accountId",
    {accountId: $scope.currentUser.AccountID} );


    $scope.loadRegulations = function() {
		$scope.regulationsResource.get({}, function(data) {
			$scope.regulations = data.json;
			$scope.$broadcast("RegulationDataLoaded", {});
		});
};



$scope.loadRegulations();

$scope.setCurrentView("regulations");

$scope.$on("RegulationDataLoaded", function() {});

    $scope.go = function ( path ) {
        $location.path( path );
    };



}]);

angular.module("helpNow").controller("RootCtrl", ["$scope", "$location", "$http", "$resource", function($scope, $location, $http, $resource) {
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

	$scope.setCurrentUser = function (user) {
	    $scope.currentUser = user;
	    $scope.currentOrg = user.OrganizationGroup.Organization;
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
	
	$scope.getLocationIcon = function (resourceType) {
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

	$scope.redirectToLogin = function () {
	    $scope.showLogin = true;
	    $location.path('/login');
	};

	/*$scope.loadCurrentUser();*/


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

	//$scope.loadCurrentOrg();


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
/**
 * TeamInviteCtrl
 */

angular.module("helpNow").controller("TeamInviteCtrl", ["$scope", "$resource", "$routeParams", "$location", function ($scope, $resource, $routeParams, $location) {


    $scope.go = function (path) {
        $location.path(path);
    };


}]);
angular.module("helpNow").directive('map', function () {
    return {
        link: function (scope, element, attrs) {
			var center = attrs.mapCenter.split(",");
			var zoom = attrs.mapZoom;

			var api_key = 'pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNpZjc5N3NiMTA5OXlzb2x6c3FyZHQ3cTUifQ.88yZYJc78Z2MAnkX2fOjuw';
			var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
			mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ';

			var grayscale = L.tileLayer(mbUrl, { id: 'mapbox.light', attribution: mbAttr }),
                streets = L.tileLayer(mbUrl, { id: 'mapbox.streets', attribution: mbAttr }),

                GBMREST = L.esri.tiledMapLayer({ url: 'https://services.digitalglobe.com/earthservice/gis/0688362c-8f94-4016-95c3-172c2ab72023/rest/services/DigitalGlobe:ImageryTileService/MapServer', attribution: 'DigitalGlobe Basemap, 2015' }),
                GBMWMS = L.tileLayer.wms('https://services.digitalglobe.com/mapservice/wmsaccess?connectid=0688362c-8f94-4016-95c3-172c2ab72023', { layers: 'DigitalGlobe:Imagery', format: 'image/png', transparent: true, attribution: 'DigitalGlobe 2015' }),
                EsriImagery = L.esri.tiledMapLayer({ url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer', attribution: 'Esri 2015' });

			var hybrid = new L.tileLayer('https://{s}.tiles.mapbox.com/v4/digitalglobe.n6nhclo2/{z}/{x}/{y}.png?access_token=' + api_key, {
			    minZoom: 2,
			    maxZoom: 19,
			    attribution: '(c) <a href="http://microsites.digitalglobe.com/interactive/basemap_vivid/">DigitalGlobe</a> , (c) OpenStreetMap, (c) Mapbox'
			});
			var vivid = new L.tileLayer('https://{s}.tiles.mapbox.com/v4/digitalglobe.n6ngnadl/{z}/{x}/{y}.png?access_token=' + api_key, {
			    minZoom: 2,
			    maxZoom: 19,
			    attribution: '(c) <a href="http://microsites.digitalglobe.com/interactive/basemap_vivid/">DigitalGlobe</a>'
			});

			var street = new L.tileLayer('https://{s}.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + api_key, {
			    minZoom: 2,
			    maxZoom: 19,
			    attribution: '(c) OpenStreetMap , (c) Mapbox'
			});
			
			var baseLayer = L.tileLayer(
              'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  attribution: mbAttr,
                  noWrap: true,
                  minZoom: 2,
                  maxZoom: 18
              }
            );
			
			var map = new L.map('map', {
			    layers: [baseLayer],
			    maxBounds: [[-90.0, -180], [90.0, 180.0]]
            }).setView(center, zoom);

			L.control.scale().addTo(map);

			map.attributionControl.setPrefix('');
			var overlays = {
                "Base Open Street Maps": baseLayer,
			    "DigitalGlobe Basemap +Vivid with Streets": hybrid,
			    "DigitalGlobe Basemap +Vivid": vivid,
			    "Mapbox + OSM Streets": streets,
			    "DigitalGlobe Basemap: REST": GBMREST,
			    "Esri World Imagery": EsriImagery
			};

			L.control.layers(overlays, null, {
			    collapsed: true
			}).addTo(map);

			map.addControl(new L.Control.Search({
			    url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
			    jsonpParam: 'json_callback',
			    propertyName: 'display_name',
			    propertyLoc: ['lat', 'lon'],
			    circleLocation: false,
			    markerLocation: false,
			    autoType: false,
			    autoCollapse: true,
			    minLength: 2,
			    zoom: 13
			}));

            if (scope.initMap) scope.initMap(map);
        }
    };
});
angular.module('helpNow').factory('Regulation', function ($resource) {
    return $resource('api/organizationregulation/:id', null ,{
     update: {
         method: 'PUT'
     }
    });
});


