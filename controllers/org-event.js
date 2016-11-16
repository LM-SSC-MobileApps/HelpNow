angular.module("helpNow").controller("OrgEventCtrl", ["$scope", "$routeParams", "$resource", "$sce", "$location", "$http",
	function ($scope, $routeParams, $resource, $sce, $location, $http) {
	    var map;
	    var mapLayers = [];
		var routeColors = ["#fcff00", "#ff00e4", "#00ffc6"];
	    $scope.setCurrentView("events");

	    $scope.requestsResource = $resource("/api/event/mapitems/:eventID");
		$scope.matchingResource = $resource("/api/resourcelocation/dist-center/nearest/:loc?resources=:resources");
		$scope.BlockageResource = $resource("/api/blockage/:id");
	
	    $scope.eventID = $routeParams.eventID * 1;
	    if ($scope.events) {
	        $scope.event = $scope.getEvent($scope.eventID);
	        $scope.setTitle($scope.event.EventLocations[0].Description, $scope.getEventIcon($scope.event.EventType.Description));
	        loadRequests();
	    }

	    var dataRefreshTaskID = setInterval(loadRequests, 10000);

	    $scope.$on('$destroy', function () {
	        clearInterval(dataRefreshTaskID);
	    });

	    $scope.locations = [];
	    $scope.distributionCenters = [];
		$scope.blockages = [];
		$scope.selectedClusters = [];

	    $scope.showFilters = false;
	    $scope.showFindPanel = false;
	    $scope.showFindResults = false;
	    $scope.showMappingError = false;
	    $scope.showDeployPanel = false;
	    $scope.showDeploymentPanel = false;
	    $scope.showBlockagePanel = false;

	    var showHeatmap = JSON.parse(sessionStorage.getItem("showHeatmap"));
	    var showClusters = JSON.parse(sessionStorage.getItem("showClusters"));
	    var showNeedsMarkers = JSON.parse(sessionStorage.getItem("showNeedsMarkers"));
	    var showLocationMarkers = JSON.parse(sessionStorage.getItem("showLocationMarkers"));
	    var showDistCenterMarkers = JSON.parse(sessionStorage.getItem("showDistCenterMarkers"));
		var showBlockageMarkers = JSON.parse(sessionStorage.getItem("showBlockageMarkers"));

	    if (showHeatmap != null) {
	        $scope.showHeatmap = showHeatmap;
	    }
	    else {
	        $scope.showHeatmap = true;
	    }
	    if (showClusters != null) {
	        $scope.showClusters = showClusters;
	    }
	    else {
	        $scope.showClusters = true;
	    }
	    if (showNeedsMarkers != null) {
	        $scope.showNeedsMarkers = showNeedsMarkers;
	    }
	    else {
	        $scope.showNeedsMarkers = false;
	    }
	    if (showLocationMarkers != null) {
	        $scope.showLocationMarkers = showLocationMarkers;
	    }
	    else {
	        $scope.showLocationMarkers = true;
	    }
	    if (showDistCenterMarkers != null) {
	        $scope.showDistCenterMarkers = showDistCenterMarkers;
	    }
	    else {
	        $scope.showDistCenterMarkers = false;
	    }
		if (showBlockageMarkers != null) {
	        $scope.showBlockageMarkers = showBlockageMarkers;
	    }
	    else {
	        $scope.showBlockageMarkers = true;
	    }

	    var filters = JSON.parse(sessionStorage.getItem("filterFlags"));
	    if (filters != null) {
	        $scope.filterFlags = JSON.parse(sessionStorage.getItem("filterFlags"));
	    }
	    else {
	        $scope.filterFlags = {
	            showMedical: true,
	            showShelter: true,
	            showFood: true,
	            showWater: true,
	            showClothing: true,
	            showRescue: true,
	            showEvacuation: true,
	            showMedicine: true
	        };
	    }

	    $scope.matchingFlags = {
	        showMedical: false,
	        showShelter: false,
	        showFood: false,
	        showWater: false,
	        showClothing: false,
	        showRescue: false,
	        showEvacuation: false,
	        showMedicine: false
	    };

	    $scope.mappingLoc = {};
	    $scope.deployment = {};
		$scope.blockage = { EventID: $scope.eventID };

	    $scope.locationPref = { value: 'Current' };

	    $scope.getLocation = function () {
	        requestLocation();
	    };

	    function closePanels() {
	        $scope.showFilters = false;
	        $scope.showFindPanel = false;
	        $scope.showFindResults = false;
	        $scope.showMappingError = false;
	        $scope.showDeployPanel = false;
	        $scope.showDeploymentPanel = false;
			$scope.showBlockagePanel = false;
	    };

	    $scope.getMatchResources = function () {
	        var resources = [];
	        var flags = $scope.matchingFlags;
	        if (flags.showMedical) resources.push("First Aid");
	        if (flags.showShelter) resources.push("Shelter");
	        if (flags.showFood) resources.push("Food");
	        if (flags.showWater) resources.push("Water");
	        if (flags.showClothing) resources.push("Clothing");
	        if (flags.showRescue) resources.push("Rescue");
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

			var markerOptions = { color: "#00ff00", opacity: 1, fillOpacity: 0.7, radius: 15 };
	        if ($scope.showFindPanel && $scope.mappingLoc.LAT && $scope.mappingLoc.LONG) {
	            $scope.locationOutline = L.circleMarker([$scope.mappingLoc.LAT, $scope.mappingLoc.LONG],markerOptions).addTo(map);
	        } else if ($scope.showDeployPanel && $scope.deployment.LAT && $scope.deployment.LONG) {
	            $scope.locationOutline = L.circleMarker([$scope.deployment.LAT, $scope.deployment.LONG], markerOptions).addTo(map);
	        }else if ($scope.showBlockagePanel && $scope.blockage.LAT && $scope.blockage.LONG) {
	            $scope.locationOutline = L.circleMarker([$scope.blockage.LAT, $scope.blockage.LONG], markerOptions).addTo(map);
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
	        } else if (resourceType == "Clothing") {
	            return "style/images/markers/dot-yellow.png";
	        } else if (resourceType == "Rescue") {
	            return "style/images/markers/dot-magenta.png";
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
	        } else if (resourceType == "Clothing") {
	            return "style/images/Clothing-Circle-Red.png";
	        } else if (resourceType == "Rescue") {
	            return "style/images/Rescue-Circle-Red.png"
	        } else if (resourceType == "Evacuation") {
	            return "style/images/Evacuation-Circle-Red.png";
	        } else if (resourceType == "Medicine") {
	            return "style/images/Medicine-Circle-Red.png";
	        } else {
	            return "style/images/Food-Circle-Red.png";
	        }
	    }

	    $scope.$on("EventDataLoaded", function () {
	        $scope.event = $scope.getEvent($scope.eventID);
	        $scope.setTitle($scope.event.EventLocations[0].Description, $scope.getEventIcon($scope.event.EventType.Description));
	        loadRequests();
	        updateMap();
	    });

	    function buildNeedsMarkers(selectedRequests) {
	        angular.forEach(selectedRequests, function (request) {
	            var requestIcon = L.icon({
	                iconUrl: getNeedsIcon(request.ResourceType.Description),
	                iconSize: [27, 27],
	                iconAnchor: [13, 41],
	                popupAnchor: [0, -45]
	            });
	            var marker = L.marker([request.LAT, request.LONG], { icon: requestIcon });
	            marker.bindPopup("<strong>" + request.ResourceType.Description + " (" + request.Quantity + ")</strong><br/>" + request.Notes);
	            mapLayers.push(marker);
	        });
	    }

	    function buildClusterMarkers(showIcons) {
	        if (!$scope.requestClusters) return;
	        $scope.selectedClusters = $scope.requestClusters.filter(function (cluster) {
	            var type = cluster.ResourceType.Description;
	            return $scope.shouldDisplayMarker(type, $scope.filterFlags);
	        });

	        $scope.selectedClusters = $scope.selectedClusters.filter(function (cluster) {
	            return cluster.LAT != null && !isNaN(cluster.LAT) && cluster.LONG && !isNaN(cluster.LONG);
	        });

	        if (showIcons) {
	            angular.forEach($scope.selectedClusters, function (cluster) {
	                var clusterIcon = L.icon({
	                    iconUrl: getClusterIcon(cluster.ResourceType.Description),
	                    iconSize: [50, 50],
	                    iconAnchor: [25, 25]
	                });
	                if (cluster.LAT == null || isNaN(cluster.LAT) || cluster.LONG == null || isNaN(cluster.LONG)) {

	                }
	                else {
	                    var marker = L.marker([cluster.LAT, cluster.LONG], { icon: clusterIcon });
	                    marker.bindPopup("<strong>" + cluster.ResourceType.Description + "</strong><br/>" + cluster.Notes);
	                    mapLayers.push(marker);
	                }
	            });
	        }
	    }


	    function buildHeatmap(selectedClusters) {
	        var heatmapConfig = {
	            "radius": 0.085,
	            "maxOpacity": 0.5,
	            "scaleRadius": true,
	            "useLocalExtrema": true,
	            latField: 'LAT',
	            lngField: 'LONG',
	            valueField: 'Quantity'
	        };

	        var heatmapLayer = new HeatmapOverlay(heatmapConfig);
	        var heatmapData = { data: selectedClusters };
	        heatmapLayer.setData(heatmapData);
	        mapLayers.push(heatmapLayer);
	    }

	    function buildDistCenterMarkers() {
	        if (!$scope.distributionCenters) return;
	        var selectedCenters = $scope.distributionCenters.filter(function (center) {
	            return $scope.shouldDisplayLocationMarker(center, $scope.filterFlags);
	        });

	        angular.forEach(selectedCenters, function (center) {
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
		
		function buildBlockageMarkers() {
	        if (!$scope.blockages) return;
	        angular.forEach($scope.blockages, function (blockage) {
	            var url = "style/images/Alert.png";
	            var blockageIcon = L.icon({
	                iconUrl: url,
	                iconSize: [30, 30],
	                iconAnchor: [15, 15]
	            });

	            var marker = L.marker([blockage.LAT, blockage.LONG], { icon: blockageIcon });
				marker.on("click", function () {
					$scope.$apply(function () {
						blockageClicked(blockage);
					});
				});
				
	            mapLayers.push(marker);
	        });
	    }
		
		$scope.getRouteColor = function(index) {
			return routeColors[index];
		}
		
		function buildRoutes() {
			
			angular.forEach($scope.matches, function(match, index) {
				var polyline = L.polyline(match.Route, {color: routeColors[index]});
				mapLayers.push(polyline);
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

	        if ($scope.showClusters)
	            buildClusterMarkers($scope.showClusters);

	        if ($scope.showLocationMarkers)
	            $scope.buildLocationMarkers($scope.locations, mapLayers, $scope.filterFlags, locationClicked);

	        if ($scope.showDistCenterMarkers)
	            buildDistCenterMarkers();
			
			if ($scope.showBlockageMarkers)
			    buildBlockageMarkers();

			if ($scope.showHeatmap)
			    if (!$scope.showClusters)
			    {
			        buildClusterMarkers($scope.showClusters);
			    }
			    buildHeatmap($scope.selectedClusters);
			
			if ($scope.showFindResults && $scope.matches)
				buildRoutes();
			
	        angular.forEach(mapLayers, function (layer) {
	            map.addLayer(layer);
	        });
	    }

	    function locationClicked(location) {
	        closePanels();
	        $scope.deployment = location;
	        $scope.showDeploymentPanel = true;
	    }
		
		function blockageClicked(blockage) {
	        closePanels();
	        $scope.blockage = blockage;
	        $scope.showBlockageDetailPanel = true;
	    }

	    function loadRequests() {
	        $scope.requestsResource.get({ eventID: $scope.eventID }, function (data) {
	            var dataChanged = data.json.locations.length != $scope.locations.length
					|| data.json.distributionCenters.length != $scope.distributionCenters.length
					|| data.json.blockages.length != $scope.blockages.length;

	            if (dataChanged) {
	                $scope.requestClusters = data.json.requestClusters;
	                $scope.locations = data.json.locations;
	                $scope.distributionCenters = data.json.distributionCenters;
					$scope.blockages = data.json.blockages;
	                updateMap();
	            }
	        });
	    }
		
		$scope.toggleHelp = function () {
			$location.path("request_help/" + $scope.eventID);
		};

	    $scope.centerMapToLongLat = function (lat, long) {
	        if (!map) return;
	        map.setZoom(13);
	        map.panTo(new L.LatLng(lat, long));
	    };

	    $scope.toggleButtonClass = function (id) {
	        var status = $scope[id];
	        return status ? "btn btn-toggle active" : "btn btn-toggle";
	    };

	    $scope.toggleButton = function (id) {
	        $scope[id] = !$scope[id];
	        saveFilters();
	        updateMap();
	        return false;
	    };

	    $scope.toggleResourceFilter = function (filterName) {
	        var flags = $scope.filterFlags;
	        flags[filterName] = !flags[filterName];
	        saveFilters();
	        return false;
	    }

	    $scope.toggleResourceButtonClass = function (id) {
	        var flags = $scope.filterFlags;
	        var status = flags[id];
	        return status ? "btn btn-toggle active" : "btn btn-toggle";
	    };

	    $scope.toggleMatchingFilter = function (filterName) {
	        var flags = $scope.matchingFlags;
	        flags[filterName] = !flags[filterName];
	        updateMap();
	        return false;
	    }

	    $scope.toggleMatchingButtonClass = function (id) {
	        var flags = $scope.matchingFlags;
	        var status = flags[id];
	        return status ? "btn btn-toggle active" : "btn btn-toggle";
	    };

	    $scope.getCleanLocationText = function (location) {
	        return $sce.trustAsHtml($scope.buildLocationDetails(location));
	    };

	    $scope.initMap = function (newMap) {
	        map = newMap;
	        map.on("zoomend", function () {
	            updateMap();
	        });
	        map.on('click', function (e) {
	            if ($scope.showFindPanel && !$scope.showFindResults) {
					$scope.locationPref.value = "Other";
	                $scope.mappingLoc.LAT = e.latlng.lat.toFixed(3);
	                $scope.mappingLoc.LONG = e.latlng.lng.toFixed(3);
	                drawLocationMarker();
	                $scope.$digest();
	            } else if ($scope.showDeployPanel) {
					$scope.locationPref.value = "Other";
	                $scope.deployment.LAT = e.latlng.lat.toFixed(3);
	                $scope.deployment.LONG = e.latlng.lng.toFixed(3);
	                drawLocationMarker();
	                $scope.$digest();
	            } else if ($scope.showBlockagePanel) {
					$scope.locationPref.value = "Other";
					$scope.blockage.LAT = e.latlng.lat.toFixed(3);
	                $scope.blockage.LONG = e.latlng.lng.toFixed(3);
	                drawLocationMarker();
	                $scope.$digest();
				}
	        });
	        updateMap();
	    };

	    $scope.filterButtonText = function () {
	        return $scope.showFilters ? "Hide" : "Show";
	    };

	    $scope.toggleFilters = function () {
	        saveFilters();
	        $scope.showFilters = !$scope.showFilters;
	    };

	    function saveFilters() {
	        updateMap();
	        var sessionFilters = {
	            showMedical: $scope.filterFlags.showMedical,
	            showShelter: $scope.filterFlags.showShelter,
	            showFood: $scope.filterFlags.showFood,
	            showWater: $scope.filterFlags.showWater,
	            showClothing: $scope.filterFlags.showClothing,
	            showRescue: $scope.filterFlags.showRescue,
	            showEvacuation: $scope.filterFlags.showEvacuation,
	            showMedicine: $scope.filterFlags.showMedicine
	        };

	        sessionStorage.setItem("showNeedsMarkers", JSON.stringify($scope.showNeedsMarkers));
	        sessionStorage.setItem("showLocationMarkers", JSON.stringify($scope.showLocationMarkers));
	        sessionStorage.setItem("showDistCenterMarkers", JSON.stringify($scope.showDistCenterMarkers));
	        sessionStorage.setItem("showClusters", JSON.stringify($scope.showClusters));
	        sessionStorage.setItem("showHeatmap", JSON.stringify($scope.showHeatmap));
	        sessionStorage.setItem("filterFlags", JSON.stringify(sessionFilters));
	    }

	    $scope.toggleFindPanel = function () {
	        $scope.showFindPanel = !$scope.showFindPanel;
	        if ($scope.showFindPanel) {
	            $scope.showDistCenterMarkers = true;
	            requestLocation();
	        } else {
	            removeLocationMarker();
				$scope.showFindResults = false;
				delete $scope.matches;
	        }
	        updateMap();
	    };

	    $scope.toggleDeployPanel = function () {
	        $scope.showDeployPanel = !$scope.showDeployPanel;
	        if ($scope.showDeployPanel) {
	            requestLocation();
	            $scope.showDistCenterMarkers = true;
	        } else {
	            removeLocationMarker();
	        }
	        updateMap();
	    }
		
		$scope.toggleBlockagePanel = function () {
	        $scope.showBlockagePanel = !$scope.showBlockagePanel;
	        if ($scope.showBlockagePanel) {
				$scope.blockage = { EventID: $scope.eventID };
	            requestLocation();
	        } else {
				removeLocationMarker();
			}
	    }

	    function convertToRadians(degrees) {
	        return degrees * (Math.PI / 180)
	    }

	    function calculateKmDistance(lat1, lng1, lat2, lng2) {
	        var earthRadius = 6371;
	        var dLat = convertToRadians(lat2 - lat1);
	        var dLng = convertToRadians(lng2 - lng1);
	        var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(convertToRadians(lat1)) * Math.cos(convertToRadians(lat2)) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
	        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	        return earthRadius * c;
	    }

	    function matchDistributionCenters() {
	        var maxDist = 0;
	        var minDist = Number.MAX_VALUE;

	        var selectedCenters = $scope.distributionCenters.filter(function (center) {
	            if ($scope.currentOrg.OrganizationTypeID == 1) {
	                return $scope.shouldDisplayLocationMarker(center, $scope.matchingFlags)
	            }
	            else {
	                return $scope.shouldDisplayLocationMarker(center, $scope.matchingFlags) &&
                    center.OrganizationID == $scope.currentOrg.OrganizationID;
	            }
	        });

	        var centersWithCompScores = selectedCenters.map(function (center) {
	            var distance = calculateKmDistance(center.LAT, center.LONG, $scope.mappingLoc.LAT, $scope.mappingLoc.LONG);
	            if (distance >= maxDist) maxDist = distance;
	            if (distance <= minDist) minDist = distance;

	            return { center: center, dist: distance.toFixed(3) };
	        });

	        var centersWithScores = centersWithCompScores.map(function (center) {
	            var score = (center.dist - minDist) / (maxDist - minDist);
	            center.score = score;
	            return center;
	        });

	        centersWithScores.sort(function (a, b) {
	            return a.score - b.score;
	        });

	        if (centersWithScores.length > 3)
	            centersWithScores = centersWithScores.slice(0, 3);

	        $scope.hasMatches = centersWithScores.length > 0;

	        return centersWithScores;
	    }
		
		function getSelectedResourceTypes() {
			var flags = $scope.matchingFlags;
			var resourceList = [];
			if (flags.showFood) resourceList.push("Food");
			if (flags.showWater) resourceList.push("Water");
			if (flags.showShelter) resourceList.push("Shelter");
			if (flags.showClothing) resourceList.push("Clothing");
			if (flags.showRescue) resourceList.push("Rescue");
			if (flags.showEvacuation) resourceList.push("Evacuation");
			if (flags.showMedical) resourceList.push("First+Aid");
			if (flags.showMedicine) resourceList.push("Medicine");
			return resourceList.join(",");
		}

	    $scope.findMatches = function () {
	        $scope.showMappingError = false;
	        if (!$scope.mappingLoc.LAT || !$scope.mappingLoc.LONG || $scope.getMatchResources().length == 0) {
	            $scope.showMappingError = true;
	            return false;
	        }

	        //$scope.matches = matchDistributionCenters();
			var locationString = $scope.mappingLoc.LAT + "," + $scope.mappingLoc.LONG;
			var resourceTypeString = getSelectedResourceTypes();
			$scope.matchingResource.get({ loc:locationString, resources:resourceTypeString }, function (data) {
				$scope.matches = data.json;
				$scope.hasMatches = $scope.matches.length > 0;
				console.log($scope.matches[0]);
				$scope.showFindResults = true;
				updateMap();
	        });
	        
	        return false;
	    };

	    $scope.showLocation = function (lat, lng) {
	        map.setView([lat, lng], map.getZoom());
	        updateMap();
	    };

	    $scope.backToFind = function () {
			delete $scope.matches;
	        $scope.showFindResults = false;
			updateMap();
	        return false;
	    };

	    $scope.closeDeploymentPanel = function () {
	        $scope.showDeploymentPanel = false;
	    };
		
		$scope.closeBlockageDetailPanel = function () {
	        $scope.showBlockageDetailPanel = false;
	    };

	    $scope.panelIsOpen = function () {
	        return $scope.showFindPanel || $scope.showFilters || $scope.showDeployPanel || $scope.showDeploymentPanel 
				|| $scope.showBlockagePanel || $scope.showBlockageDetailPanel;
	    };

	    $scope.createDeployment = function () {
			if ($scope.locationPref.value == "Current") {
				$scope.deployment.LAT = $scope.mappingLoc.LAT;
				$scope.deployment.LONG = $scope.mappingLoc.LONG;
			}
			
			if (!$scope.deployment.LAT || !$scope.deployment.LONG) return;
			
	        var url = "create_deployment/" + $scope.eventID + "/" + $scope.deployment.LAT + "/" + $scope.deployment.LONG;
	        $location.path(url);
	    };

	    $scope.modifyDeployment = function () {
	        var url = "modify_deployment/" + $scope.deployment.ResourceLocationID;
	        $location.path(url);
	    };
		
		$scope.removeBlockage = function () {
			$scope.BlockageResource.delete({ id: $scope.blockage.BlockageID });
			$scope.closeBlockageDetailPanel();
		};
		
		$scope.reportBlockage = function () {
			if ($scope.locationPref.value == "Current") {
				$scope.blockage.LAT = $scope.mappingLoc.LAT;
				$scope.blockage.LONG = $scope.mappingLoc.LONG;
			}
			
			if (!$scope.blockage.LAT || !$scope.blockage.LAT) {
				return;
			}
			
			var newBlockage = new $scope.BlockageResource($scope.blockage);
			
			newBlockage.$save()
				.then(function(res) {
					$scope.toggleBlockagePanel();
				})
				.catch(function(req) {
					alert(req.data.err);
				});
		};

	    $scope.setCurrentView("org-event");
	}]);

