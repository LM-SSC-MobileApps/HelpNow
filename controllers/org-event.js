angular.module("helpNow").controller("OrgEventCtrl", ["$scope", "$routeParams", "$resource", "$sce", function ($scope, $routeParams, $resource, $sce) {
	var map;
	var mapLayers = [];
	$scope.setCurrentView("org-events");
	
	$scope.requestsResource = $resource("/api/event/mapitems/:eventID");
	
    $scope.eventID = $routeParams.eventID * 1;
	if ($scope.events) {
	    $scope.event = $scope.getEvent($scope.eventID);
	    $scope.setTitle($scope.event.EventLocations[0].Description, $scope.getEventIcon($scope.event.EventType.Description));
		loadRequests();
	} 
	
	$scope.requests = [];
	
	$scope.showFilters = false;
	$scope.showFindPanel = false;
	$scope.showFindResults = false;
	$scope.showMappingError = false;
	
	$scope.showHeatmap = false;
	$scope.showClusters = false;
	$scope.showNeedsMarkers = true;
	$scope.showLocationMarkers = false;
	$scope.showDistCenterMarkers = false;
	
	$scope.filterFlags = {
		showMedical: true,
		showShelter: true,
		showFood: true,
		showWater:true,
		showEvacuation: true,
		showMedicine: true
	};
	
	$scope.matchingFlags = {
		showMedical: false,
		showShelter: false,
		showFood: false,
		showWater:false,
		showEvacuation: false,
		showMedicine: false
	};
	
	$scope.mappingLoc = {}
	
    $scope.locationPref = { value: 'Current' };
	
	$scope.getLocation = function () {
        requestLocation();
    };
	
	$scope.getMatchResources = function() {
		var resources = [];
		var flags = $scope.matchingFlags;
		if (flags.showMedical) resources.push("First Aid");
		if (flags.showShelter) resources.push("Shelter");
		if (flags.showFood) resources.push("Food");
		if (flags.showWater) resources.push("Water");
		if (flags.showEvacuation) resources.push("Evacuation");
		if (flags.showMedicine) resources.push("Medicine");
		return resources.join(", ");
	}

    function requestLocation() {
        if ($scope.locationPref.value == "Current") {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            }
        }
        else {
            $scope.mappingLoc.LAT = null;
            $scope.mappingLoc.LONG = null;
			drawLocationMarker();
            $scope.$digest();
        }
    }

    function showPosition(position) {
        $scope.mappingLoc.LAT = position.coords.latitude;
        $scope.mappingLoc.LONG = position.coords.longitude;
		drawLocationMarker();
        $scope.$digest();
    }
	
	function removeLocationMarker() {
		if ($scope.locationOutline) {
            map.removeLayer($scope.locationOutline);
        }
	}
	
	function drawLocationMarker() {
		removeLocationMarker();
		
		if ($scope.mappingLoc.LAT && $scope.mappingLoc.LONG) {
			$scope.locationOutline = L.circle([$scope.mappingLoc.LAT, $scope.mappingLoc.LONG], 250).addTo(map);
		}
			
	}
	
	function getNeedsIcon(resourceType) {
		if (resourceType == "Water") {
			return "style/images/markers/dot-blue.png";
		} else if (resourceType == "First Aid") {
			return "style/images/markers/dot-red.png";
		} else if (resourceType == "Shelter") {
			return "style/images/markers/dot-orange.png";
		} else if (resourceType == "Evacuation") {
			return "style/images/markers/dot-purple.png";
		} else if (resourceType == "Medicine") {
			return "style/images/markers/dot-cyan.png";
		} else {
			return "style/images/markers/dot-green.png";
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
				iconSize: [27, 27],
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
			return $scope.shouldDisplayMarker(type, $scope.filterFlags);
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
	
	function buildDistCenterMarkers() {
		if (!$scope.distributionCenters) return;
		var selectedCenters = $scope.distributionCenters.filter(function(center) {
			return $scope.shouldDisplayLocationMarker(center, $scope.filterFlags);
		});
		
		angular.forEach(selectedCenters, function(center) {
			var belongsToUser = center.OrganizationID == $scope.currentOrg.OrganizationID;
			var url = belongsToUser ? "style/images/Distribution-Center-DBox-Blue.png" : "style/images/Distribution-Center-Box-Blue.png";
			var centerIcon = L.icon({
				iconUrl: url,
				iconSize: [60, 60],
				iconAnchor: [30, 30]
			}); 
			
			var marker = $scope.buildLocationMarker(center, centerIcon);
			mapLayers.push(marker);
		});
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
			return $scope.shouldDisplayMarker(type, $scope.filterFlags);
		});
		
		if ($scope.showHeatmap)
			buildHeatmap(selectedRequests);
		
		if ($scope.showNeedsMarkers && zoom > 7)
			buildNeedsMarkers(selectedRequests);
		
		if ($scope.showClusters)
			buildClusterMarkers();
		
		if ($scope.showLocationMarkers)
			$scope.buildLocationMarkers($scope.locations, mapLayers, $scope.filterFlags);
		
		if ($scope.showDistCenterMarkers)
			buildDistCenterMarkers();
		
		angular.forEach(mapLayers, function(layer) {
			map.addLayer(layer);
		});
	}

	function loadRequests() {
		$scope.requestsResource.get({eventID: $scope.eventID}, function(data) {
			$scope.requests = data.json.requests;
			$scope.locations = data.json.locations;
			$scope.requestClusters = data.json.requestClusters;
			$scope.distributionCenters = data.json.distributionCenters;
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
	
	$scope.toggleResourceFilter = function(filterName) {
		var flags = $scope.filterFlags;
		flags[filterName] = !flags[filterName];
		updateMap();
		return false;
	}
	
	$scope.toggleResourceButtonClass = function(id) {
		var flags = $scope.filterFlags;
		var status = flags[id];
		return status ? "btn btn-toggle active" : "btn btn-toggle";
	};
	
	$scope.toggleMatchingFilter = function(filterName) {
		var flags = $scope.matchingFlags;
		flags[filterName] = !flags[filterName];
		updateMap();
		return false;
	}
	
	$scope.toggleMatchingButtonClass = function(id) {
		var flags = $scope.matchingFlags;
		var status = flags[id];
		return status ? "btn btn-toggle active" : "btn btn-toggle";
	};
	
	$scope.getCleanLocationText = function(location) {
		return $sce.trustAsHtml($scope.buildLocationDetails(location));
	};
	
	$scope.initMap = function(newMap) {
		map = newMap;
		map.on("zoomend", function() {
			updateMap();
		});
		map.on('click', function (e) {
            if ($scope.showFindPanel && !$scope.showFindResults && $scope.locationPref.value == "Other") {
                $scope.mappingLoc.LAT = e.latlng.lat.toFixed(3);
                $scope.mappingLoc.LONG = e.latlng.lng.toFixed(3);
				drawLocationMarker();
                $scope.$digest();
            }
        });
		updateMap();
	};
	
	$scope.filterButtonText = function() {
		return $scope.showFilters ? "Hide" : "Show";
	};
	
	$scope.toggleFilters = function() {
		$scope.showFilters = !$scope.showFilters;
		return false;
	};
	
	$scope.toggleFindPanel = function() {
		
		$scope.showFindPanel = !$scope.showFindPanel;
		if ($scope.showFindPanel) {
			$scope.showDistCenterMarkers = true;
			updateMap();
		} else {
			removeLocationMarker();
		}
		return false;
	};

	function convertToRadians(degrees) {
	  return degrees * (Math.PI/180)
	}
	
	function calculateKmDistance(lat1, lng1, lat2, lng2) {
		var earthRadius = 6371;
		var dLat = convertToRadians(lat2 - lat1);
		var dLng = convertToRadians(lng2 - lng1); 
		var a = 
			Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(convertToRadians(lat1)) * Math.cos(convertToRadians(lat2)) * 
			Math.sin(dLng/2) * Math.sin(dLng/2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 -a )); 
		return earthRadius * c;
	}
	
	function matchDistributionCenters() {
		var maxDist = 0;
		var minDist = Number.MAX_VALUE;
		
		var selectedCenters = $scope.distributionCenters.filter(function(center) {
			return $scope.shouldDisplayLocationMarker(center, $scope.matchingFlags) &&
				center.OrganizationID == $scope.currentOrg.OrganizationID;
		});
		
		var centersWithCompScores = selectedCenters.map(function(center) {
			var distance = calculateKmDistance(center.LAT, center.LONG, $scope.mappingLoc.LAT, $scope.mappingLoc.LONG);
			if (distance >= maxDist) maxDist = distance;
			if (distance <= minDist) minDist = distance;
			
			return { center: center, dist: distance.toFixed(3) };
		});
		
		var centersWithScores = centersWithCompScores.map(function(center) {
			var score = (center.dist - minDist) / (maxDist - minDist);
			center.score = score;
			return center;
		});
		
		centersWithScores.sort(function(a, b) {
			return a.score - b.score;
		});
		
		if (centersWithScores.length > 3)
			centersWithScores = centersWithScores.slice(0, 3);
		
		$scope.hasMatches = centersWithScores.length > 0;
		
		return centersWithScores;
	}
	
	$scope.findMatches = function() {
		$scope.showMappingError = false;
		if (!$scope.mappingLoc.LAT || !$scope.mappingLoc.LONG || $scope.getMatchResources().length == 0) {
			$scope.showMappingError = true;
			return false;
		}
		
		$scope.matches = matchDistributionCenters();
		$scope.showFindResults = true;
		return false;
	};
	
	$scope.showLocation = function(lat, lng) {
		map.setView([lat, lng], map.getZoom());
	};
	
	$scope.backToFind = function() {
		$scope.showFindResults = false;
		return false;
	};
	
	$scope.popupIsOpen = function() {
		return $scope.showFindPanel || $scope.showFilters;
	};
	
	$scope.setCurrentView("org-event");
}]);

