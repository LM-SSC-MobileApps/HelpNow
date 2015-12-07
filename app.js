angular.module("helpNow", ["ngRoute", "ngResource", "ngAnimate", "ui.bootstrap" ])
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
		
		$routeProvider.otherwise({
			templateUrl: "views/events.html"
		});
	}]);