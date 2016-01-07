angular.module("helpNow").controller("AdministrationCtrl", ["$scope", "$location", "$resource", "Organization", "$uibModal", function ($scope, $location, $resource, Organization, $uibModal) {
    $scope.setTitle($scope.text.admin_title);

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
                $scope.setTitle($scope.text.admin_title);

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