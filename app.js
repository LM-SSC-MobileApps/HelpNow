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

		$routeProvider.when("/inventory", {
		    templateUrl: "views/inventory.html"
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