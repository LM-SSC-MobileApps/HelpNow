/**
 * TeamInviteCtrl
 */

angular.module("helpNow").controller("TeamInviteCtrl", ["$scope", "$resource", "$routeParams", "Invitation", "$http", "$location", "$uibModal", function ($scope, $resource, $routeParams, Invitation, $http, $location, $uibModal) {

    $scope.newInvite = new Invitation();
    $scope.newInvite.OrganizationID = $scope.currentOrg.OrganizationID;
     $scope.sendInvite = function (invitation) {
     Invitation.save(invitation, function (data) {
         $scope.inviteResponse = angular.fromJson(data.json[0]);
        //console.log("inviteResponse.InviteID: " + $scope.inviteResponse.InviteID )
        // console.log("inviteResponse.Email: " + $scope.inviteResponse.Email )
         var postdata = 'email=' +  $scope.inviteResponse.Email +  '&' + 'InviteID=' +  $scope.inviteResponse.InviteID;
         var webCall = $http({
             method: 'POST',
             url: '/postemail',
             async: true,
             headers: {
                 'Content-Type': 'application/x-www-form-urlencoded'
             },
             data: postdata
         });

         webCall.then(function (response) {});
         $scope.confirmEmail(invitation);

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


    $scope.go = function (path) {
        $location.path(path);
    };


}]);