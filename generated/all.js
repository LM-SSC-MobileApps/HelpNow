angular.module("helpNow", ["ngRoute", "ngResource", "ui.bootstrap", "ngSanitize", "ngCookies" ])
	.config(["$routeProvider", function ($routeProvider) {
	    $routeProvider.when("/ind_login", {
	        templateUrl: "views/ind-login.html"
	    });

		$routeProvider.when("/login", {
			templateUrl: "views/login.html"
		});

		$routeProvider.when("/about", {
		    templateUrl: "views/about.html"
		});

		$routeProvider.when("/new_event/:eventID", {
		    templateUrl: "views/manage/new-event.html"
		});

		$routeProvider.when("/new_map_layer/:eventID/:mapLayerID", {
		    templateUrl: "views/manage/new-map-layer.html"
		});
		
		$routeProvider.when("/events", {
			templateUrl: "views/events.html"
		});
		
		$routeProvider.when("/event_map/:eventID", {
			templateUrl: "views/event-map.html"
		});
		
		$routeProvider.when("/request_help/:eventID", {
			templateUrl: "views/event-map.html"
		});

		$routeProvider.when("/inventory", {
		    templateUrl: "views/inventory/inventory.html"
		});
		
		$routeProvider.when("/gov_login", {
			templateUrl: "views/gov-login.html"
		});
		
		$routeProvider.when("/org_event/:eventID", {
			templateUrl: "views/org-event.html"
		});
		
		$routeProvider.when("/create_deployment/:eventID/:lat/:long", {
			templateUrl: "views/deployment.html"
		});
		
		$routeProvider.when("/modify_deployment/:locationID", {
			templateUrl: "views/deployment.html"
		});
		
		$routeProvider.when("/events", {
			templateUrl: "views/events.html"
		});

		$routeProvider.when("/manage_events", {
		    templateUrl: "views/manage/manage-events.html"
		});

		$routeProvider.when("/manage_map_layers", {
		    templateUrl: "views/manage/manage-map-layers.html"
		});

		$routeProvider.when("/administration/", {
		    templateUrl: "views/admin/administration.html"
		});

		$routeProvider.when("/add_org/:orgTypeID/:orgID", {
		    templateUrl: "views/admin/add-organization.html"
		});

		$routeProvider.when("/org_address/:orgID", {
		    templateUrl: "views/manage/org-address.html"
		});

		$routeProvider.when("/manage/", {
			templateUrl: "views/manage/manage.html"
		});

		$routeProvider.when("/tomnod", {
		    templateUrl: "views/manage/tomnod.html"
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

		$routeProvider.when("/assign_poc/", {
			templateUrl: "views/manage/assign-poc.html"
		});

		$routeProvider.when("/reg_account/:inviteID", {
		    templateUrl: "views/reg-account.html"
		});

		$routeProvider.when("/password_reset/:accountID/:guid", {
		    templateUrl: "views/manage/password-reset.html"
		});

		$routeProvider.when("/forgot_password/", {
		    templateUrl: "views/manage/forgot-password.html"
		});

		$routeProvider.when("/demo/", {
			templateUrl: "views/manage/demo.html"
		});
		
		$routeProvider.otherwise({
			templateUrl: "views/events.html"
		});
	}]);
angular.module("helpNow").controller("AboutCtrl", ["$scope", "$http", "$location", "$routeParams", "$resource", function ($scope, $http, $location, $routeParams, $resource) {
    $scope.setCurrentView("about");
    $scope.setTitle($scope.text.about_title);

    $scope.getCurrentLanguage();
    if ($scope.currentLanguage == 'Eng') $scope.isEnglish = true;
}]);
angular.module("helpNow").controller("AdministrationCtrl", ["$scope", "$location", "$resource", "Organization", "$uibModal", function ($scope, $location, $resource, Organization, $uibModal) {
    $scope.setTitle($scope.text.admin_title);

    $scope.governmentResource = $resource("/api/organization/type/:id",
			{ id: 1 });
    $scope.organizationResource = $resource("/api/organization/type/:id",
			{ id: 2 });

    $scope.loadGovernments = function () {
        $scope.governmentResource.get({}, function (data) {
            $scope.governmentList = data.json;
            $scope.$broadcast("GovernmentDataLoaded", {});
        });
    };

    $scope.loadOrganizations = function () {
        $scope.organizationResource.get({}, function (data) {
            angular.module("helpNow").controller("AdministrationCtrl", ["$scope", "$location", "$resource", "Organization", "$uibModal", function ($scope, $location, $resource, Organization, $uibModal) {
                $scope.setTitle($scope.text.admin_title);

                $scope.governmentResource = $resource("/api/organization/type/:id",
                        { id: 1 });
                $scope.organizationResource = $resource("/api/organization/type/:id",
                        { id: 2 });

                $scope.loadGovernments = function () {
                    $scope.governmentResource.get({}, function (data) {
                        $scope.governmentList = data.json;
                        $scope.$broadcast("GovernmentDataLoaded", {});
                    });
                };

                $scope.loadOrganizations = function () {
                    $scope.organizationResource.get({}, function (data) {
                        $scope.organizationList = data.json;
                        $scope.$broadcast("OrganizationDataLoaded", {});
                    });
                };

                $scope.loadGovernments();
                $scope.loadOrganizations();

                $scope.manage = function (org) {
                    $scope.setCurrentOrg(org);
                    $location.path('/manage');
                };

                $scope.addOrg = function (org) {
                    $scope.modalInstance = $uibModal.open(
                            {
                                templateUrl: '/admin/admin-modal-add-org.html',
                                controller: function ($scope) {
                                    this.org = org;
                                    this.orgType = org.OrganizationTypeID == 1 ? "government" : "organization";
                                    this.Organization = Organization;

                                    $scope.addOrg = function (org) {
                                        Organization.save(org);
                                        $location.path("/administration");
                                    };
                                },
                                controllerAs: "model"
                            });
                };

                $scope.removeOrg = function (org) {
                    $scope.modalInstance = $uibModal.open(
                            {
                                templateUrl: '/admin/admin-modal-remove.html',
                                controller: function ($scope) {
                                    this.org = org;
                                    this.orgType = org.OrganizationTypeID == 1 ? "government" : "organization";
                                    this.Organization = Organization;

                                    $scope.removeOrg = function (org) {
                                        Organization.delete({ id: org.OrganizationID });
                                        $location.path("/administration");
                                    };
                                },
                                controllerAs: "model"
                            });
                };
            }]);
            $scope.organizationList = data.json;
            $scope.$broadcast("OrganizationDataLoaded", {});
        });
    };

    $scope.loadGovernments();
    $scope.loadOrganizations();

    $scope.manage = function (org) {
        $scope.setCurrentOrg(org);
        $location.path('/manage');
    };

    $scope.addOrg = function (org) {
        $scope.modalInstance = $uibModal.open(
				{
				    templateUrl: '/admin/admin-modal-add-org.html',
				    controller: function ($scope) {
				        this.org = org;
				        this.orgType = org.OrganizationTypeID == 1 ? "government" : "organization";
				        this.Organization = Organization;

				        $scope.addOrg = function (org) {
				            Organization.save(org);
				            $location.path("/administration");
				        };
				    },
				    controllerAs: "model"
				});
    };

    $scope.removeOrg = function (org) {
        $scope.modalInstance = $uibModal.open(
				{
				    templateUrl: '/admin/admin-modal-remove.html',
				    controller: function ($scope) {
				        this.org = org;
				        this.orgType = org.OrganizationTypeID == 1 ? "government" : "organization";
				        this.Organization = Organization;

				        $scope.removeOrg = function (org) {
				            Organization.delete({ id: org.OrganizationID });
				            $location.path("/administration");
				        };
				    },
				    controllerAs: "model"
				});
    };
}]);
/**
 * AssignPocCtrl
 */

angular.module("helpNow").controller("AssignPocCtrl", ["$scope", "$resource", "$routeParams", "Organization", "$location", "$uibModal",
    function ($scope, $resource, $routeParams, Organization, $location, $uibModal) {


        $scope.teamResource = $resource("/api/account/organizationmembers/:accountid",
            {accountid: $scope.currentUser.AccountID});


        $scope.loadTeam = function () {
            $scope.teamResource.get({}, function (data) {
                $scope.team = data.json;
                $scope.$broadcast("TeamDataLoaded", {});
            });
        };

        $scope.loadTeam();


        $scope.orgResource = $resource("/api/organization/:id",
            {id: $scope.currentOrg.OrganizationID});


        $scope.loadOrg = function () {
            $scope.orgResource.get({}, function (data) {
                orgs = data.json;
                $scope.org = orgs[0];
                console.log("org.PrimaryPOC: " + $scope.org.PrimaryPOC);
                $scope.$broadcast("OrgDataLoaded", {});
            });
        };

        $scope.loadOrg();


        $scope.updateOrg = function (org) {
            Organization.update({id: $scope.currentOrg.OrganizationID}, org);
            $scope.modalInstance = $uibModal.open(
                {
                    templateUrl: '/manage/team-poc-modal-confirm.html',
                    scope: $scope,
                    controller: function ($scope) {
                        this.text = $scope.text;

                        $scope.confirm = function () {
                            $location.path("/manage");
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
 * DemoCtrl
 */

angular.module("helpNow").controller("DemoCtrl", ["$scope", "$http", "ResourceRequest", "$location", "ResourceLocation",
    function ($scope, $http, ResourceRequest, $location, ResourceLocation) {

		$scope.setTitle("Organization Management");
		$scope.setCurrentView("mng");
        $scope.demoRunning = false;

        $scope.go = function (path) {
            $location.path(path);
        };
		
		var resourceTypes = ["None", "Water", "Food", "Shelter", "First Aid", "Clothing", "Medicine", "Evacuation", "Rescue"];
		
		function generateRequest(groupParameters) {
			var request = {
				EventID: groupParameters.EventID,
				RequestStateID: 1
			};
			
			//populate notes
			var notesRand = Math.random() * 10;
			var notes;
			if (notesRand < 3.33) notes = "Please help!";
			else if (notesRand > 6.66) notes = "Reported via Facebook";
			else notes = "Reported via Twitter";
			request.Notes = notes;
			
			//populate quantity
			request.Quantity = Math.round(Math.random() * 20);
			
			//populate resource type
			request.ResourceTypeID = resourceTypes.indexOf(groupParameters.RequestType);
			
			//populate lat
			var latRand = Math.random() * groupParameters.Diameter;
			var relLat = latRand - groupParameters.Diameter * 0.5;
			request.LAT = groupParameters.CenterLat + relLat;
			
			//populate long
			var longRand = Math.random() * groupParameters.Diameter;
			var relLong = longRand - groupParameters.Diameter * 0.5;
			request.LONG = groupParameters.CenterLong + relLong;
			
			//populate urgency
			request.RequestUrgencyID = Math.round(Math.random() * 4) + 1;
			
			return request;
		}
			
		function generateRequests(groupParameters, numRequests) {
			if (!numRequests) numRequests = groupParameters.NumberOfRequests;
			ResourceRequest.save(generateRequest(groupParameters), function (data) {
				var newResourceRequest = data.json;
				if (numRequests > 1) {
					setTimeout(function() {
						generateRequests(groupParameters, numRequests - 1);
					}, groupParameters.Delay);
				}
			});
		}
		
		$scope.cleanDatabase = function() {
			var locationDeletionRequest = $http({
	            method: 'DELETE',
	            url: '/api/resourcelocation/deployments/all',
	            async: true,
	            headers: {
	                'Content-Type': 'application/json'
	            }
	        });

	        locationDeletionRequest.then(
                function successCallback(response) {
                    //Nothing to do here.
                },
                function errorCallback(response) {
                    console.log(response.data.err);
                }
            );
			
			var requestDeletionRequest = $http({
	            method: 'DELETE',
	            url: '/api/resourcerequest',
	            async: true,
	            headers: {
	                'Content-Type': 'application/json'
	            }
	        });
			
			requestDeletionRequest.then(
                function successCallback(response) {
                    //Nothing to do here.
                },
                function errorCallback(response) {
                    console.log(response.data.err);
                }
            );
		};
		
		$scope.runBangladeshScenario = function() {
			loadScenario("data/BangladeshScenario.json", function(scenarioData) {
				startDemo(scenarioData);
			});
		};
		
		$scope.runNepalScenario = function() {
			loadScenario("data/NepalScenario.json", function(scenarioData) {
				startDemo(scenarioData);
			});
		};
		
		function loadScenario(scenarioUrl, callback) {
			$http.get(scenarioUrl)
			.success(function (data) {
				callback(data);
			}).error(function (data) {
				console.log("Error loading scenario data:  " + data);
			});
		}
		
        function startDemo(scenarioData) {
            $scope.demoRunning = true;
			
            angular.forEach(scenarioData, function (item, key) {
                switch (item.Type) {
                    case "RequestGroup":
                    {
						var groupParameters = item.Data;
						setTimeout(function() {
							generateRequests(groupParameters);
						}, groupParameters.StartDelay);
						break;
                    }
                    default:
                        console.log("I'm lost");
                }
            });

            $scope.demoRunning = false;
        };

    }])
;

angular.module("helpNow").controller("DeploymentCtrl", ["$scope", "$routeParams", "$resource", "$sce", "$location", "$http",
	function ($scope, $routeParams, $resource, $sce, $location, $http) {

	    $scope.showDistributionCenters = false;

	    $scope.deploymentsResource = $resource("/api/resourcelocation/:id");
	    $scope.distCenterResource = $resource("/api/resourcelocation/dist-center/all");

	    $scope.setTitle($scope.text.deployment_title, "style/images/Distribution-Center.png");

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
                    $scope.deployment.ResourceLocationInventories.push(inventory);
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
angular.module("helpNow").controller("EventListCtrl", ["$scope", "$location", function ($scope, $location) {
    var map;

    $scope.setTitle($scope.text.events_title);
    $scope.user = $scope.getCurrentUser();
    if ($scope.user == null || $scope.user == false) {
        $scope.isLoggedIn = false;
    }
    else {
        $scope.isLoggedIn = true;
    }

    $scope.getMapEventIcon = function (eventType) {
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
        angular.forEach($scope.events, function (event) {
            var eventIcon = L.icon({
                iconUrl: $scope.getMapEventIcon(event.EventType.Description),
                iconSize: [43, 44]
            });
            var marker = L.marker([event.EventLocations[0].LAT, event.EventLocations[0].LONG], { icon: eventIcon });
            marker.on("click", function () {
                $scope.$apply(function () {
                    if ($scope.isLoggedIn) {
                        $location.url("org_event/" + event.EventID);
                    }
                    else {
                        $location.url("event_map/" + event.EventID);
                    }
                });
            });
            marker.addTo(map);
        });
    }

    $scope.setCurrentView("events");

    $scope.$on("EventDataLoaded", function () {
        addEventsToMap();
    });

    $scope.initMap = function (newMap) {
        map = newMap;
        addEventsToMap();
    };
}]);
angular.module("helpNow").controller("EventMapCtrl", ["$scope", "$http", "$routeParams", "$resource", "$location", function ($scope, $http, $routeParams, $resource, $location) {

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
        $scope.setTitle($scope.event.EventLocations[0].Description, $scope.getEventIcon($scope.event.EventType.Description));
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

    $scope.needFlags = {
        showMedical: false,
        showShelter: false,
        showFood: false,
        showWater: false,
        showClothing: false,
        showRescue: false,
        showEvacuation: false,
        showMedicine: false
    };

    $scope.showLocationMarkers = true;
    $scope.locationPref = { value: 'Current' };
	
	$scope.toggleHelp = function () {
        $scope.showEventDetails = !$scope.showEventDetails;
        $scope.showHelp = !$scope.showHelp;
        requestLocation();
        return false;
    };
	
	if($location.path().search("/request_help/") == 0) {
		$scope.toggleHelp();
	}

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
        $scope.locationOutline = L.circle([position.coords.latitude, position.coords.longitude], $scope.overlayRadius, { color: "#00ff00", opacity: 1, fillOpacity: 0.7 }).addTo(map);
        $scope.$digest();
    }

    $scope.centerMapToLongLat = function (lat, long) {
        if (!map) return;
        map.setZoom(13);
        map.panTo(new L.LatLng(lat, long));
    };

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
        var flags = $scope.needFlags;
        flags.showMedical = false;
        flags.showShelter = false;
        flags.showFood = false;
        flags.showWater = false;
        flags.showEvacuation = false;
        flags.showMedicine = false;
        return false;
    }

    $scope.$on("EventDataLoaded", function () {
        $scope.event = $scope.getEvent($scope.eventID);
        loadRequests();
        loadUrgencyList();
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

        if ($scope.showLocationMarkers)
            $scope.buildLocationMarkers($scope.locations, mapLayers, $scope.filterFlags);

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
        var flags = $scope.filterFlags;
        flags[id] = !flags[id];
        updateMap();
        return false;
    };

    $scope.toggleFilterClass = function (id) {
        var flags = $scope.filterFlags;
        var status = flags[id];
        return status ? "btn btn-toggle active" : "btn btn-toggle";
    };

    $scope.toggleNeedsClass = function (id) {
        var flags = $scope.needFlags;
        var status = flags[id];
        return status ? "btn btn-toggle active" : "btn btn-toggle";
    };

    $scope.toggleNeed = function (id) {
        var flags = $scope.needFlags;
        flags[id] = !flags[id];
        return false;
    };

    $scope.initMap = function (newMap) {
        map = newMap;
        map.on('click', function (e) {
            if ($scope.locationPref.value == "Other") {
                if ($scope.locationOutline !== undefined) {
                    map.removeLayer($scope.locationOutline);
                }
                $scope.locationOutline = L.circle(e.latlng, $scope.overlayRadius, { color: "#00ff00", opacity: 1, fillOpacity: 0.7 }).addTo(map);
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
        sessionStorage.setItem("filterFlags", JSON.stringify(sessionFilters));
        $scope.showFilters = !$scope.showFilters;
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
            alert($scope.text.missing_fields_alert);
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
        var hasSubmissionError = false;
        var flags = $scope.needFlags;

        if ($scope.showNeeds) {
            if (!flags.showMedical && !flags.showShelter && !flags.showFood &&
                !flags.showMedicine && !flags.showWater && !flags.showClothing && !flags.showRescue && !flags.showEvacuation) {
                hasError = true;
            }
        }
        if (!hasError) {
            $scope.helpRequest.EventID = $scope.eventID;
            var splitString = $scope.helpRequest.AreaSize.split(" ");
            $scope.helpRequest.AreaSize = splitString[0];
            $scope.helpRequest.UnitOfMeasure = splitString[1];
            if (flags.showMedicalNeed) {
                $scope.helpRequest.ResourceTypeID = '4';
                postNeedRequest();
            }
            if (flags.showShelter) {
                $scope.helpRequest.ResourceTypeID = '3';
                postNeedRequest();
            }
            if (flags.showFood) {
                $scope.helpRequest.ResourceTypeID = '2';
                postNeedRequest();
            }
            if (flags.showMedicine) {
                $scope.helpRequest.ResourceTypeID = '6';
                postNeedRequest();
            }
            if (flags.showWater) {
                $scope.helpRequest.ResourceTypeID = '1';
                postNeedRequest();
            }
            if (flags.showClothing) {
                $scope.helpRequest.ResourceTypeID = '5';
                postNeedRequest();
            }
            if (flags.showRescue) {
                $scope.helpRequest.ResourceTypeID = '8';
                postNeedRequest();
            }
            if (flags.showEvacuation) {
                $scope.helpRequest.ResourceTypeID = '7';
                postNeedRequest();
            }
            resetNeedsButtons();
            map.removeLayer($scope.locationOutline);
            $scope.showNeeds = !$scope.showNeeds;
            $scope.showEventDetails = !$scope.showEventDetails;
            if (!$scope.hasSubmissionError) {
                alert($scope.text.need_request_success);
            }
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
            //alert("Request successfully submitted");
        },
        function (response) { // optional
            alert("Error: ");
            $scope.hasSubmissionError = true;
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
angular.module("helpNow").controller("ForgotPasswordCtrl", ["$scope", "$http", "Account", "$location", "$routeParams", "$resource", function ($scope, $http, Account, $location, $routeParams, $resource) {
    $scope.setCurrentView("forgot_password");
    $scope.setTitle($scope.text.forgot_password_title);

    $scope.emailAddress = '';

    $scope.accountResource = $resource("/api/inviterequest/passwordreset");

    $scope.sendEmail = function () {
        var postdata = 'Email=' + $scope.emailAddress;
        var webCall = $http({
            method: 'POST',
            url: '/api/inviterequest/passwordreset',
            async: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: postdata
        });

        webCall.then(function (response) {
            if (response.data.json == true) {
                $location.path('#');
            }
            else {
                alert("Error: " + response.data.err);
            }
        });
    };
}]);
angular.module("helpNow").controller("GovLoginCtrl", ["$scope", function($scope) {
	$scope.setCurrentView("govs");
}]);
angular.module("helpNow").controller("IndLoginCtrl", ["$scope", function($scope) {
	$scope.setCurrentView("inds");
}]);
angular.module("helpNow").controller("InventoryCtrl", ["$scope", "$http", "$routeParams", "ResourceLocation", "ResourceLocationInventory", "ResourceLocationTransport", "$resource", "$uibModal", function ($scope, $http, $routeParams, ResourceLocation, ResourceLocationInventory, ResourceLocationTransport, $resource, $uibModal) {

    var map;
    var mapLayers = [];
  
    $scope.setTitle("Inventory Managenent");

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
            
            $scope.resourceTypes = data.json.filter(function (el) {
                return el.Description != 'Evacuation';
            });
            
            // $scope.resourceTypes = data.json;
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

    $scope.centerMapToLongLat = function (lat, long, zoom) {
        if (!map) return;
        map.setZoom(zoom);
        map.panTo(new L.LatLng(lat, long));
    };


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
            if ($scope.locationOutline !== undefined) {
                map.removeLayer($scope.locationOutline);
            }
            $scope.currentResourceLocation.LAT = "";
            $scope.currentResourceLocation.LONG = "";
        }
    }

    function showPosition(position) {
        $scope.currentResourceLocation.LAT = position.coords.latitude;
        $scope.currentResourceLocation.LONG = position.coords.longitude;
        if ($scope.locationOutline !== undefined) {
            map.removeLayer($scope.locationOutline);
        }
        $scope.locationOutline = L.circle([position.coords.latitude, position.coords.longitude], $scope.overlayRadius, { color: "#00ff00", opacity: 1, fillOpacity: 0.7 }).addTo(map);
        $scope.$digest();
        $scope.centerMapToLongLat(position.coords.latitude, position.coords.longitude, 7);
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


    $scope.resourceLocationClick = function (lat, long, resourceLocID) {
        if (!map) return;
        $scope.centerMapToLongLat(lat, long, 13);
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

    $scope.createNewResourceLocation = function () {
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

        return newResLoc;
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
            //var newResLoc = new ResourceLocation();
            //newResLoc.ResourceLocationTransports = [];
            //newResLoc.OrganizationID = $scope.currentUser.OrganizationID;
            ////We default each new location to Distribution Center as Inventory is only for Distribution Center Management.
            //var defaultResLocType = $scope.setDefaultResourceLocationType();
            //newResLoc.ResourceLocationType = defaultResLocType;
            //newResLoc.ResourceLocationTypeID = defaultResLocType.ResourceLocationTypeID;
            ////We default each new lcoation to Active Status
            //var defaultResLocStatus = $scope.setDefaultResourceLocationStatus();
            //newResLoc.ResourceLocationStatus = defaultResLocStatus;
            //newResLoc.ResourceLocationStatusID = defaultResLocStatus.ResourceLocationStatusID;

            $scope.currentResourceLocation = $scope.createNewResourceLocation();

            //set lat/long radio buttons
            $scope.locationPref.value = "Other";
            $scope.getLocation();

        }
        else
        {
            //edit mode
            $scope.editMode = true;
            var index = $scope.resourceLocations.map(function (el) {
                return el.ResourceLocationID;
            }).indexOf(id);
            $scope.currentResourceLocation = $scope.resourceLocations[index];

            //set lat/long radio buttons
            $scope.locationPref.value = "Other";
            //$scope.getLocation();

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
        //before we go to the transportation div, we check for any form errors.
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reslocform1.$invalid) { return; }

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
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.reslocinvform.$invalid) { return; }
        if ($scope.resourceLocationInventoryEdit) {
            $scope.updateResourceLocationInventory();
        }
        else {
            $scope.saveNewResourceLocationInventory();
        }
        return false;
    };
	
	function findSubtypeByID(id) {
		var selectedSubtype = null;
		$scope.resourceTypesFiltered[0].ResourceSubtypes.forEach(function(subtype) {
			if (subtype.ResourceSubtypeID == id) selectedSubtype = subtype;
		});
		return selectedSubtype;
	}

    $scope.saveNewResourceLocationInventory = function () {
        ResourceLocationInventory.save($scope.currentResourceLocationInventory)
            .$promise.then(function (value) {
				$scope.currentResourceLocationInventory.ResourceSubtype = findSubtypeByID($scope.currentResourceLocationInventory.ResourceSubtypeID);
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

    //var hnNextDirective = {
    //    'hnNext': ['$parse', function ($parse) {
    //        return {
    //            restrict: 'A',
    //            require: 'form',
    //            link: function (scope, formElement, attributes, formController) {

    //                var fn = $parse(attributes.rcSubmit);

    //                formElement.bind('btn-next', function (event) {
    //                    // if form is not valid cancel it.
    //                    if (!formController.$valid) return false;

    //                    scope.$apply(function () {
    //                        fn(scope, { $event: event });
    //                    });
    //                });
    //            }
    //        };
    //    }]
    //};


}]);
angular.module("helpNow").controller("LoginCtrl", ["$scope", "$http", "$location", "$routeParams", "$resource", function ($scope, $http, $location, $routeParams, $resource) {
    $scope.setCurrentView("login");
    $scope.setTitle($scope.text.login_title);

    $scope.validateUser = function () {
        if ($scope.userCreds.username === undefined || $scope.userCreds.password === undefined) {
            alert("Missing Username or Password");
        }
        else {
            $scope.login();
        }
    };

    $scope.login = function() {
        var postdata = 'username=' + $scope.userCreds.username + '&' + 'password=' + $scope.userCreds.password;

        var webCall = $http({
            method: 'POST',
            url: '/authenticate/login',
            async: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: postdata
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
                    AccountRoleID: $scope.currentUser.AccountRoleID,
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
                $location.search('error', null);
                $location.path('/');
            }
        },
        function (response) { // optional
            alert($scope.text.incorrect_login_alert);
        });
    };

    $scope.checkForErrors = function () {
        var errorType = ($location.search()).error;
        if (typeof errorType !== 'undefined') {
            if (errorType.indexOf("invalid_account") >= 0) {
                alert("Your Facebook account has not been registered. Please register and try again.");
            }
        }
    };

    $scope.checkForErrors();
}]);
angular.module("helpNow").controller("ManageEventsCtrl", ["$scope", "$location", "$resource", "Event", "$uibModal",
	function ($scope, $location, $resource, Event, $uibModal) {

	    $scope.orgEvents = [];
	    $scope.noEvents = true;

	    $scope.setTitle($scope.text.manage_events_title);
	    $scope.setCurrentView("manage_events");

	    filterEvents();
	    

	    function filterEvents() {
	        angular.forEach($scope.events, function (event) {
	            if (event.OrganizationID == $scope.currentOrg.OrganizationID) {
	                $scope.orgEvents.push(event);
	            }
	        });
	        if ($scope.orgEvents.length > 0) $scope.noEvents = false;
	    }

	    $scope.editEvent = function (event) {
	        $location.path("/new_event/" + event.EventID);
	    }
	    
	    $scope.disableEvent = function (event) {
	        var disabledEvent = event;
	        disabledEvent.Active = 0;
	        //Event.update({ id: event.EventID, Active: 0 }, disabledEvent);
	        $scope.modalInstance = $uibModal.open(
                    {
                        templateUrl: '/manage/event-modal-delete.html',
                        scope: $scope,
                        controller: function ($scope) {
                            this.disabledEvent = disabledEvent;
                            this.Event = Event;
                            this.text = $scope.text;

                            $scope.disableEvent = function () {
                                Event.update({ id: disabledEvent.EventID }, disabledEvent);
                                $location.path("/#");
                                $scope.loadEvents();
                            };
                        },
                        controllerAs: "model"
                    });
	    };

	}]);
angular.module("helpNow").controller("ManageMapLayersCtrl", ["$scope", "$location", "$route", "$resource", "MapLayer", "$uibModal",
	function ($scope, $location, $route, $resource, MapLayer, $uibModal) {

	    $scope.orgMapLayers = [];
	    $scope.orgBaseMaps = [];
	    $scope.orgMapOverlays = [];
	    $scope.noBasemaps = true;
	    $scope.noOverlays = true;

	    $scope.setTitle($scope.text.manage_map_layers_title);
	    $scope.setCurrentView("manage_map_layers");

	    var mapLayersResource = $resource("/api/maplayer/:id");

	    filterMapLayers();

	    function filterMapLayers() {
	        mapLayersResource.get({}, function (data) {
	            $scope.mapLayers = data.json;
	            angular.forEach($scope.mapLayers, function (mapLayer) {
	                if (mapLayer.OrganizationID == $scope.currentOrg.OrganizationID && mapLayer.MapLayerTypeID == 1) {
	                    $scope.orgBaseMaps.push(mapLayer);
	                }
	                else if (mapLayer.OrganizationID == $scope.currentOrg.OrganizationID && mapLayer.MapLayerTypeID == 2) {
	                    $scope.orgMapOverlays.push(mapLayer);
	                }
	            });
	            if ($scope.orgBaseMaps.length > 0) $scope.noBasemaps = false;
                if ($scope.orgMapOverlays.length > 0) $scope.noOverlays = false
	        });
	    }

	    $scope.editMapLayer = function (mapLayer) {
	        if (mapLayer.EventID != null && mapLayer.EventID > 0) {
	            $location.path("/new_map_layer/" + mapLayer.EventID + "/" + mapLayer.MapLayerID);
	        }
	        else
	        {
	            $location.path("/new_map_layer/0/" + mapLayer.MapLayerID);
	        }
	        
	    };

	    $scope.deleteMapLayer = function (mapLayer) {
	        var deletedMapLayer = mapLayer;
	        $scope.modalInstance = $uibModal.open(
                    {
                        templateUrl: '/manage/map-layer-modal-delete.html',
                        scope: $scope,
                        controller: function ($scope) {
                            this.deletedMapLayer = deletedMapLayer;
                            this.MapLayer = MapLayer;
                            this.text = $scope.text;

                            $scope.deleteMapLayer = function () {
                                mapLayersResource.delete({ id: deletedMapLayer.MapLayerID }, function (data) {
                                    $route.reload();
                                });
                            };
                        },
                        controllerAs: "model"
                    });
	    };

	}]);
/**
 * ManageCtrl
 */

angular.module("helpNow").controller("ManageCtrl", ["$scope", "$location" , "$resource", "Invitation" ,  "$uibModal", "Account",
	function($scope, $location, $resource ,Invitation ,$uibModal, Account) {


	$scope.invitesResource  = $resource("/api/inviterequest/organizationinvites/:accountid",
			{ accountid: $scope.currentUser.AccountID });
	$scope.orgResource = $resource("/api/organization/:id", { id: $scope.currentOrg.OrganizationID });

	$scope.setTitle($scope.text.manage_title_label);
	$scope.setCurrentView("mng");

	$scope.loadInvites = function() {
		$scope.invitesResource.get({}, function(data) {
			$scope.invites = data.json;
			$scope.$broadcast("InviteDataLoaded", {});
		});
		$scope.orgResource.get({}, function (data) {
		    $scope.org = data.json[0];
		    $scope.$broadcast("OrgLoaded", {});
		});
	};

	$scope.loadInvites();



	$scope.deleteInvite = function (invitation) {

		$scope.modalInstance = $uibModal.open(
				{
					templateUrl: '/manage/invite-modal-delete.html',
					scope: $scope,
					controller: function () {
						this.invitation = invitation;
						this.Invitation = Invitation;
						this.text = $scope.text;

						$scope.deleteInvite = function (invitation) {
							Invitation.delete({inviteid: invitation.InviteID});
							$location.path("/manage");
						};
					},
					controllerAs: "model"
				});
	};


	///account/organizationmembers/:id (id = AccountID)

	$scope.teamResource  = $resource("/api/account/organizationmembers/:accountid",
			{accountid: $scope.currentUser.AccountID});


	$scope.loadTeam = function() {
		$scope.teamResource.get({}, function(data) {
			$scope.team = data.json;
			$scope.$broadcast("TeamDataLoaded", {});
		});
	};

	$scope.loadTeam();


	$scope.deleteTeamMember = function (teamMember) {
		$scope.modalInstance = $uibModal.open(
				{
					templateUrl: '/manage/teammember-modal-delete.html',
					scope: $scope,
					controller: function ($scope) {
						this.teamMember = teamMember;
						this.Account = Account;
						this.text = $scope.text;

						$scope.deleteMember = function () {
							Account.delete({id: teamMember.AccountID});
							$location.path("/manage");
						};
					},
					controllerAs: "model"
				});
	};

	$scope.enterAddress = function () {
	    $location.path('/org_address/' + $scope.currentOrg.OrganizationID);
	};

	$scope.editAPI = function () {
	    $location.path('/add_org/' + $scope.currentOrg.OrganizationTypeID + '/' + $scope.currentOrg.OrganizationID);
	};

	$scope.go = function ( path ) {
		$location.path( path );
	};

}]);
angular.module("helpNow").controller("NewEventCtrl", ["$scope", "$http", "$location", "$routeParams", "$resource", function ($scope, $http, $location, $routeParams, $resource) {

    var map;
    var mapLayers = [];

    $scope.setCurrentView("new-event");
    $scope.setTitle($scope.text.new_event_title, "/style/images/New Emergency Event.png");

    var existingEvent = false;

    $scope.eventID = $routeParams.eventID * 1;
    if ($scope.events && $scope.eventID > 0) {
        existingEvent = true;
        $scope.existingEvent = $scope.getEvent($scope.eventID);
        $scope.newEvent = $scope.existingEvent;
        $scope.newEvent.LAT = $scope.existingEvent.EventLocations[0].LAT;
        $scope.newEvent.LONG = $scope.existingEvent.EventLocations[0].LONG;
        $scope.radiusRawVal = $scope.newEvent.EventLocations[0].Radius;
        $scope.overlayRadius = $scope.newEvent.EventLocations[0].Radius * 1000;
        $scope.sliderLabel = $scope.radiusRawVal + " km";
        $scope.selectedEvent = { selectedEventTypeID: $scope.newEvent.EventTypeID };
        $scope.selectedEvent.selectedEventType = $scope.newEvent.EventType;
        $scope.selectedEvent.selectedEventTypeDescription = $scope.newEvent.EventType.Description;
        $scope.locationData = $scope.newEvent.EventLocations[0];
        //$scope.locationOutline = L.circle([$scope.newEvent.LAT, $scope.newEvent.LONG], $scope.overlayRadius, { color: "#00ff00", opacity: 1, fillOpacity: 0.7 }).addTo(map);
    }
    else {
        existingEvent = false;
        $scope.newEvent = { Notes: '', Keywords: '', OrganizationID: $scope.currentOrg.OrganizationID, Active: '1', AreaSize: '15 km' };
        $scope.overlayRadius = 15000;
        $scope.radiusRawVal = 15;
        $scope.sliderLabel = "15 km";
        $scope.selectedEvent = { selectedEventTypeID: '1' };
        $scope.locationData = { Radius: '' };
    }

    $scope.eventTypesResource = $resource("/api/eventtype/");
    $scope.eventTypes = [];
    
    $scope.isMetric = true;

    $scope.showEventDetails = true;
    $scope.showContacts = false;

    loadEventTypes();

    function loadEventTypes() {
        $scope.eventTypesResource.get({}, function (data) {
            $scope.eventTypes = data.json;
            $scope.selectedEvent.selectedEventType = $scope.eventTypes[$scope.selectedEvent.selectedEventTypeID - 1];
            $scope.selectedEvent.selectedEventTypeDescription = $scope.selectedEvent.selectedEventType.Description;
            $scope.getSelectedEventType();
        });
    }

    $scope.getSelectedEventType = function () {
        $scope.newEvent.EventTypeID = $scope.selectedEvent.selectedEventType.EventTypeID;
    };

    $scope.toggleNewEvent = function () {
        var hasError = false;
        if ($scope.showEventDetails) {
            if (($scope.newEvent.LAT === undefined || $scope.newEvent.LAT == "" || $scope.newEvent.LONG === undefined || $scope.newEvent.LONG == "")) {
                hasError = true;
            }
            if ($scope.newEvent.Summary === undefined || $scope.newEvent.Summary == "") {
                hasError = true;
            }
        }
        if (!hasError) {
            $scope.showEventDetails = !$scope.showEventDetails;
            $scope.showContacts = !$scope.showContacts;
        }
        else {
            alert($scope.text.missing_fields_alert);
        }
        return false;
    };

    $scope.postNewEvent = function () {
        var newEventData = JSON.stringify($scope.newEvent);
        var webCall = $http({
            method: 'POST',
            url: '/api/event',
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: newEventData
        });
        webCall.then(function (response) {
            $scope.locationData.EventID = response.data.json.EventID;
            //alert("Request successfully submitted");
        },
        function (response) { // optional
            alert("Error: " + response.data.err);
            $scope.hasSubmissionError = true;
        });
        webCall.finally(function (data) {
            if ($scope.locationData.EventID !== undefined && $scope.locationData.EventID != '') {
                $scope.postEventLocation();
            }
        });
    }

    $scope.updateNewEvent = function () {
        var newEventData = JSON.stringify($scope.newEvent);
        var webCall = $http({
            method: 'PUT',
            url: '/api/event/' + $scope.newEvent.EventID,
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: newEventData
        });
        webCall.then(function (response) {
            //$scope.locationData.EventID = $scope.newEvent.EventID;
            //alert("Request successfully submitted");
        },
        function (response) { // optional
            alert("Error: " + response.data.err);
            $scope.hasSubmissionError = true;
        });
        webCall.finally(function (data) {
            if ($scope.locationData.EventID !== undefined && $scope.locationData.EventID != '') {
                $scope.updateEventLocation();
            }
        });
    }

    $scope.postEventLocation = function () {
        var splitString = $scope.newEvent.AreaSize.split(" ");
        $scope.locationData.Radius = splitString[0];
        $scope.locationData.LAT = $scope.newEvent.LAT;
        $scope.locationData.LONG = $scope.newEvent.LONG;
        $scope.locationData.Description = $scope.newEvent.Summary;
        var locationData = JSON.stringify($scope.locationData);
        var webCall = $http({
            method: 'POST',
            url: '/api/eventlocation',
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: locationData
        });
        webCall.then(function (response) {
            //alert("Request successfully submitted");
            $location.path("#");
            $scope.loadEvents();
        },
        function (response) { // optional
            alert("Error: " + response.data.err);
            $scope.hasSubmissionError = true;
        });
    };

    $scope.updateEventLocation = function () {
        var splitString = $scope.newEvent.AreaSize.split(" ");
        $scope.locationData.Radius = splitString[0];
        $scope.locationData.LAT = $scope.newEvent.LAT;
        $scope.locationData.LONG = $scope.newEvent.LONG;
        $scope.locationData.Description = $scope.newEvent.Summary;
        var locationData = JSON.stringify($scope.locationData);
        var webCall = $http({
            method: 'PUT',
            url: '/api/eventlocation/' + $scope.locationData.EventLocationID,
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: locationData
        });
        webCall.then(function (response) {
            //alert("Request successfully submitted");
            $location.path("#");
            $scope.loadEvents();
        },
        function (response) { // optional
            alert("Error: " + response.data.err);
            $scope.hasSubmissionError = true;
        });
    };

    $scope.locationPref = { value: 'Other' };

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
            $scope.newEvent.LAT = "";
            $scope.newEvent.LONG = "";
            $scope.$digest();
        }
    }

    function showPosition(position) {
        $scope.newEvent.LAT = position.coords.latitude;
        $scope.newEvent.LONG = position.coords.longitude;
        if ($scope.locationOutline !== undefined) {
            map.removeLayer($scope.locationOutline);
        }
        $scope.locationOutline = L.circle([position.coords.latitude, position.coords.longitude], $scope.overlayRadius, { color: "#00ff00", opacity: 1, fillOpacity: 0.7 }).addTo(map);
        $scope.$digest();
    }

    $scope.centerMapToLongLat = function (lat, long) {
        if (!map) return;
        map.setZoom(13);
        map.panTo(new L.LatLng(lat, long));
    };

    $scope.showValue = function () {
        if ($scope.radiusRawVal == 0)
            $scope.radiusRawVal = 15;

        if ($scope.isMetric) {
            $scope.overlayRadius = $scope.radiusRawVal * 1000;
            $scope.sliderLabel = $scope.radiusRawVal + " km";
        }
        else {
            $scope.overlayRadius = $scope.radiusRawVal * 1000;
            $scope.sliderLabel = $scope.radiusRawVal + " mi";
        }
        $scope.newEvent.AreaSize = $scope.sliderLabel;

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
        $scope.newEvent.AreaSize = $scope.sliderLabel;
    };

    function updateMap() {
        if (!map || !$scope.events) return;

        for (var i = 0; i < mapLayers.length; i++) {
            var layer = mapLayers[i];
            map.removeLayer(layer);
        }

        mapLayers = [];

        if ($scope.showLocationMarkers)
            $scope.buildLocationMarkers($scope.locations, mapLayers, $scope.filterFlags);

        angular.forEach(mapLayers, function (layer) {
            map.addLayer(layer);
        });
    }

    $scope.initMap = function (newMap) {
        map = newMap;
        map.on('click', function (e) {
            if ($scope.locationPref.value == "Other") {
                if ($scope.locationOutline !== undefined) {
                    map.removeLayer($scope.locationOutline);
                }
                $scope.locationOutline = L.circle(e.latlng, $scope.overlayRadius, { color: "#00ff00", opacity: 1, fillOpacity: 0.7 }).addTo(map);
                $scope.newEvent.LAT = e.latlng.lat.toFixed(3);
                $scope.newEvent.LONG = e.latlng.lng.toFixed(3);
                $scope.$digest();
            }
        });
        updateMap();
        addOverlay();
    };

    function addOverlay() {
        if ($scope.eventID > 0 && map) {
            $scope.locationOutline = L.circle([$scope.newEvent.LAT, $scope.newEvent.LONG], $scope.overlayRadius, { color: "#00ff00", opacity: 1, fillOpacity: 0.7 }).addTo(map);
        }
    }
}]);
angular.module("helpNow").controller("NewMapLayerCtrl", ["$scope", "$http", "$location", "$routeParams", "$resource", function ($scope, $http, $location, $routeParams, $resource) {

    var map;
    var mapLayers = [];

    $scope.setCurrentView("new-map-layer");
    $scope.eventID = $routeParams.eventID * 1;
    $scope.mapLayerID = $routeParams.mapLayerID * 1;

    $scope.mapLayerTypeResource = $resource("/api/maplayertype/");
    $scope.mapLayerResource = $resource("/api/maplayer/:id");

    var existingMapLayer = false;

    if ($scope.mapLayerID > 0) {
        $scope.setTitle($scope.text.btn_update_map_layer);
        existingMapLayer = true;
        getMapLayers();
    }
    else {
        $scope.setTitle($scope.text.btn_new_map_layer);
        existingMapLayer = false;
        $scope.mapLayer = { MapLayerType: 'Base Map', UsesEsri: false, UsesTSM: false };
        $scope.selectedMapLayerType = { selectedMapLayerTypeID: '1' };
    }

    loadMapLayerTypes();

    function loadMapLayerTypes() {
        $scope.mapLayerTypeResource.get({}, function (data) {
            $scope.mapLayerTypes = data.json;
            $scope.selectedMapLayerType.selectedMapLayerType = $scope.mapLayerTypes[$scope.selectedMapLayerType.selectedMapLayerTypeID - 1];
            $scope.selectedMapLayerType.selectedMapLayerTypeDescription = $scope.selectedMapLayerType.selectedMapLayerType.Description;
            $scope.getSelectedMapLayerType();
        });
    }

    function getMapLayers() {
        $scope.mapLayerResource.get({id: $scope.mapLayerID}, function (data) {
            $scope.existingMapLayer = data.json;
            $scope.mapLayer = $scope.existingMapLayer[0];
            if ($scope.mapLayer.IsEsri) {
                $scope.mapLayer.UsesEsri = true;
            }
            else
            {
                $scope.mapLayer.UsesEsri = false;
            }
            if($scope.mapLayer.IsTSM)
            {
                $scope.mapLayer.UsesTSM = true;
            }
            else
            {
                $scope.mapLayer.UsesTSM = false;
            }
            if ($scope.mapLayer.MapLayerTypeID == 1)
            {
                $scope.mapLayer.MapLayerType = 'Base Map';
                $scope.selectedMapLayerType = { selectedMapLayerTypeID: '1' };
            }
            else if ($scope.mapLayer.MapLayerTypeID == 2)
            {
                $scope.mapLayer.MapLayerType = 'Map Overlay';
                $scope.selectedMapLayerType = { selectedMapLayerTypeID: '2' };
            }
        })
    }

    $scope.getSelectedMapLayerType = function () {
        $scope.mapLayer.MapLayerTypeID = $scope.selectedMapLayerType.selectedMapLayerType.MapLayerTypeID;
    };

    $scope.submitNewMapLayer = function () {
        var hasError = false;
        if (($scope.mapLayer.Name === undefined || $scope.mapLayer.Name == "" ||
            $scope.mapLayer.ImageryURL === undefined || $scope.mapLayer.ImageryURL == "" ||
            $scope.mapLayer.MinZoomLevel === undefined || $scope.mapLayer.MinZoomLevel == "" ||
            $scope.mapLayer.MaxZoomLevel === undefined || $scope.mapLayer.MaxZoomLevel == "")) {
            hasError = true;
        }

        if ($scope.mapLayer.MapLayerType === undefined || $scope.mapLayer.MapLayerType == "") {
            hasError = true;
        }

        if ($scope.mapLayer.UsesEsri) {
            $scope.mapLayer.IsEsri = 1;
        }
        else {
            $scope.mapLayer.IsEsri = 0;
        }

        if ($scope.mapLayer.UsesTSM) {
            $scope.mapLayer.IsTSM = 1;
        }
        else {
            $scope.mapLayer.IsTSM = 0;
        }

        if ($scope.eventID > 0) {
            $scope.mapLayer.EventID = $scope.eventID;
        }

        $scope.mapLayer.OrganizationID = $scope.currentOrg.OrganizationID;
        
        if (!hasError) {
            $scope.postNewMapLayer();
        }
        else {
            alert($scope.text.missing_fields_alert);
        }
        return false;
    };

    $scope.updateMapLayer = function () {
        var hasError = false;
        if (($scope.mapLayer.Name === undefined || $scope.mapLayer.Name == "" ||
            $scope.mapLayer.ImageryURL === undefined || $scope.mapLayer.ImageryURL == "" ||
            $scope.mapLayer.MinZoomLevel === undefined || $scope.mapLayer.MinZoomLevel == "" ||
            $scope.mapLayer.MaxZoomLevel === undefined || $scope.mapLayer.MaxZoomLevel == "")) {
            hasError = true;
        }

        if ($scope.mapLayer.MapLayerType === undefined || $scope.mapLayer.MapLayerType == "") {
            hasError = true;
        }

        if ($scope.mapLayer.UsesEsri) {
            $scope.mapLayer.IsEsri = 1;
        }
        else {
            $scope.mapLayer.IsEsri = 0;
        }

        if ($scope.mapLayer.UsesTSM) {
            $scope.mapLayer.IsTSM = 1;
        }
        else {
            $scope.mapLayer.IsTSM = 0;
        }

        if ($scope.eventID > 0) {
            $scope.mapLayer.EventID = $scope.eventID;
        }

        $scope.mapLayer.OrganizationID = $scope.currentOrg.OrganizationID;

        if (!hasError) {
            $scope.updateLayer();
        }
        else {
            alert($scope.text.missing_fields_alert);
        }
        return false;
    };

    $scope.postNewMapLayer = function () {
        var newMapLayer = JSON.stringify($scope.mapLayer);
        var webCall = $http({
            method: 'POST',
            url: '/api/maplayer',
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: newMapLayer
        });
        webCall.then(function (response) {
            $location.path("#");
        },
        function (response) { // optional
            alert("Error: " + response.data.err);
            $scope.hasSubmissionError = true;
        });
    }

    $scope.updateLayer = function () {
        var newMapLayer = JSON.stringify($scope.mapLayer);
        var webCall = $http({
            method: 'PUT',
            url: '/api/maplayer/' + $scope.mapLayer.MapLayerID,
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: newMapLayer
        });
        webCall.then(function (response) {
            $location.path("#");
        },
        function (response) { // optional
            alert("Error: " + response.data.err);
            $scope.hasSubmissionError = true;
        });
    }

}]);
angular.module("helpNow").controller("OrgAddressCtrl", ["$scope", "$http", "$location", "Organization", "$routeParams", "$resource", function ($scope, $http, $location, Organization, $routeParams, $resource) {
    $scope.setCurrentView("org-address");
    $scope.setTitle($scope.text.address_title);

    $scope.addressResource = $resource("/api/address/:id");
    $scope.orgResource = $resource("/api/organization/:id");

    $scope.orgID = $routeParams.orgID * 1;
    $scope.loadOrg = function () {
        $scope.orgResource.get({ id: $scope.orgID}, function (data) {
            $scope.org = data.json[0];
            $scope.loadAddress();
        });
    };

    $scope.loadAddress = function () {
        if ($scope.org.AddressID) {
            $scope.addressResource.get({ id: $scope.org.AddressID }, function (data) {
                $scope.orgAddress = data.json[0];
                if (data.json[0]) {
                    $scope.hasAddress = true;
                }
            });
        }
    };

    function loadOrgAddress() {
        $scope.loadOrg();
    }

    loadOrgAddress();

    $scope.submitOrgAddress = function () {
        if ($scope.hasAddress) {
            updateAddress();
        }
        else {
            submitPost();
        }
    };

    function updateAddress() {
        var orgAddressData = JSON.stringify($scope.orgAddress);
        var webCall = $http({
            method: 'PUT',
            url: '/api/address/' + $scope.org.AddressID,
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: orgAddressData
        });
        webCall.then(function (response) {
            alert("Address Successfully Submitted");
            $location.path('#');
        },
        function (response) { // optional
        });
    }

    function submitPost() {
        var orgAddressData = JSON.stringify($scope.orgAddress);
        var webCall = $http({
            method: 'POST',
            url: '/api/address',
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: orgAddressData
        });
        webCall.then(function (response) {
            alert("Address Successfully Submitted");
            appendToOrganization(response.data.json.AddressID);
        },
        function (response) { // optional
            alert("Error: ");
        });
    }

    function appendToOrganization(addressID) {
        $scope.org.AddressID = addressID;
        var orgAddressData = JSON.stringify($scope.org);
        var webCall = $http({
            method: 'PUT',
            url: '/api/organization/' + $scope.org.OrganizationID,
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: orgAddressData
        });
        webCall.then(function (response) {
            $location.path('#/manage');
        },
        function (response) { // optional
        });
    }
}]);
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

	    $scope.requests = [];
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

	    function buildClusterMarkers() {
	        if (!$scope.requestClusters) return;
	        $scope.selectedClusters = $scope.requestClusters.filter(function (cluster) {
	            var type = cluster.ResourceType.Description;
	            return $scope.shouldDisplayMarker(type, $scope.filterFlags);
	        });

	        angular.forEach($scope.selectedClusters, function (cluster) {
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

	    function markFulfilledRequests() {
	        angular.forEach($scope.locations, function (deployment) {
	            angular.forEach(deployment.ResourceLocationInventories, function (inventory) {
	                angular.forEach($scope.requests, function (request) {
                        if (!request.fulfilled) {
	                        request.fulfilled = calculateKmDistance(deployment.LAT, deployment.LONG, request.LAT, request.LONG) < 4 &&
                            request.ResourceTypeID == inventory.ResourceTypeID;
	                    }
	                });
	            });
	        });
	    }

	    function buildHeatmap(selectedClusters) {
	        var heatmapConfig = {
	            "radius": 0.1,
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
	        markFulfilledRequests();
	        var selectedRequests = $scope.requests.filter(function (request) {
	            if (request.fulfilled) return false;
	            var type = request.ResourceType.Description;
	            return $scope.shouldDisplayMarker(type, $scope.filterFlags);
	        });
			
	        if ($scope.showHeatmap && $scope.selectedClusters.length > 0)
	            buildHeatmap($scope.selectedClusters);

	        if ($scope.showNeedsMarkers && zoom > 7)
	            buildNeedsMarkers(selectedRequests);

	        if ($scope.showClusters)
	            buildClusterMarkers();

	        if ($scope.showLocationMarkers)
	            $scope.buildLocationMarkers($scope.locations, mapLayers, $scope.filterFlags, locationClicked);

	        if ($scope.showDistCenterMarkers)
	            buildDistCenterMarkers();
			
			if ($scope.showBlockageMarkers)
				buildBlockageMarkers();
			
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
	            var dataChanged = data.json.requests.length != $scope.requests.length
					|| data.json.locations.length != $scope.locations.length
					|| data.json.distributionCenters.length != $scope.distributionCenters.length
					|| data.json.blockages.length != $scope.blockages.length;

	            if (dataChanged) {
	                $scope.requestClusters = data.json.requestClusters;
	                $scope.requests = data.json.requests;
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
	        updateMap();
	        return false;
	    };

	    $scope.toggleResourceFilter = function (filterName) {
	        var flags = $scope.filterFlags;
	        flags[filterName] = !flags[filterName];
	        updateMap();
	        return false;
	    }

	    $scope.toggleResourceButtonClass = function (id) {
	        var flags = $scope.filterFlags;
	        var status = flags[id];
	        updateMap();
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
	                $scope.deployment.LAT = e.latlng.lat.toFixed(3);
	                $scope.deployment.LONG = e.latlng.lng.toFixed(3);
	                drawLocationMarker();
	                $scope.$digest();
	            } else if ($scope.showBlockagePanel) {
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
	        $scope.showFilters = !$scope.showFilters;
	    };

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
	            updateMap();
	        }
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
			} else if (!$scope.blockage.LAT || !$scope.blockage.LAT) {
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


angular.module("helpNow").controller("OrganizationAddCtrl", ["$scope", "$resource", "$routeParams", "Organization", "$location", function ($scope, $resource, $routeParams, Organization, $location) {

    $scope.orgTypeID = $routeParams.orgTypeID * 1;
    $scope.newOrg = new Organization();
    $scope.newOrg.OrganizationTypeID = $scope.orgTypeID;
    $scope.newOrg.CreateDate = new Date();
    $scope.orgType = $scope.orgTypeID == 1 ? $scope.text.gov_name_label : $scope.text.org_name_label;

    $scope.orgResource = $resource("/api/organization/:id");

    $scope.orgID = $routeParams.orgID * 1;
    if ($scope.orgID == 0) $scope.isNew = true;
    $scope.loadOrg = function () {
        $scope.orgResource.get({ id: $scope.orgID }, function (data) {
            $scope.org = data.json[0];
            if ($scope.org.Name != null) {
                $scope.newOrg.Name = $scope.org.Name;
            }
            // commented out, we will no longer provide the APISecret to view.  A new Secret will need to be created if the Organization/API is updated.
            // if ($scope.org.APISecret != null) {
            //     $scope.newOrg.APISecret = $scope.org.APISecret;
            // }
        });
    };

    function loadOrgAddress() {
        if(!$scope.isNew) $scope.loadOrg();
    }

    loadOrgAddress();

    $scope.setTitle($scope.text.create + " " + $scope.orgType);

    $scope.go = function (path) {
        $location.path(path);
    };

    $scope.addOrg = function (org) {
        if (org.Name === undefined || org.Name == null || org.APISecret === undefined || org.APISecret == null) {
            alert($scope.text.missing_fields_alert);
            return;
        }
        if ($scope.isNew) {
            Organization.save(org).$promise.then(function (response) {
                $location.path('/administration');
            },
            function (response) { // optional
                alert("Error: " + response.data.err);
            });;
        }
        else {
            Organization.update({id: $scope.orgID}, org).$promise.then(function (response) {
                $location.path('/administration');
            },
            function (response) { // optional
                alert("Error: " + response.data.err);
            });;
        }
    };

    $scope.enterAddress = function (org) {
        if (org.Name === undefined || org.Name == null || org.APISecret === undefined || org.APISecret == null) {
            alert($scope.text.missing_fields_alert);
            return;
        }
        Organization.save(org).$promise.then(function (response) {
            var returnedOrg = response.json[0];
            $location.path('/org_address/' + returnedOrg.OrganizationID);
        },
        function (response) { // optional
            alert("Error: " + response.data.err);
        });;;
    };

}]);

angular.module("helpNow").controller("PasswordResetCtrl", ["$scope", "$http", "Account", "$location", "$routeParams", "$resource", function ($scope, $http, Account, $location, $routeParams, $resource) {
    $scope.setCurrentView("password_reset");
    $scope.setTitle($scope.text.reset_password_title);

    $scope.accountID = $routeParams.accountID * 1;
    $scope.guid = $routeParams.guid;

    $scope.showOldPasswordField = $scope.guid == 0 ? true : false;

    $scope.accountResource = $resource("/api/account/:id");
    $scope.inviteRequestResource = $resource("/api/inviterequest/passwordupdate/");

    if ($scope.guid == 0) loadAccount();

    function loadAccount() {
        $scope.accountResource.get({ id: $scope.accountID }, function (data) {
            $scope.account = data.json;
            if ($scope.account == null)
                alert("Account could not be found");
        });
    }

    $scope.updatePassword = function () {
        if ($scope.newPassword === $scope.confirmedPassword) {
            if ($scope.guid == 0) {
                $scope.account[0].Password = $scope.newPassword;
                Account.update({ id: $scope.accountID }, JSON.stringify($scope.account[0])).$promise.then(function (response) {
                    $location.path('#');
                },
                function (response) { // optional
                    alert("Error: " + response.data.err);
                });
            }
            else {
                var postdata = 'Password=' + $scope.newPassword + '&' + 'InviteRequestID=' + $scope.guid;
                var webCall = $http({
                    method: 'POST',
                    url: '/api/inviterequest/passwordupdate',
                    async: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: postdata
                });

                webCall.then(function (response) {
                    if (response.data.json != false) {
                        $location.path('#');
                    }
                    else {
                        alert("Error: " + response.data.err);
                    }
                });
            }
        }
        else {
            alert("Passwords do not match.")
        }
    };
}]);
angular.module("helpNow").controller("RegAccountCtrl", ["$scope", "$http", "$location", "Invitation", "$routeParams", "$resource", function ($scope, $http, $location, Invitation, $routeParams, $resource) {
    $scope.setCurrentView("reg-account");
    $scope.setTitle($scope.text.reg_account_title);

    $scope.showUsername = true;
    $scope.showUser = false;

    $scope.inviteid = $routeParams.inviteID;

    $scope.inviteResource = $resource("/api/inviteRequest/:inviteid");

    $scope.userAccount = { Active: true, AccountRoleID: 2, CreateDate: new Date(), IsHashed: 0 };

    loadInviteRequest();

    function loadInviteRequest() {
        $scope.inviteResource.get({inviteid: $scope.inviteid}, function (data) {
            $scope.inviteRequest = data.json;

            if ($scope.inviteRequest == null || $scope.inviteRequest[0] == null || $scope.inviteRequest[0].OrganizationID <= 0) {
                alert("Invitation information could not be found.  Contact your organization's administrator for a new invitation.");
                $location.path('#');
            }
            else {
                $scope.userAccount.OrganizationID = $scope.inviteRequest[0].OrganizationID;
                $scope.userAccount.FirstName = $scope.inviteRequest[0].FirstName;
                $scope.userAccount.LastName = $scope.inviteRequest[0].LastName;
                $scope.userAccount.Email = $scope.inviteRequest[0].Email;
            }
        });
    }

    $scope.showUserForm = function () {
        var hasError = false;
        if ($scope.userAccount.Username === undefined || $scope.userAccount.Password === undefined || $scope.confirmedPassword === undefined) {
            alert($scope.text.missing_fields_alert);
            hasError = true;
        }
        else if ($scope.userAccount.Password != $scope.confirmedPassword) {
            alert($scope.text.password_mismatch_alert);
            hasError = true;
        }
        if (!hasError) {
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
            alert($scope.text.missing_fields_alert);
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
            Invitation.delete({inviteid: $scope.inviteid});
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
                scope: $scope,
                controller: function ($scope) {
                    this.regulation = regulation;
                    this.Regulation = Regulation;
                    this.text = $scope.text;

                    $scope.deleteReg = function () {
                        console.log("regulation.OrganizationRegulationsID" + regulation.OrganizationRegulationsID);
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

    $scope.getCurrentLanguage = function () {
        $scope.currentLanguage = currentLanguage;
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
	
	$scope.getResourceName = function(inventory) {
		var resourceName = inventory.ResourceType.Description;
		if (inventory.ResourceSubtype)
			resourceName += " (" + inventory.ResourceSubtype.Description + ")";
		return resourceName;
	}

    $scope.buildLocationDetails = function (location) {
        var popupText = "<strong>" + location.Organization.Name + "</strong><br/>" +
			location.PrimaryPOCName + "<br/>" +
			location.PrimaryPOCPhone + "<hr/>";
        location.ResourceLocationInventories.forEach(function (inventory) {
            popupText += "<strong>" + $scope.getResourceName(inventory) + ":</strong> " + inventory.Quantity + " " +
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
            url: '/authenticate/logout',
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
/**
 * TeamInviteCtrl
 */

angular.module("helpNow").controller("TeamInviteCtrl", ["$scope", "$resource", "$routeParams", "Invitation", "$http", "$location", "$uibModal", function ($scope, $resource, $routeParams, Invitation, $http, $location, $uibModal) {

    $scope.newInvite = new Invitation();
    $scope.newInvite.OrganizationID = $scope.currentOrg.OrganizationID;
     $scope.sendInvite = function (invitation) {
     Invitation.save(invitation, function (data) {
         $scope.inviteResponse = angular.fromJson(data.json[0]);
        //console.log("inviteResponse.InviteID: " + $scope.inviteResponse.InviteID )
        // console.log("inviteResponse.Email: " + $scope.inviteResponse.Email )
         var postdata = 'email=' +  $scope.inviteResponse.Email +  '&' + 'InviteID=' +  $scope.inviteResponse.InviteID;
         var webCall = $http({
             method: 'POST',
             url: '/postemail',
             async: true,
             headers: {
                 'Content-Type': 'application/x-www-form-urlencoded'
             },
             data: postdata
         });

         webCall.then(function (response) {});
         $scope.confirmEmail(invitation);

     })




    };



    $scope.confirmEmail = function (invitation) {
        $scope.modalInstance = $uibModal.open(
            {
                templateUrl: '/manage/team-invite-modal-confirm.html',
                scope: $scope,
                controller: function ($scope) {
                    this.invitation = invitation;
                    this.text = $scope.text;
                    $scope.confirm = function () {
                        $location.path("/manage");
                    };
                },
                controllerAs: "model"
            });
    };


    $scope.go = function (path) {
        $location.path(path);
    };


}]);
angular.module("helpNow").controller("TomnodCtrl", ["$scope", "$location", "$resource", "Event", "$uibModal",
	function ($scope, $location, $resource, Event, $uibModal) {

	    $scope.orgEvents = [];
	    $scope.noEvents = true;

	    $scope.setTitle($scope.text.tomnod_title);
	    $scope.setCurrentView("manage_events");

	    //alert("data = " + JSON.stringify($scope.events));

	    $.each($scope.events, function(i, option) {
	        $('#event').append($('<option/>').attr("value", option.EventID).text(option.EventType.Description + " " + option.Summary + " (" + option.EventLocations[0].LAT + ", " + option.EventLocations[0].LONG + ", " + option.EventLocations[0].Radius + " km2)"));
	    });
	}]);
angular.module("helpNow").directive('showErrors', function () {
    return {
        restrict: 'A',
        require: '^form',
        link: function (scope, el, attrs, formCtrl) {
            // find the text box element, which has the 'name' attribute
            var inputEl = el[0].querySelector("[name]");
            // convert the native text box element to an angular element
            var inputNgEl = angular.element(inputEl);
            // get the name on the text box so we know the property to check
            // on the form controller
            var inputName = inputNgEl.attr('name');

            // only apply the has-error class after the user leaves the text box
            inputNgEl.bind('blur', function () {
                el.toggleClass('has-error', formCtrl[inputName].$invalid);
            });

            scope.$on('show-errors-check-validity', function () {
                el.toggleClass('has-error', formCtrl[inputName].$invalid);
            });
        }
    };
});

angular.module("helpNow").directive('latitude', function () {
    var LAT_REGEXP = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)/i;

    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$validators.latitude = function (modelValue, viewValue) {
                if (ctrl.$isEmpty(viewValue)) {
                    // not validating for empty value, only for valid
                    return true;
                }
                return LAT_REGEXP.test(viewValue);
            };
        }
    };
});

angular.module("helpNow").directive('longitude', function () {
    var LONG_REGEXP = /^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/i;

    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$validators.longitude = function (modelValue, viewValue) {
                if (ctrl.$isEmpty(viewValue)) {
                    // not validating for empty value, only for valid
                    return true;
                }
                return LONG_REGEXP.test(viewValue);
            };
        }
    };
});

angular.module("helpNow").directive("filters", function () {
    return {
        scope: {
            togglefunc: "=",
            classfunc: "="
        },
        templateUrl: 'views/fragments/resource-filters.html'
    };
});

angular.module("helpNow").directive('map', ['MapLayer', function (MapLayer) {
    return {
        link: function (scope, element, attrs) {
            var center = attrs.mapCenter.split(",");
            var zoom = attrs.mapZoom;
            var event = attrs.mapEvent;

            MapLayer.get({}, function (results) {
                var baseMapLayers = {};
                var overlayMapLayers = {};
                var baseMapLayer;
                var overlayMapLayer;

                var OWMAppId = '533e5eea3d1b3eb5d9616d2723cf4b6b';

                var clouds = L.OWM.clouds({ showLegend: true, opacity: 0.5, appId: OWMAppId });
                var cloudscls = L.OWM.cloudsClassic({ showLegend: true, opacity: 0.5, appId: OWMAppId });
                var precipitation = L.OWM.precipitation({ showLegend: true, opacity: 0.5, appId: OWMAppId });
                var precipitationcls = L.OWM.precipitationClassic({ showLegend: true, opacity: 0.5, appId: OWMAppId });
                var rain = L.OWM.rain({ showLegend: true, opacity: 0.5, appId: OWMAppId });
                var raincls = L.OWM.rainClassic({ showLegend: true, opacity: 0.5, appId: OWMAppId });
                var snow = L.OWM.snow({ showLegend: true, opacity: 0.5, appId: OWMAppId });
                var pressure = L.OWM.pressure({ showLegend: true, opacity: 0.5, appId: OWMAppId });
                var pressurecntr = L.OWM.pressureContour({ showLegend: true, opacity: 0.5, appId: OWMAppId });
                var temp = L.OWM.temperature({ showLegend: true, opacity: 0.5, appId: OWMAppId });
                var wind = L.OWM.wind({ showLegend: true, opacity: 0.5, appId: OWMAppId });
                var city = L.OWM.current({ intervall: 0, lang: 'en', appId: OWMAppId, temperatureUnit: 'F' });
                
                for (var i = 0; i < results.json.length; i++) {
                    var layer = results.json[i];
                    if (layer.MapLayerTypeID == 1 && (layer.EventID == event || layer.EventID == null)) {
                        if (layer.IsEsri == 1) {
                            var GBMREST = L.esri.tiledMapLayer({ url: layer.ImageryURL, attribution: layer.AttributionText });
                            baseMapLayers[layer.Name] = GBMREST;
                        }
                        else {
                            baseMapLayer = new L.tileLayer(
                                layer.ImageryURL, {
                                    attribution: layer.AttributionText,
                                    minZoom: layer.MinZoomLevel,
                                    maxZoom: layer.MaxZoomLevel
                                }
                            );
                            baseMapLayers[layer.Name] = baseMapLayer;
                        }
                    }
                    if (layer.MapLayerTypeID == 2 && (layer.EventID == event || layer.EventID == null)) {
                        if (layer.IsTSM == 1) {
                            overlayMapLayer = new L.tileLayer(
                                layer.ImageryURL, {
                                    attribution: layer.AttributionText,
                                    tms: true,
                                    minZoom: layer.MinZoomLevel,
                                    maxZoom: layer.MaxZoomLevel
                                }
                            );
                            overlayMapLayers[layer.Name] = overlayMapLayer;
                        }
                        else {
                            overlayMapLayer = new L.tileLayer(
                                layer.ImageryURL, {
                                    attribution: layer.AttributionText,
                                    minZoom: layer.MinZoomLevel,
                                    maxZoom: layer.MaxZoomLevel
                                }
                            );
                            overlayMapLayers[layer.Name] = overlayMapLayer;
                        }

                    }
                }

                overlayMapLayers["Precipitation"] = precipitationcls;
                overlayMapLayers["Pressure"] = pressure;
                overlayMapLayers["Temp"] = temp;
                overlayMapLayers["Wind"] = wind;
                overlayMapLayers["City Data"] = city;

                var map = new L.map('map', {
                    layers: [baseMapLayer],
                    maxBounds: [[-90.0, -180], [90.0, 180.0]]
                }).setView(center, zoom);

                L.control.scale().addTo(map);

                map.attributionControl.setPrefix('');

                L.control.layers(baseMapLayers, overlayMapLayers, null, {
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
            });
        }
    };
}]);

angular.module('helpNow').factory('ResourceLocationTransport', function ($resource) {
    return $resource('api/resourcelocationtransport/:id', null, {
        update: {
            method: 'PUT'
        }
    });
});
angular.module('helpNow').factory('ResourceRequest', function ($resource) {
    return $resource('api/resourcerequest/:id', null ,{
        update: {
            method: 'PUT'
        }
    });
});

angular.module('helpNow').factory('Account', function ($resource) {
    return $resource('api/account/:id', null ,{
        update: {
            method: 'PUT'
        }
    });
});

angular.module('helpNow').factory('api_interceptor', function($cookies, $location){
    return {
        'request': function (config) {
            config.headers = config.headers || {};
            if ($cookies.get('cookie.helpnowmap.org')) {
                config.headers.Authorization = 'JWT '+$cookies.get('cookie.helpnowmap.org');
            }
            return config;
        },
        'responseError': function (response) {
            if (response.status === 401 || response.status === 403) {
                alert("Unauthorized.  ");
                $location.path('/login');
            }
            return response;
        }
    };
});

angular.module('helpNow').config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('api_interceptor');
}]);
/**
 * Created by dsjennin on 12/18/2015.
 */


angular.module('helpNow').factory("DemoService",['$q',function($q){

    var worker = new Worker('doWork.js');
    var defer = $q.defer();
    worker.addEventListener('message', function(e) {
        console.log('Worker said: ', e.data);
        defer.resolve(e.data);
    }, false);

    return {
        doWork : function(myData){
            defer = $q.defer();
            worker.postMessage(myData); // Send data to our worker.
            return defer.promise;
        }
    };

}]);


angular.module('helpNow').factory('Event', function ($resource) {
    return $resource('api/event/:id', null ,{
        update: {
            method: 'PUT'
        }
    });
});

angular.module('helpNow').factory('EventLocation', function ($resource) {
    return $resource('api/eventlocation/:id', null ,{
        update: {
            method: 'PUT'
        }
    });
});

angular.module('helpNow').factory('Invitation', function ($resource) {
    return $resource('api/inviterequest/:inviteid', null ,{
        update: {
            method: 'PUT'
        }
    });
});






angular.module('helpNow').factory('MapLayer', function ($resource) {
    return $resource('api/maplayer/', null, {
        update: {
            method: 'PUT'
        }
    });
});
angular.module('helpNow').factory('Organization', function ($resource) {
    return $resource("/api/organization/:id", null ,{
        update: {
            method: 'PUT'
        }
    });
});

angular.module('helpNow').factory('Regulation', function ($resource) {
    return $resource('api/organizationregulation/:id', null ,{
     update: {
         method: 'PUT'
     }
    });
});



angular.module('helpNow').factory('ResourceLocation', function ($resource) {
    return $resource('api/resourcelocation/:id', null, {
        update: {
            method: 'PUT'
        }
    });
});
angular.module('helpNow').factory('ResourceLocationInventory', function ($resource) {
    return $resource('api/resourcelocationinventory/:id', null, {
        update: {
            method: 'PUT'
        }
    });
});
angular.module('helpNow').factory('ResourceLocationType', function ($resource) {
    return $resource('api/resourcelocationtype/:id', null, {
        update: {
            method: 'PUT'
        }
    });
});