angular.module("helpNow").controller("DeploymentCtrl", ["$scope", "$routeParams", "$resource", "$sce", "$location", "$http",
	function ($scope, $routeParams, $resource, $sce, $location, $http) {

	    $scope.showDistributionCenters = false;

	    $scope.deploymentsResource = $resource("/api/resourcelocation/:id");
	    $scope.distCenterResource = $resource("/api/resourcelocation/dist-center/all");

	    $scope.setTitle("Resource Deployment", "style/images/Distribution-Center.png");

	    $scope.distCenterResource.get({}, function (data) {
	        var centers = data.json;
	        centers = centers.filter(function (center) {
	            return center.OrganizationID == $scope.currentOrg.OrganizationID;
	        });
	        $scope.distCenters = centers;
	    });

	    if ($routeParams.locationID) {
	        $scope.deployment = {};
	        $scope.deploymentsResource.get({ id: $routeParams.locationID }, function (data) {
	            var deployment = data.json[0];
	            deployment.ResourceLocationStatusID = deployment.ResourceLocationStatusID + "";
	            $scope.deployment = deployment;
	            if ($scope.events) {
	                $scope.event = $scope.getEvent($scope.deployment.EventID);
	            }
	        });
	    } else {
	        $scope.deployment = {
	            EventID: $routeParams.eventID,
	            LAT: $routeParams.lat,
	            LONG: $routeParams.long,
	            ResourceLocationTypeID: 2,
	            OrganizationID: $scope.currentOrg.OrganizationID,
	            ResourceLocationStatusID: "1",
	            ResourceLocationTransports: [],
	            ResourceLocationInventories: []
	        };
	    }

	    if ($scope.events) {
	        $scope.event = $scope.getEvent($scope.deployment.EventID);
	    }

	    $scope.$on("EventDataLoaded", function () {
	        $scope.event = $scope.getEvent($scope.deployment.EventID);
	    });

	    $scope.cancel = function () {
	        var url = "org_event/" + $scope.deployment.EventID;
	        $location.path(url);
	    };

	    $scope.removeInventory = function (resource) {
	        var request = $http({
	            method: 'DELETE',
	            url: '/api/resourcelocationinventory/' + resource.ResourceLocationInventoryID,
	            async: true,
	            headers: {
	                'Content-Type': 'application/json'
	            }
	        });

	        request.then(
                function successCallback(response) {
                    var resources = $scope.deployment.ResourceLocationInventories;
                    var index = 0;
                    for (var i = 0; i < resources.length; i++) {
                        var currentResource = resources[i];
                        if (resource.ResourceLocationInventoryID == currentResource.ResourceLocationInventoryID) {
                            index = i;
                            break;
                        }
                    }
                    $scope.deployment.ResourceLocationInventories.splice(index, 1);
                },
                function errorCallback(response) {
                    alert(response.data.err);
                }
            );
	    };

	    function createDeployment() {
	        var deploymentData = JSON.stringify($scope.deployment);
	        var request = $http({
	            method: 'POST',
	            url: '/api/resourcelocation',
	            async: true,
	            headers: {
	                'Content-Type': 'application/json'
	            },
	            data: deploymentData
	        });

	        request.then(
                function successCallback(response) {
                    $scope.deployment.ResourceLocationID = response.data.json.ResourceLocationID;
                },
                function errorCallback(response) {
                    alert(response.data.err);
                }
            );
	    }

	    function updateDeployment() {
	        var deploymentData = JSON.stringify($scope.deployment);
	        var request = $http({
	            method: 'PUT',
	            url: '/api/resourcelocation/' + $scope.deployment.ResourceLocationID,
	            async: true,
	            headers: {
	                'Content-Type': 'application/json'
	            },
	            data: deploymentData
	        });

	        request.then(
                function successCallback(response) {
                    //alert("success");
                },
                function errorCallback(response) {
                    console.log(response);
                    alert("error: " + response.data.err);
                }
            );
	    }

	    $scope.saveDeployment = function () {
	        if ($scope.deployment.ResourceLocationID) {
	            updateDeployment();
	        } else {
	            createDeployment();
	        }
	    };

	    $scope.addResources = function (inventory) {
	        alert("Test1");
	        delete inventory.ResourceLocationInventoryID;
	        inventory.SourceLocationID = inventory.ResourceLocationID;
	        inventory.ResourceLocationID = $scope.deployment.ResourceLocationID;
	        var inventoryData = JSON.stringify(inventory);
	        //alert(inventoryData);
	        var request = $http({
	            method: 'POST',
	            url: '/api/resourcelocationinventory',
	            async: true,
	            headers: {
	                'Content-Type': 'application/json'
	            },
	            data: inventoryData
	        });

	        request.then(
                function successCallback(response) {
                    inventory.ResourceLocationInventoryID = response.data.json.ResourceLocationInventoryID;
                    alert(JSON.stringify($scope.deployment));
                    $scope.deployment.ResourceLocationInventories.push(inventory);
                    alert("Test2");
                    $scope.showDistributionCenters = false;
                },
                function errorCallback(response) {
                    console.log(response.data);
                    alert("error: " + response.data.err);
                }
            );
	    };

	    $scope.getResourceIcon = function (inventory) {
	        var resourceType = inventory.ResourceType.Description;

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

	    $scope.toggleDistributionCenters = function () {
	        $scope.showDistributionCenters = !$scope.showDistributionCenters;
	    }
	}]);