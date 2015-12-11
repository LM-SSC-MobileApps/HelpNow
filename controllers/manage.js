/**
 * ManageCtrl
 */

angular.module("helpNow").controller("ManageCtrl", ["$scope", "$location" , "$resource", "Invitation" ,  "$uibModal", function($scope, $location, $resource ,Invitation ,$uibModal) {


	$scope.invitesResource  = $resource("/api/inviterequest/organizationinvites/:accountid",
			{accountid: $scope.currentUser.AccountID});




	$scope.loadInvites = function() {
		$scope.invitesResource.get({}, function(data) {
			$scope.invites = data.json;
			$scope.$broadcast("InviteDataLoaded", {});
		});
	};

	$scope.loadInvites();


	$scope.deleteInvite = function (invitation) {
		$scope.modalInstance = $uibModal.open(
				{
					templateUrl: '/manage/invite-modal-delete.html',
					controller: function ($scope) {
						this.invitation = invitation;
						this.Invitation = Invitation;

						$scope.deleteInvite = function (invitation) {
							Invitation.delete({inviteid: invitation.InviteID});
							$location.path("/manage");
						};
					},
					controllerAs: "model"
				});
	};


	///account/organizationmembers/:id (id = AccountID)

	$scope.teamResource  = $resource("/api/account/organizationmembers/:accountid",
			{accountid: $scope.currentUser.AccountID});


	$scope.loadTeam = function() {
		$scope.teamResource.get({}, function(data) {
			$scope.team = data.json;
			$scope.$broadcast("TeamDataLoaded", {});
		});
	};

	$scope.loadTeam();





	$scope.go = function ( path ) {
		$location.path( path );
	};



}]);