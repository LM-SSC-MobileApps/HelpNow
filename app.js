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

		$routeProvider.when("/update_account/:accountID/", {
		    templateUrl: "views/manage/update-account.html"
		});

		$routeProvider.when("/demo/", {
			templateUrl: "views/manage/demo.html"
		});
		
		$routeProvider.otherwise({
			templateUrl: "views/events.html"
		});
	}]);