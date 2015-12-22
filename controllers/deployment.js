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