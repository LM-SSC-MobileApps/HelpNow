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
		
		var resourceTypes = ["None", "Water", "Food", "Shelter", "First Aid", "Clothing", "Medicine"];
		
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
			request.RequestUrgencyID = Math.round(Math.random() * 5) + 1;
			
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
