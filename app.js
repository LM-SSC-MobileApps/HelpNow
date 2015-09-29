angular.module("helpNow", ["ngRoute"])
	.config(function ($routeProvider) {
	    $routeProvider.when("/ind_login", {
	        templateUrl: "views/ind-login.html"
	    });

		$routeProvider.when("/org_login", {
			templateUrl: "views/org-login.html"
		});
		
		$routeProvider.when("/events", {
			templateUrl: "views/events.html"
		});
		
		$routeProvider.when("/event_map/:location/:eventType/:lat/:long/:eventRadius/:eventDate/:eventTime/:contactPhone", {
			templateUrl: "views/event-map.html"
		});
		
		$routeProvider.when("/gov_login", {
			templateUrl: "views/gov-login.html"
		});
		
		$routeProvider.otherwise({
			templateUrl: "views/events.html"
		});
	});