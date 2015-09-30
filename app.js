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
		
		$routeProvider.when("/event_map/:eventID", {
			templateUrl: "views/event-map.html"
		});
		
		$routeProvider.when("/gov_login", {
			templateUrl: "views/gov-login.html"
		});
		
		$routeProvider.when("/org_event/:eventID", {
			templateUrl: "views/org-event.html"
		});
		
		$routeProvider.otherwise({
			templateUrl: "views/events.html"
		});
	});