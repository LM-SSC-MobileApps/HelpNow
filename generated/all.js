angular.module("helpNow", ["ngRoute", "ngResource", "ui.bootstrap", "ngSanitize" ])
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

		$routeProvider.when("/administration/", {
		    templateUrl: "views/admin/administration.html"
		});

		$routeProvider.when("/add_org/:orgTypeID", {
		    templateUrl: "views/admin/add-organization.html"
		});

		$routeProvider.when("/org_address/:orgID", {
		    templateUrl: "views/manage/org-address.html"
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

		$routeProvider.when("/assign_poc/", {
			templateUrl: "views/manage/assign-poc.html"
		});

		$routeProvider.when("/reg_account/", {
		    templateUrl: "views/reg-account.html"
		});
		
		$routeProvider.otherwise({
			templateUrl: "views/events.html"
		});
	}]);
angular.module("helpNow").controller("AdministrationCtrl", ["$scope", "$location", "$resource", "Organization", "$uibModal", function ($scope, $location, $resource, Organization, $uibModal) {
    $scope.setTitle("Government & Organization Administration");

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
                $scope.setTitle("Government & Organization Administration");

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

angular.module("helpNow").controller("AssignPocCtrl", ["$scope", "$resource", "$routeParams", "Organization" , "$location", "$uibModal",
    function ($scope, $resource, $routeParams, Organization , $location, $uibModal) {


       $scope.teamResource  = $resource("/api/account/organizationmembers/:accountid",
            {accountid: $scope.currentUser.AccountID});


        $scope.loadTeam = function() {
            $scope.teamResource.get({}, function(data) {
                $scope.team = data.json;
                $scope.$broadcast("TeamDataLoaded", {});
            });
        };

        $scope.loadTeam();


        $scope.orgResource  = $resource("/api/organization/:id",
            {id: $scope.currentOrg.OrganizationID});


        $scope.loadOrg = function() {
            $scope.orgResource.get({}, function(data) {
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
                    controller: function ($scope) {

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

angular.module("helpNow").controller("DemoCtrl", ["$scope", "DemoService", "Event", "$location",
    function ($scope, DemoService, Event, $location) {

        $scope.started = false;


        $scope.startDemo = function () {
            // console.log($scope.started);
            $scope.started = true;
            var event = demoEvents[0];
            var eventResponse = Event.save(event);

        }

        $scope.createProduct = function (product) {
            $http.post(baseUrl, product).success(function (newProduct) {
                $scope.products.push(newProduct);
                $scope.displayMode = "list";
            });
        }

        $scope.go = function (path) {
            $location.path(path);
        };

        var demoEvents = [

            {
                "EventTypeID": 1,
                "OrganizationID": 1,
                "Summary": "Flood",
                "Active": "true"
            }
        ];

    }]);
angular.module("helpNow").controller("DeploymentCtrl", ["$scope", "$routeParams", "$resource", "$sce", "$location", "$http", 
	function ($scope, $routeParams, $resource, $sce, $location, $http) {
	
	$scope.deploymentsResource = $resource("/api/resourcelocation/:id");
	
	if ($routeParams.locationID) {
		$scope.deployment = {};
		$scope.deploymentsResource.get({id: $routeParams.locationID}, function(data) {
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
			ResourceLocationTypeID: 1,
			OrganizationID: $scope.currentOrg.OrganizationID,
			ResourceLocationStatusID: "1"
		};
	}
	
	if ($scope.events) {
	    $scope.event = $scope.getEvent($scope.deployment.EventID);
	}
	
	$scope.$on("EventDataLoaded", function() {
		$scope.event = $scope.getEvent($scope.deployment.EventID);
	});
	
	$scope.cancel = function() {
		var url = "org_event/" + $scope.deployment.EventID;
		alert(url);
		$location.path(url);
	};
	
	$scope.saveDeployment = function() {
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
				alert(response.data.json.ResourceLocationID);
			}, 
			function errorCallback(response) {
				alert(response.data.err);
			}
		);
	}
	
	$scope.getResourceIcon = function (inventory) {
	    var resourceType = inventory.ResourceType.Description;
		
	    if (resourceType == "Water") {
	        return "style/images/Water.png";
	    } else if (resourceType == "First Aid") {
	        return "style/images/First Aid.png";
	    } else if (resourceType == "Shelter") {
	        return "style/images/Shelter.png";
	    } else if (resourceType == "Evacuation") {
	        return "style/images/Evacuation.png";
	    } else if (resourceType == "Medicine") {
	        return "style/images/Medicine-.png";
	    } else {
	        return "style/images/Food.png";
	    }
	};
}]);
angular.module("helpNow").controller("EventListCtrl", ["$scope", "$location", function($scope, $location) {
    var map;

    $scope.setTitle("Worldwide Events")
	
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
	
	$scope.filterFlags = {
		showMedical: true,
		showShelter: true,
		showFood: true,
		showWater:true,
		showEvacuation: true,
		showMedicine: true
	};
	
	$scope.needFlags = {
		showMedical: false,
		showShelter: false,
		showFood: false,
		showWater:false,
		showEvacuation: false,
		showMedicine: false
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
	
	$scope.toggleFilterClass = function(id) {
		var flags = $scope.filterFlags;
		var status = flags[id];
		return status ? "btn btn-toggle active" : "btn btn-toggle";
	};
	
	$scope.toggleNeedsClass = function(id) {
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
        var hasSubmissionError = false;
		var flags = $scope.needFlags;
            
        if ($scope.showNeeds) {
			if (!flags.showMedical && !flags.showShelter && !flags.showFood &&
                !flags.showMedicine && !flags.showWater && !flags.showEvacuation) {
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
                $scope.helpRequest.ResourceTypeID = '1';
                postNeedRequest();
            }
            if (flags.showMedicine) {
                $scope.helpRequest.ResourceTypeID = '6';
                postNeedRequest();
            }
            if (flags.showWater) {
                $scope.helpRequest.ResourceTypeID = '2';
                postNeedRequest();
            }
            if (flags.showEvacuation) {
                $scope.helpRequest.ResourceTypeID = '5';
                postNeedRequest();
            }
            resetNeedsButtons();
            map.removeLayer($scope.locationOutline);
            $scope.showNeeds = !$scope.showNeeds;
            $scope.showEventDetails = !$scope.showEventDetails;
            if (!$scope.hasSubmissionError) {
                alert("Request(s) successfully submitted");
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
angular.module("helpNow").controller("GovLoginCtrl", ["$scope", function($scope) {
	$scope.setCurrentView("govs");
}]);
angular.module("helpNow").controller("IndLoginCtrl", ["$scope", function($scope) {
	$scope.setCurrentView("inds");
}]);
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
angular.module("helpNow").controller("LoginCtrl", ["$scope", "$http", "$location", "$routeParams", "$resource", function ($scope, $http, $location, $routeParams, $resource) {
    $scope.setCurrentView("login");
    $scope.setTitle("Login");

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
                var userSessionObject = {
                    AccountID: $scope.currentUser.AccountID,
                    FirstName: $scope.currentUser.FirstName,
                    LastName: $scope.currentUser.LastName,
                    OrganizationID: $scope.currentUser.Organization.OrganizationID,
                    OrganizationName: $scope.currentUser.Organization.Name
                };
                $scope.setCurrentUser(userSessionObject);
                $scope.setCurrentOrg($scope.currentUser.Organization);
                sessionStorage.setItem("user", JSON.stringify(userSessionObject));
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

angular.module("helpNow").controller("ManageCtrl", ["$scope", "$location" , "$resource", "Invitation" ,  "$uibModal", "Account",
	function($scope, $location, $resource ,Invitation ,$uibModal, Account) {


	$scope.invitesResource  = $resource("/api/inviterequest/organizationinvites/:accountid",
			{ accountid: $scope.currentUser.AccountID });
	$scope.orgResource = $resource("/api/organization/:id", { id: $scope.currentOrg.OrganizationID });

	$scope.setTitle("Organization Management");


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
					controller: function ($scope) {
						this.invitation = invitation;
						this.Invitation = Invitation;

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
					controller: function ($scope) {
						this.teamMember = teamMember;
						this.Account = Account;

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

	$scope.go = function ( path ) {
		$location.path( path );
	};

}]);
angular.module("helpNow").controller("OrgAddressCtrl", ["$scope", "$http", "$location", "Organization", "$routeParams", "$resource", function ($scope, $http, $location, Organization, $routeParams, $resource) {
    $scope.setCurrentView("org-address");
    $scope.setTitle("Organization Address");

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
            alert(JSON.stringify(response));
            alert("Address Successfully Submitted");
            $location.path('#');
        },
        function (response) { // optional
            alert(JSON.stringify(response));
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
        alert(JSON.stringify($scope.org));
        $scope.org.AddressID = addressID;
        var orgAddressData = JSON.stringify($scope.org);
        alert(orgAddressData);
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
            alert(JSON.stringify(response));
            $location.path('#/manage');
        },
        function (response) { // optional
            alert(JSON.stringify(response));
        });
    }
}]);
angular.module("helpNow").controller("OrgEventCtrl", ["$scope", "$routeParams", "$resource", "$sce", "$location", 
	function ($scope, $routeParams, $resource, $sce, $location) {
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
	$scope.showDeployPanel = false;
	$scope.showDeploymentPanel = false;
	
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
	$scope.deployment = {}
	
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
		
		if ($scope.showFindPanel && $scope.mappingLoc.LAT && $scope.mappingLoc.LONG) {
			$scope.locationOutline = L.circle([$scope.mappingLoc.LAT, $scope.mappingLoc.LONG], 250).addTo(map);
		} else if ($scope.showDeployPanel && $scope.deployment.LAT && $scope.deployment.LONG) {
			$scope.locationOutline = L.circle([$scope.deployment.LAT, $scope.deployment.LONG], 250).addTo(map);
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
	    $scope.setTitle($scope.event.EventLocations[0].Description, $scope.getEventIcon($scope.event.EventType.Description));
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
			$scope.buildLocationMarkers($scope.locations, mapLayers, $scope.filterFlags, locationClicked);
		
		if ($scope.showDistCenterMarkers)
			buildDistCenterMarkers();
		
		angular.forEach(mapLayers, function(layer) {
			map.addLayer(layer);
		});
	}
	
	function locationClicked(location) {
		closePanels();
		$scope.deployment = location;
		$scope.showDeploymentPanel = true;
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
            } else if ($scope.showDeployPanel) {
				$scope.deployment.LAT = e.latlng.lat.toFixed(3);
                $scope.deployment.LONG = e.latlng.lng.toFixed(3);
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
	};
	
	$scope.toggleFindPanel = function() {	
		$scope.showFindPanel = !$scope.showFindPanel;
		if ($scope.showFindPanel) {
			$scope.showDistCenterMarkers = true;
			requestLocation();
			updateMap();
		} else {
			removeLocationMarker();
		}
	};
	
	$scope.toggleDeployPanel = function() {
		$scope.showDeployPanel = !$scope.showDeployPanel;
		if ($scope.showDeployPanel) {
			requestLocation();
			$scope.showDistCenterMarkers = true;
			updateMap();
		}
	}

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
	
	$scope.closeDeploymentPanel = function() {
		$scope.showDeploymentPanel = false;
	};
	
	$scope.panelIsOpen = function() {
		return $scope.showFindPanel || $scope.showFilters || $scope.showDeployPanel || $scope.showDeploymentPanel;
	};
	
	$scope.createDeployment = function() {
		var url = "create_deployment/" + $scope.eventID + "/" + $scope.deployment.LAT + "/" + $scope.deployment.LONG;
		$location.path(url);
	};
	
	$scope.modifyDeployment = function() {
		var url = "modify_deployment/" + $scope.deployment.ResourceLocationID;
		$location.path(url);
	}
	
	$scope.setCurrentView("org-event");
}]);


angular.module("helpNow").controller("OrganizationAddCtrl", ["$scope", "$resource", "$routeParams", "Organization", "$location", function ($scope, $resource, $routeParams, Organization, $location) {

    $scope.orgTypeID = $routeParams.orgTypeID * 1;
    $scope.newOrg = new Organization();
    $scope.newOrg.OrganizationTypeID = $scope.orgTypeID;
    $scope.orgType = $scope.orgTypeID == 1 ? "Government" : "Organization";

    $scope.setTitle("Create " + $scope.orgType);

    $scope.go = function (path) {
        $location.path(path);
    };

    $scope.addOrg = function (org) {
        Organization.save(org).$promise.then(function (response) {
            $location.path('/administration');
        },
        function (response) { // optional
            alert("Error: ");
        });;
    };

    $scope.enterAddress = function (org) {
        Organization.save(org).$promise.then(function (response) {
            var returnedOrg = response.json[0];
            $location.path('/org_address/' + returnedOrg.OrganizationID);
        },
        function (response) { // optional
            alert("Error: ");
        });;;
    };

}]);

angular.module("helpNow").controller("RegAccountCtrl", ["$scope", "$http", "$location", "$routeParams", "$resource", function ($scope, $http, $location, $routeParams, $resource) {
    $scope.setCurrentView("reg-account");
    $scope.setTitle("Register an Account");

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

	$scope.setShowLogin = function () {
	    if ($scope.currentUser) {
	        $scope.showLogin = false;
	    }
	    else {
	        $scope.showLogin = true;
	    }
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
			marker.on("click", function() {
				$scope.$apply(function() {
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
	$scope.setShowLogin();

	$scope.redirectToLogin = function () {
	    $scope.showLogin = false;
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
/**
 * TeamInviteCtrl
 */

angular.module("helpNow").controller("TeamInviteCtrl", ["$scope", "$resource", "$routeParams", "Invitation" , "$location", "$uibModal", function ($scope, $resource, $routeParams, Invitation , $location, $uibModal) {

    $scope.newInvite = new Invitation();

    //TODO: Verify user is logged in before allowing submit
    $scope.newInvite.OrganizationID = $scope.currentOrg.OrganizationID;
    console.log("$scope.currentOrg.OrganizationID" + $scope.currentOrg.OrganizationID);
    //$scope.newInvite.OrganizationID = 1;


    $scope.sendInvite = function (invitation) {
        Invitation.save(invitation);
        $scope.confirmEmail(invitation);
    };


    $scope.confirmEmail = function (invitation) {
        $scope.modalInstance = $uibModal.open(
            {
                templateUrl: '/manage/team-invite-modal-confirm.html',
                controller: function ($scope) {
                    this.invitation = invitation;
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
angular.module("helpNow").directive("filters", function () {
    return {
        scope: {
            togglefunc: "=",
            classfunc: "="
        },
        templateUrl: 'views/fragments/resource-filters.html'
    }
});

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

            /*var hybrid = new L.tileLayer('https://{s}.tiles.mapbox.com/v4/digitalglobe.n6nhclo2/{z}/{x}/{y}.png?access_token=' + api_key, {
			    minZoom: 2,
			    maxZoom: 19,
			    attribution: '(c) <a href="http://microsites.digitalglobe.com/interactive/basemap_vivid/">DigitalGlobe</a> , (c) OpenStreetMap, (c) Mapbox'
			});*/

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

            var openStreetMap = new L.tileLayer(
              'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  attribution: mbAttr,
                  noWrap: true,
                  minZoom: 2,
                  maxZoom: 18
              }
            );

            var baseLayer = L.tileLayer('https://{s}.tiles.mapbox.com/v4/digitalglobe.n6nhclo2/{z}/{x}/{y}.png?access_token=' + api_key, {
                minZoom: 2,
                maxZoom: 19,
                attribution: '(c) <a href="http://microsites.digitalglobe.com/interactive/basemap_vivid/">DigitalGlobe</a> , (c) OpenStreetMap, (c) Mapbox'
            });

            var map = new L.map('map', {
                layers: [baseLayer],
                maxBounds: [[-90.0, -180], [90.0, 180.0]]
            }).setView(center, zoom);

            L.control.scale().addTo(map);

            map.attributionControl.setPrefix('');
            var overlays = {
                "Base Open Street Maps": openStreetMap,
                "DigitalGlobe Basemap +Vivid with Streets": baseLayer,
                "DigitalGlobe Basemap: REST": GBMREST
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
angular.module('helpNow').factory('Account', function ($resource) {
    return $resource('api/account/:id', null ,{
        update: {
            method: 'PUT'
        }
    });
});

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