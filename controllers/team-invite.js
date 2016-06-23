/**
 * TeamInviteCtrl
 */

angular.module("helpNow").controller("TeamInviteCtrl", ["$scope", "$resource", "$routeParams", "Invitation", "$http", "$location", "$uibModal", function ($scope, $resource, $routeParams, Invitation, $http, $location, $uibModal) {

    $scope.newInvite = new Invitation();
    $scope.newInvite.OrganizationID = $scope.currentOrg.OrganizationID;
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

     $scope.sendInvite = function (invitation) {
     Invitation.save(invitation, function (data) {
         if (data.json) {
             $scope.confirmEmail(invitation);
             console.log("email success");
         }
         else {
             $scope.confirmEmailError();
             conole.log("email failed");
         }
     })
    };



    $scope.confirmEmail = function (invitation) {
        $scope.modalInstance = $uibModal.open(
            {
                templateUrl: '/manage/team-invite-modal-confirm.html',
                scope: $scope,
                controller: function ($scope) {
                    this.invitation = invitation;
                    this.text = $scope.text;
                    $scope.confirm = function () {
                        $location.path("/manage");
                    };
                },
                controllerAs: "model"
            });
    };

    $scope.confirmEmailError = function () {
        $scope.modalInstance = $uibModal.open(
            {
                templateUrl: '/manage/team-invite-modal-error.html',
                scope: $scope,
                controller: function ($scope) {

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