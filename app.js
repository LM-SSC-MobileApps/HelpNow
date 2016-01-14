angular.module("helpNow", ["ngRoute", "ngResource", "ui.bootstrap", "ngSanitize" ])
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

		$routeProvider.when("/add_org/:orgTypeID/:orgID", {
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

		$routeProvider.when("/demo/", {
			templateUrl: "views/manage/demo.html"
		});
		
		$routeProvider.otherwise({
			templateUrl: "views/events.html"
		});
	}]);