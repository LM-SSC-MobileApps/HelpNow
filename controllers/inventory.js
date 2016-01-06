angular.module("helpNow").controller("InventoryCtrl", ["$scope", "$http", "$routeParams", "ResourceLocation", "ResourceLocationInventory", "ResourceLocationTransport", "$resource", "$uibModal", function ($scope, $http, $routeParams, ResourceLocation, ResourceLocationInventory, ResourceLocationTransport, $resource, $uibModal) {

    var map;
    var mapLayers = [];
  
    $scope.setTitle("Inventory Management");

    $scope.setCurrentView("inventory");

    $scope.resourceLocationResource = $resource("/api/resourcelocation/dist-center/organization/:orgid", { orgid: '@orgid' });

    $scope.locationTypeResource = $resource("/api/resourcelocationtype/", {});

    $scope.locationStatusResource = $resource("/api/resourcelocationstatus/", {});

    $scope.transportTypeResource = $resource("/api/transporttype/", {});

    $scope.resourceTypeResource = $resource("/api/resourcetype/", {});

    $scope.resourceTypeUnitOfMeasureResource = $resource("/api/resourcetypeunitofmeasure/", {});

    $scope.currentResourceLocation = new ResourceLocation();

    $scope.currentResourceLocationInventory = new ResourceLocationInventory();
    
    $scope.transportTypes = [];


    //$scope.userOrgID = 1;
   

    $scope.overlayRadius = 250;
    $scope.radiusRawVal = 0.25;
    $scope.sliderLabel = "0.25 km";
    $scope.isMetric = true;

    $scope.showResourceLocations = true;
    $scope.showLocationForm = false;
    $scope.showTransportationOptionsForm = false;
    $scope.showResourceLocation = false;
    $scope.showResourceTypes = false;
    $scope.editMode = false;

    $scope.showAir = false;
    $scope.showGround = false;
    $scope.showWater = false;

    $scope.resourcesFiltered = false;
    $scope.resourceLocationInventoryEdit = false;

    loadTransportTypes();
    loadResourceLocationTypes();
    loadResourceLocationStatuses();
    loadResourceLocations();
    loadResourceTypes();
    loadResourceTypeUnitOfMeasures();

    $scope.$on("ResourceLocationDataLoaded", function () {
        $scope.showLocationsDiv();
        updateMap();
    });


    function loadResourceLocations() {
        
        if ($scope.currentUser !== null)
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

    function loadResourceLocationTypes() {
        $scope.locationTypeResource.get({}, function (data) {
            $scope.resourceLocationTypes = data.json;
        });
    }

    function loadResourceLocationStatuses() {
        $scope.locationStatusResource.get({}, function (data) {
            $scope.resourceLocationStatuses = data.json;
        });
    }

    function loadTransportTypes() {
        $scope.transportTypeResource.get({}, function (data) {
            $scope.transportTypes = data.json;
        });
    }

    function loadResourceTypes() {
        $scope.resourceTypeResource.get({}, function (data) {
            $scope.resourceTypes = data.json;
        });
    }

    function loadResourceTypeUnitOfMeasures() {
        $scope.resourceTypeUnitOfMeasureResource.get({}, function (data) {
            $scope.resourceTypeUnitOfMeasures = data.json;
        });
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
                iconUrl: "style/images/Resources-Box-Blue.png",
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
        map.on('click', function (e) {
            if ($scope.locationPref.value == "Other") {
                if ($scope.locationOutline !== undefined) {
                    map.removeLayer($scope.locationOutline);
                }
                $scope.locationOutline = L.circle(e.latlng, $scope.overlayRadius, { color: "#00ff00", opacity: 1, fillOpacity: 0.7 }).addTo(map);
                $scope.currentResourceLocation.LAT = e.latlng.lat.toFixed(3);
                $scope.currentResourceLocation.LONG = e.latlng.lng.toFixed(3);
                $scope.$digest();
            }
        });
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
        $scope.showResourceLocationDiv();
    };
    

    /********************************* DATA FUNCTIONS ****************************************************/

    $scope.setCurrentResourceLocationByID = function (id) {
        $scope.resourceLocations.forEach(function (resLoc) {
            if (resLoc.ResourceLocationID == id) {
                $scope.currentResourceLocation = resLoc;
            }
        });
    };

    $scope.setTransportationType = function (transportTypeID) {
        var index = $scope.currentResourceLocation.ResourceLocationTransports.map(function (el) {
            return el.TransportTypeID;
        }).indexOf(transportTypeID);
        //alert('Transport count before: ' + $scope.currentResourceLocation.ResourceLocationTransports.length + ' and index: '+index);
        if (index != -1)
        {
            $scope.currentResourceLocation.ResourceLocationTransports.splice(index, 1);
        }
        else
        {
            var resLocType = new ResourceLocationTransport();
            resLocType.TransportTypeID = transportTypeID;
            resLocType.ResourceLocationID = $scope.currentResourceLocation.ResourceLocationID;
            $scope.currentResourceLocation.ResourceLocationTransports.push(resLocType);
        }
        //alert('Transport count: ' + $scope.currentResourceLocation.ResourceLocationTransports.length);
        return false;
    };

    $scope.setResourceLocationType = function (resourceLocationType) {
        $scope.currentResourceLocation.ResourceLocationType = resourceLocationType;
        $scope.currentResourceLocation.ResourceLocationTypeID = resourceLocationType.ResourceLocationTypeID;
        return false;
    };

    $scope.setDefaultResourceLocationType = function () {
        var index = $scope.resourceLocationTypes.map(function (el) {
            return el.Description;
        }).indexOf("Distribution Center");

        return $scope.resourceLocationTypes[index];
    };

    $scope.setDefaultResourceLocationStatus = function () {
        var index = $scope.resourceLocationStatuses.map(function (el) {
            return el.Status;
        }).indexOf("Active");

        return $scope.resourceLocationStatuses[index];
    };

    



    /********************************* UI FUNCTIONS ****************************************************/
    $scope.showNewEditForm = function (id) {
        //reset the transport icons
        $scope.showAir = false;
        $scope.showGround = false;
        $scope.showWater = false;

        if (!id)
        {
            //new ResourceLocation mode
            $scope.editMode = false;
            var newResLoc = new ResourceLocation();
            newResLoc.ResourceLocationTransports = [];
            newResLoc.OrganizationID = $scope.currentUser.OrganizationID;
            //We default each new location to Distribution Center as Inventory is only for Distribution Center Management.
            var defaultResLocType = $scope.setDefaultResourceLocationType();
            newResLoc.ResourceLocationType = defaultResLocType;
            newResLoc.ResourceLocationTypeID = defaultResLocType.ResourceLocationTypeID;
            //We default each new lcoation to Active Status
            var defaultResLocStatus = $scope.setDefaultResourceLocationStatus();
            newResLoc.ResourceLocationStatus = defaultResLocStatus;
            newResLoc.ResourceLocationStatusID = defaultResLocStatus.ResourceLocationStatusID;

            $scope.currentResourceLocation = newResLoc;
        }
        else
        {
            //edit mode
            $scope.editMode = true;
            var index = $scope.resourceLocations.map(function (el) {
                return el.ResourceLocationID;
            }).indexOf(id);
            $scope.currentResourceLocation = $scope.resourceLocations[index];

            //set the transport icons
            $scope.currentResourceLocation.ResourceLocationTransports.forEach(function (transport) {
                var transportTypeIdx = $scope.transportTypes.map(function (object) {
                    return object.TransportTypeID;
                }).indexOf(transport.TransportTypeID);
                var transportType = $scope.transportTypes[transportTypeIdx];
                if (transportType.Description == "Ground") {
                    $scope.showGround = true;
                }
                else if (transportType.Description == "Air") {
                    $scope.showAir = true;
                }
                else if (transportType.Description == "Water") {
                    $scope.showWater = true;
                }
            });
            
        }
        $scope.showLocationDiv();
        return false;
    };

    $scope.showLocationDiv = function () {
        $scope.showLocationForm = true;
        $scope.showResourceLocation = false;
        $scope.showResourceLocations = false;
        $scope.showTransportationOptionsForm = false;
        $scope.showResourceTypes = false;
        return false;
    };

    $scope.showTransportationDiv = function () {
        $scope.showLocationForm = false;
        $scope.showResourceLocation = false;
        $scope.showResourceLocations = false;
        $scope.showTransportationOptionsForm = true;
        $scope.showResourceTypes = false;
        return false;
    };

    $scope.showLocationsDiv = function () {
        $scope.showLocationForm = false;
        $scope.showResourceLocation = false;
        $scope.showResourceLocations = true;
        $scope.showTransportationOptionsForm = false;
        $scope.showResourceTypes = false;
        return false;
    };

    $scope.showResourceLocationDiv = function () {
        $scope.showLocationForm = false;
        $scope.showResourceLocations = false;
        $scope.showResourceLocation = true;
        $scope.showTransportationOptionsForm = false;
        $scope.showResourceTypes = false;
        return false;
    };

    $scope.showResourceTypesDiv = function () {
        
        $scope.showLocationForm = false;
        $scope.showResourceLocations = false;
        $scope.showResourceLocation = false;
        $scope.showTransportationOptionsForm = false;
        $scope.showResourceTypes = true;
        return false;
    };

    $scope.showTransport = function (transport) {
        if (transport == "Ground") {
            return $scope.showGround;
        }
        else if (transport == "Air") {
            return $scope.showAir;
        }
        else if (transport == "Water") {
            return $scope.showWater;
        }
        else {
            return false;
        }
    };

    $scope.showTransparentTransport = function (transport) {
        if (transport == "Ground") {
            return !$scope.showGround;
        }
        else if (transport == "Air") {
            return !$scope.showAir;
        }
        else if (transport == "Water") {
            return !$scope.showWater;
        }
        else {
            return false;
        }
    };

    $scope.toggleTransport = function (transportTypeID) {
        var transportTypeIdx = $scope.transportTypes.map(function (object) {
            return object.TransportTypeID;
        }).indexOf(transportTypeID);
        var transportType = $scope.transportTypes[transportTypeIdx];
        if (transportType.Description == "Ground") {
            $scope.showGround = !$scope.showGround;
            $scope.setTransportationType(transportTypeID);
        }
        else if (transportType.Description == "Air") {
            $scope.showAir = !$scope.showAir;
            $scope.setTransportationType(transportTypeID);
        }
        else if (transportType.Description == "Water") {
            $scope.showWater = !$scope.showWater;
            $scope.setTransportationType(transportTypeID);
        }
        return false;
    };

    $scope.showResourceLocationInventoryEditForm = function (inventory) {
        $scope.currentResourceLocationInventory = inventory;
        $scope.resourceLocationInventoryEdit = true;

        $scope.showResourceTypesDiv();
        $scope.setResourceLocationInventoryType(inventory.ResourceType);

        return false;
    };

    $scope.showResourceLocationInventoryNewForm = function () {
        $scope.resourceLocationInventoryEdit = false;

        $scope.resourcesFiltered = false;
        $scope.resourceTypesFiltered = $scope.resourceTypes;
        var resLocInv = new ResourceLocationInventory();
        resLocInv.ResourceLocationID = $scope.currentResourceLocation.ResourceLocationID;
        $scope.currentResourceLocationInventory = resLocInv;

        $scope.showResourceTypesDiv();
       
        return false;
    };

    $scope.setResourceLocationInventoryType = function (resourceType) {
        $scope.resourcesFiltered = true;
        $scope.currentResourceLocationInventory.ResourceTypeID = resourceType.ResourceTypeID;
        $scope.currentResourceLocationInventory.ResourceType = resourceType;

        $scope.resourceTypesFiltered = $scope.resourceTypes.filter(function (el) {
            return el.ResourceTypeID == resourceType.ResourceTypeID;
        });

        $scope.resourceTypeUnitOfMeasuresFiltered = $scope.resourceTypeUnitOfMeasures.filter(function (el) {
            return el.ResourceTypeID == resourceType.ResourceTypeID;
        });

        var uom = $scope.currentResourceLocationInventory.ResourceTypeUnitOfMeasure;
        if (uom)
        {
            $scope.setResourceTypeUnitOfMeasure(uom);
        }
        else
        {
            $scope.setResourceTypeUnitOfMeasure($scope.resourceTypeUnitOfMeasuresFiltered[0]);
        }
        
        return false;
    };

    $scope.clearResourceTypeFiltered = function () {
        $scope.resourcesFiltered = false;
        $scope.resourceTypesFiltered = $scope.resourceTypes;
    };

    $scope.setResourceTypeUnitOfMeasure = function (resourceTypeUOM) {
        $scope.currentResourceTypeUnitOfMeasure = resourceTypeUOM;
        $scope.currentResourceLocationInventory.ResourceTypeUnitOfMeasureID = resourceTypeUOM.ResourceTypeUnitOfMeasureID;
        $scope.currentResourceLocationInventory.ResourceTypeUnitOfMeasure = resourceTypeUOM;
    };


    /********************************* DELETE FUNCTIONS ****************************************************/

    $scope.modalDeleteResourceLocationInventory = function () {
        $scope.modalInstance = $uibModal.open(
            {
                templateUrl: '/inventory/resource-inventory-modal-delete.html',
                scope: $scope,
                size: 'med'
            });
    };


    $scope.deleteResourceLocationInventory = function () {
        ResourceLocationInventory.delete({ id: $scope.currentResourceLocationInventory.ResourceLocationInventoryID })
        .$promise.then(function (value) {
            var index = $scope.currentResourceLocation.ResourceLocationInventories.map(function (el) {
                return el.ResourceLocationInventoryID;
            }).indexOf($scope.currentResourceLocationInventory.ResourceLocationInventoryID);
            $scope.currentResourceLocation.ResourceLocationInventories.splice(index, 1);

            $scope.showResourceLocationDiv();
        });
    };

    $scope.modalDeleteResourceLocation = function () {
        $scope.modalInstance = $uibModal.open(
            {
                templateUrl: '/inventory/resource-location-modal-delete.html',
                scope: $scope,
                size: 'med'
            });
    };

    $scope.deleteResourceLocation = function () {
        ResourceLocation.delete({ id: $scope.currentResourceLocation.ResourceLocationID })
            .$promise.then(function (value) {
                var index = $scope.resourceLocations.map(function (el) {
                    return el.ResourceLocationID;
                }).indexOf($scope.currentResourceLocation.ResourceLocationID);
                $scope.resourceLocations.splice(index, 1);
                $scope.currentResourceLocation = new ResourceLocation();
                $scope.showLocationsDiv();
                updateMap();
            });
    };

    
    /********************************* SAVE FUNCTIONS ****************************************************/

    $scope.saveResourceLocation = function () {
        if ($scope.editMode)
        {
            $scope.updateResourceLocation();
        }
        else
        {
            $scope.saveNewResourceLocation();
        }
        return false;
    };

    $scope.saveNewResourceLocation = function () {
        ResourceLocation.save($scope.currentResourceLocation)
            .$promise.then(function (value) {
                loadResourceLocations();
            });
    };

    $scope.updateResourceLocation = function () {
        ResourceLocation.update({ id: $scope.currentResourceLocation.ResourceLocationID }, $scope.currentResourceLocation)
            .$promise.then(function(value)
            {
                loadResourceLocations();
            });
    };

    $scope.saveResourceLocationInventory = function () {
        if ($scope.resourceLocationInventoryEdit) {
            $scope.updateResourceLocationInventory();
        }
        else {
            $scope.saveNewResourceLocationInventory();
        }
        return false;
    };

    $scope.saveNewResourceLocationInventory = function () {
        ResourceLocationInventory.save($scope.currentResourceLocationInventory)
            .$promise.then(function (value) {
                $scope.currentResourceLocation.ResourceLocationInventories.push($scope.currentResourceLocationInventory);
                //$scope.currentResourceLocationInventory = new ResourceLocationInventory();
                $scope.showResourceLocationDiv();
            });
        return false;
    };

    $scope.updateResourceLocationInventory = function () {
        ResourceLocationInventory.update({ id: $scope.currentResourceLocationInventory.ResourceLocationInventoryID }, $scope.currentResourceLocationInventory)
            .$promise.then(function (value) {
                //$scope.currentResourceLocationInventory = new ResourceLocationInventory();
                $scope.showResourceLocationDiv();
            });
        return false;
    };


    /********************************* VALIDATE FUNCTIONS ****************************************************/
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