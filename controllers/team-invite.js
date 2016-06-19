/**
 * TeamInviteCtrl
 */

angular.module("helpNow").controller("TeamInviteCtrl", ["$scope", "$resource", "$routeParams", "Invitation" , "$location", "$uibModal", function ($scope, $resource, $routeParams, Invitation , $location, $uibModal) {

    $scope.newInvite = new Invitation();

    //TODO: Verify user is logged in before allowing submit
    $scope.newInvite.OrganizationID = $scope.currentOrg.OrganizationID;
    console.log("$scope.currentOrg.OrganizationID" + $scope.currentOrg.OrganizationID);
    //$scope.newInvite.OrganizationID = 1;


    $scope.sendInvite = function (invitation) {
        Invitation.save(invitation);
        //send email here.....
        $scope.confirmEmail(invitation);
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


    $scope.go = function (path) {
        $location.path(path);
    };


}]);