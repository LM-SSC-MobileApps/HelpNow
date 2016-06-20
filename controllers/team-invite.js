/**
 * TeamInviteCtrl
 */

angular.module("helpNow").controller("TeamInviteCtrl", ["$scope", "$resource", "$routeParams", "Invitation", "$http", "$location", "$uibModal", function ($scope, $resource, $routeParams, Invitation, $http, $location, $uibModal) {

    $scope.newInvite = new Invitation();

    //TODO: Verify user is logged in before allowing submit
    $scope.newInvite.OrganizationID = $scope.currentOrg.OrganizationID;
    console.log("$scope.currentOrg.OrganizationID" + $scope.currentOrg.OrganizationID);
    //$scope.newInvite.OrganizationID = 1;


     $scope.sendInvite = function (invitation) {
      data= Invitation.save(invitation);
         
      $http.post('/postemail', $scope.invite).success(function (data, status,headers,config){
          $scope.confirmEmail(invitation);
      }).error(function (data, status,headers,config) {

      });


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