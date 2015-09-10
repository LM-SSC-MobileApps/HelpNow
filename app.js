angular.module("helpNow", ["ngRoute"])
	.config(function ($routeProvider) {
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
		
		$routeProvider.otherwise({
			templateUrl: "views/events.html"
		});
	});