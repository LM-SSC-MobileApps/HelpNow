angular.module("helpNow", ["ngRoute", "ngResource"])
	.config(["$routeProvider", function ($routeProvider) {
	    $routeProvider.when("/ind_login", {
	        templateUrl: "views/ind-login.html"
	    });

		$routeProvider.when("/org_login", {
			templateUrl: "views/org-login.html"
		});
		
		$routeProvider.when("/events", {
			templateUrl: "views/events.html"
		});
		
		$routeProvider.when("/event_map/:eventID", {
			templateUrl: "views/event-map.html"
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
		
		$routeProvider.otherwise({
			templateUrl: "views/events.html"
		});
	}]);
angular.module("helpNow").controller("EventListCtrl", ["$scope", function($scope) {
	var map;
	
	function addEventsToMap() {
		if (!map || !$scope.events) return;
		angular.forEach($scope.events, function(event) {
			var eventIcon = L.icon({
				iconUrl: $scope.getIcon(event.EventType.Description),
				iconSize: [43, 44]
			}); 
			var marker = L.marker([event.EventLocations[0].LAT, event.EventLocations[0].LONG], { icon: eventIcon });
			marker.on("click", function() {
				window.location = "#event_map/" + event.EventID;
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
    
    $scope.helpRequest = { EventID: '', RequestStateID: '1', Notes: 'Reported from App', AreaSize: '', UnitOfMeasure: '', Quantity: '', RequestUrgencyID: '1' };

    $scope.eventID = $routeParams.eventID * 1;
    if ($scope.events) {
        $scope.event = $scope.getEvent($scope.eventID);
        loadRequests();
        loadUrgencyList();
    }

    $scope.requests = [];

    $scope.overlayRadius = 1000;
    $scope.radiusRawVal = 1;
    $scope.sliderLabel = "1 km";
    $scope.isMetric = true;

    $scope.showFilters = true;
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

    $scope.showValue = function () {
        if ($scope.radiusRawVal == 0)
            $scope.radiusRawVal = 1;

        if ($scope.isMetric) {
            $scope.overlayRadius = $scope.radiusRawVal * 1000;
            $scope.sliderLabel = $scope.radiusRawVal + " km";
        }
        else {
            $scope.overlayRadius = $scope.radiusRawVal * 1000;
            $scope.sliderLabel = $scope.radiusRawVal + " mi";
        }
        $scope.helpRequest.AreaSize = $scope.sliderLabel;

        if ($scope.locationOutline != undefined)
            $scope.locationOutline.setRadius($scope.overlayRadius);
    };

    $scope.changeUnits = function () {
        if ($scope.isMetric) {
            $scope.sliderLabel = $scope.radiusRawVal + " km";
            $scope.overlayRadius = $scope.overlayRadius / 0.62137119;
            if ($scope.locationOutline != undefined)
                $scope.locationOutline.setRadius($scope.overlayRadius);
        }
        else {
            $scope.sliderLabel = $scope.radiusRawVal + " mi";
            $scope.overlayRadius = $scope.overlayRadius * 0.62137119;
            if ($scope.locationOutline != undefined)
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

    function getLocationIcon(resourceType) {
        if (resourceType == "Water") {
            return "style/images/icons/WaterResource.png";
        } else if (resourceType == "First Aid") {
            return "style/images/icons/FirstAidResource.png";
        } else if (resourceType == "Shelter") {
            return "style/images/marker2-orange.png";
        } else if (resourceType == "Evacuation") {
            return "style/images/icons/EvacuationIcon.png";
        } else if (resourceType == "Medicine") {
            return "style/images/marker2-cyan.png";
        } else {
            return "style/images/marker2-green.png";
        }
    }

    $scope.$on("EventDataLoaded", function () {
        $scope.event = $scope.getEvent($scope.eventID);
        loadRequests();
        loadUrgencyList();
        resetNeedsButtons();
        updateMap();
    });

    function buildLocationMarkers() {
        var selectedLocations = $scope.locations.filter(function (location) {
            var type = location.ResourceType.Description;
            return shouldDisplayMarker(type);
        });

        angular.forEach(selectedLocations, function (location) {
            var resourceIconSize = [0, 0];
            if (location.ResourceType.Description == "Water" || location.ResourceType.Description == "Evacuation") resourceIconSize = [72, 73];
            else if (location.ResourceType.Description == "First Aid") resourceIconSize = [128, 158.25];
            else resourceIconSize = [27, 41];
            var locationIcon = L.icon({
                iconUrl: getLocationIcon(location.ResourceType.Description),
                iconSize: resourceIconSize
            });
            var marker = L.marker([location.ResourceLocation.LAT, location.ResourceLocation.LONG], { icon: locationIcon });
            marker.bindPopup("<strong>" + location.ResourceType.Description + " (" + location.Organization.Name + ")</strong><br/>" + location.Notes);
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
        return false;
    };

    $scope.toggleNeeds = function () {
        var hasError = false;
        if ($scope.showHelp) {
            if ($scope.locationPref.value == "Other" && ($scope.helpRequest.LAT == undefined || $scope.helpRequest.LONG == undefined)) {
                hasError = true;
            }
            if ($scope.helpRequest.AreaSize == undefined) {
                hasError = true;
            }
            if ($scope.helpRequest.Quantity == undefined || $scope.helpRequest.Quantity == 0) {
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
                alert("Needs Shelter");
                postNeedRequest();
            }
            if ($scope.showFoodNeed) {
                $scope.helpRequest.ResourceTypeID = '1';
                alert("Needs Food");
                postNeedRequest();
            }
            if ($scope.showMedicineNeed) {
                $scope.helpRequest.ResourceTypeID = '6';
                alert("Needs Medicine");
                postNeedRequest();
            }
            if ($scope.showWaterNeed) {
                $scope.helpRequest.ResourceTypeID = '2';
                alert("Needs Water");
                postNeedRequest();
            }
            if ($scope.showEvacuationNeed) {
                $scope.helpRequest.ResourceTypeID = '5';
                alert("Needs Evacuation");
                postNeedRequest();
            }
            resetNeedsButtons();
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
	
	$scope.showFilters = true; 
	
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
			return "style/images/marker-blue.png";
		} else if (resourceType == "First Aid") {
			return "style/images/marker-red.png";
		} else if (resourceType == "Shelter") {
			return "style/images/marker-orange.png";
		} else if (resourceType == "Evacuation") {
			return "style/images/marker-purple.png";
		} else if (resourceType == "Medicine") {
			return "style/images/marker-cyan.png";
		} else {
			return "style/images/marker-green.png";
		}
	}
	
	function getLocationIcon(resourceType) {
		if (resourceType == "Water") {
			return "style/images/marker2-blue.png";
		} else if (resourceType == "First Aid") {
			return "style/images/marker2-red.png";
		} else if (resourceType == "Shelter") {
			return "style/images/marker2-orange.png";
		} else if (resourceType == "Evacuation") {
			return "style/images/marker2-purple.png";
		} else if (resourceType == "Medicine") {
			return "style/images/marker2-cyan.png";
		} else {
			return "style/images/marker2-green.png";
		}
	}
	
	function getClusterIcon(resourceType) {
		if (resourceType == "Water") {
			return "style/images/marker-blue-lg.png";
		} else if (resourceType == "First Aid") {
			return "style/images/marker-red-lg.png";
		} else if (resourceType == "Shelter") {
			return "style/images/marker-orange-lg.png";
		} else if (resourceType == "Evacuation") {
			return "style/images/marker-purple-lg.png";
		} else if (resourceType == "Medicine") {
			return "style/images/marker-cyan-lg.png";
		} else {
			return "style/images/marker-green-lg.png";
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
				iconSize: [27, 41]
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
				iconSize: [40, 60]
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
				iconUrl: getLocationIcon(location.ResourceType.Description),
				iconSize: [27, 41]
			}); 
			var marker = L.marker([location.ResourceLocation.LAT, location.ResourceLocation.LONG], { icon: locationIcon });
			marker.bindPopup("<strong>" + location.ResourceType.Description + " (" + location.Organization.Name + ")</strong><br/>" + location.Notes);
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
		var selectedRequests = $scope.requests.filter(function(request) {
			var type = request.ResourceType.Description;
			return shouldDisplayMarker(type);
		});
		
		if ($scope.showHeatmap)
			buildHeatmap(selectedRequests);
		
		if ($scope.showNeedsMarkers)
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


angular.module("helpNow").controller("OrgLoginCtrl", ["$scope", function($scope) {
	$scope.setCurrentView("orgs");
}]);
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
	
	$scope.getIcon = function(eventType) {
		if (eventType == "Flood") {
			return "style/images/icons/FloodIcon.png";
		} else if (eventType == "Tsunami") {
			return "style/images/icons/TsunamiIcon.png";
		} else {
			return "style/images/icons/EarthquakeIcon.png";
		}
	};
	
	$scope.getGrayIcon = function(eventType) {
		if (eventType == "Flood") {
			return "style/images/icons/FloodGray.png";
		} else if (eventType == "Tsunami") {
			return "style/images/icons/TsunamiGray.png";
		} else {
			return "style/images/icons/EarthquakeGray.png";
		}
	};
	
	$scope.getMenuClass = function(viewName) {
		return viewName == currentView ? "active" : "";
	};
	
	$scope.setCurrentView = function(viewName) {
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
	
	$scope.loadEvents();
	
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
			    minZoom: 1,
			    maxZoom: 19,
			    attribution: '(c) <a href="http://microsites.digitalglobe.com/interactive/basemap_vivid/">DigitalGlobe</a> , (c) OpenStreetMap, (c) Mapbox'
			});
			var vivid = new L.tileLayer('https://{s}.tiles.mapbox.com/v4/digitalglobe.n6ngnadl/{z}/{x}/{y}.png?access_token=' + api_key, {
			    minZoom: 1,
			    maxZoom: 19,
			    attribution: '(c) <a href="http://microsites.digitalglobe.com/interactive/basemap_vivid/">DigitalGlobe</a>'
			});

			var street = new L.tileLayer('https://{s}.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + api_key, {
			    minZoom: 1,
			    maxZoom: 19,
			    attribution: '(c) OpenStreetMap , (c) Mapbox'
			});
			
			var baseLayer = L.tileLayer(
              'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  attribution: mbAttr,
                  maxZoom: 18
              }
            );
			
			var map = new L.map('map', {
                layers: [baseLayer]
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