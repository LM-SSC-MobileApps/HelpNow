angular.module("helpNow").controller("InventoryCtrl", ["$scope", "$http", "$routeParams", "ResourceLocation", "ResourceLocationInventory", "$resource", "$uibModal", function ($scope, $http, $routeParams, ResourceLocation, ResourceLocationInventory, $resource, $uibModal) {

    var map;
    var mapLayers = [];

    $scope.setTitle("Inventory Management");

    $scope.setCurrentView("inventory");

    $scope.resourceLocationResource = $resource("/api/resourcelocation/organization/:orgid", { orgid: '@orgid' });
    $scope.currentResourceLocation = new ResourceLocation();

    $scope.currentResourceLocationInventory = new ResourceLocationInventory();


    //$scope.userOrgID = 1;
   

    $scope.overlayRadius = 250;
    $scope.radiusRawVal = 0.25;
    $scope.sliderLabel = "0.25 km";
    $scope.isMetric = true;

    $scope.showResourceLocations = true;
    $scope.showNewForm = false;
    $scope.showTransportationOptions = false;
    $scope.showResourceLocation = false;

    $scope.showAir = false;
    $scope.showGround = false;
    $scope.showWater = false;

    loadResourceLocations();

    $scope.$on("ResourceLocationDataLoaded", function () {
        $scope.showResourceLocations = true;
        updateMap();
    });

    function loadResourceLocations() {
        
        if ($scope.currentUser != null)
        {
            $scope.resourceLocationResource.get({ orgid: $scope.currentUser.OrganizationID }, function (data) {
                $scope.resourceLocations = data.json;
                $scope.$broadcast("ResourceLocationDataLoaded", {});
            });
        }
        else {
            $scope.showResourceLocations = false;
            updateMap();
        }
        
    }

    function updateMap() {
        if (!map || !$scope.resourceLocations) return;

        for (var i = 0; i < mapLayers.length; i++) {
            var layer = mapLayers[i];
            map.removeLayer(layer);
        }

        mapLayers = [];

        buildInventoryMarkers(mapLayers);
    

        angular.forEach(mapLayers, function (layer) {
            map.addLayer(layer);
        });
    }

    function buildInventoryMarkers(mapLayers) {  
        angular.forEach($scope.resourceLocations, function (location) {
            var locationIcon = L.icon({
                iconUrl: "style/images/resources.png",
                iconSize: [60, 60],
                iconAnchor: [30, 30]
            });

            var marker = buildInventoryMarker(location, locationIcon);
            mapLayers.push(marker);
        });
    }

    

    function buildInventoryMarker(location, icon) {

        var marker = L.marker([location.LAT, location.LONG], { icon: icon });
        marker.id = location.ResourceLocationID;
        marker.bindPopup(buildInventoryLocationDetails(location));
        //.on('click', function () {
        //    alert('this is it!');
        //    $scope.resourceLocationClick(location.LAT, location.LONG, location.ResourceLocationID)
        //});
        return marker;
    }

    function buildInventoryLocationDetails(location) {
        var popupText = "<strong>" + location.Description + "</strong><br/>" +
			location.PrimaryPOCPhone + "<hr/>";
        if (typeof location.ResourceLocationInventories != 'undefined')
        {
            location.ResourceLocationInventories.forEach(function (inventory) {
                popupText += inventory.ResourceType.Description + ": " + inventory.Quantity + " " +
                    inventory.ResourceTypeUnitOfMeasure.Description + "<br/>";
            });
        }
        
        return popupText;
    }

    $scope.initMap = function (newMap) {
        map = newMap;
        //map.on('click', function (e) {
        //    if ($scope.locationPref.value == "Other") {
        //        if ($scope.locationOutline !== undefined) {
        //            map.removeLayer($scope.locationOutline);
        //        }
        //        $scope.locationOutline = L.circle(e.latlng, $scope.overlayRadius).addTo(map);
        //        $scope.helpRequest.LAT = e.latlng.lat.toFixed(3);
        //        $scope.helpRequest.LONG = e.latlng.lng.toFixed(3);
        //        $scope.$digest();
        //    }
        //});
        updateMap();
    };

    $scope.centerMapToLongLat = function (lat, long) {
        if (!map) return;
        map.setZoom(12);
        map.panTo(new L.LatLng(lat, long));
    };

    $scope.resourceLocationClick = function (lat, long, resourceLocID) {
        if (!map) return;
        $scope.centerMapToLongLat(lat, long);
        $scope.setCurrentResourceLocationByID(resourceLocID);
        $scope.showLocation();
    };
    

    $scope.setCurrentResourceLocationByID = function (id) {
        $scope.resourceLocations.forEach(function (resLoc)
        {
            if (resLoc.ResourceLocationID == id)
            {
                $scope.currentResourceLocation = resLoc;
            }
        });
    }

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
        $scope.showResourceLocations = !$scope.showResourceLocations;
        return false;
    };

    $scope.showTransportation = function () {
        $scope.showTransportationOptions = !$scope.showTransportationOptions;
        $scope.showNewForm = !$scope.showNewForm;
        return false;
    };

    $scope.showLocation = function () {
        $scope.showResourceLocations = !$scope.showResourceLocations;
        $scope.showResourceLocation = !$scope.showResourceLocation;
        return false;
    };

    $scope.deleteInventoryItem = function () {
        alert("Coming Soon - In Developement");
        return false;
    };

    $scope.$on("ResourceLocationInventoryDeleted", function (event, args) {
        var index = $scope.currentResourceLocation.ResourceLocationInventories.map(function (el) {
            return el.ResourceLocationInventoryID;
        }).indexOf(args.id);
        $scope.currentResourceLocation.ResourceLocationInventories.splice(index, 1);
    });

    $scope.modalDeleteResourceLocationInventory = function (resourcelocationinventory) {
        $scope.currentResourceLocationInventory = resourcelocationinventory;
        $scope.modalInstance = $uibModal.open(
            {
                templateUrl: '/inventory/resource-inventory-modal-delete.html',
                scope: $scope,
                size: 'med'
            });
    };

    $scope.deleteResourceLocationInventory = function () {
        console.log("$scope.currentResourceLocationInventory.ResourceLocationInventoryID: " + $scope.currentResourceLocationInventory.ResourceLocationInventoryID);
        ResourceLocationInventory.delete({ id: $scope.currentResourceLocationInventory.ResourceLocationInventoryID });
        $scope.$broadcast("ResourceLocationInventoryDeleted", { id: $scope.currentResourceLocationInventory.ResourceLocationInventoryID });
    };

    

    $scope.saveResourceLocation = function () {
        alert("Coming Soon - In Developement");
        $scope.showTransportationOptions = !$scope.showTransportationOptions;
        $scope.showResourceLocations = !$scope.showResourceLocations;
        return false;
    };

    $scope.deleteResourceLocation = function () {
        $scope.showTransportationOptions = !$scope.showTransportationOptions;
        $scope.showResourceLocations = !$scope.showResourceLocations;
        return false;
    };

    $scope.comingSoon = function () {
        alert("Coming Soon - In Developement");
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