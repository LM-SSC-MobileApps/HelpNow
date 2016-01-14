/**
 * AssignPocCtrl
 */

angular.module("helpNow").controller("AssignPocCtrl", ["$scope", "$resource", "$routeParams", "Organization", "$location", "$uibModal",
    function ($scope, $resource, $routeParams, Organization, $location, $uibModal) {


        $scope.teamResource = $resource("/api/account/organizationmembers/:accountid",
            {accountid: $scope.currentUser.AccountID});


        $scope.loadTeam = function () {
            $scope.teamResource.get({}, function (data) {
                $scope.team = data.json;
                $scope.$broadcast("TeamDataLoaded", {});
            });
        };

        $scope.loadTeam();


        $scope.orgResource = $resource("/api/organization/:id",
            {id: $scope.currentOrg.OrganizationID});


        $scope.loadOrg = function () {
            $scope.orgResource.get({}, function (data) {
                orgs = data.json;
                $scope.org = orgs[0];
                console.log("org.PrimaryPOC: " + $scope.org.PrimaryPOC);
                $scope.$broadcast("OrgDataLoaded", {});
            });
        };

        $scope.loadOrg();


        $scope.updateOrg = function (org) {
            Organization.update({id: $scope.currentOrg.OrganizationID}, org);
            $scope.modalInstance = $uibModal.open(
                {
                    templateUrl: '/manage/team-poc-modal-confirm.html',
                    scope: $scope,
                    controller: function ($scope) {
                        this.text = $scope.text;

                        $scope.confirm = function () {
                            $location.path("/manage");
                        };
                    },
                    controllerAs: "model"
                });
        };


        $scope.go = function (path) {
            $location.path(path);
        };


    }]);