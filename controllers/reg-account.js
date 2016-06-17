angular.module("helpNow").controller("RegAccountCtrl", ["$scope", "$http", "$location", "Invitation", "$routeParams", "$resource", function ($scope, $http, $location, Invitation, $routeParams, $resource) {
    $scope.setCurrentView("reg-account");
    $scope.setTitle($scope.text.reg_account_title);

    $scope.showUsername = true;
    $scope.showUser = false;

    $scope.inviteid = $routeParams.inviteID;

    $scope.inviteResource = $resource("/api/inviteRequest/:inviteid");

    $scope.userAccount = { Active: true, AccountRoleID: 2, CreateDate: new Date(), IsHashed: 0 };

    loadInviteRequest();

    function loadInviteRequest() {
        $scope.inviteResource.get({inviteid: $scope.inviteid}, function (data) {
            $scope.inviteRequest = data.json;

            if ($scope.inviteRequest == null || $scope.inviteRequest[0] == null || $scope.inviteRequest[0].OrganizationID <= 0) {
                alert("Invitation information could not be found.  Contact your organization's administrator for a new invitation.");
                $location.path('#');
            }
            else {
                $scope.userAccount.OrganizationID = $scope.inviteRequest[0].OrganizationID;
                $scope.userAccount.FirstName = $scope.inviteRequest[0].FirstName;
                $scope.userAccount.LastName = $scope.inviteRequest[0].LastName;
                $scope.userAccount.Email = $scope.inviteRequest[0].Email;
            }
        });
    }

    $scope.showUserForm = function () {
        var hasError = false;
        if ($scope.userAccount.Username === undefined || $scope.userAccount.Password === undefined || $scope.confirmedPassword === undefined) {
            alert($scope.text.missing_fields_alert);
            hasError = true;
        }
        else if ($scope.userAccount.Password != $scope.confirmedPassword) {
            alert($scope.text.password_mismatch_alert);
            hasError = true;
        }
        if (!hasError) {
            $scope.showUser = true;
            $scope.showUsername = false;
        }
    };

    $scope.showUsernameForm = function () {
        $scope.showUser = false;
        $scope.showUsername = true;
    };

    $scope.submitUserReg = function () {
        var hasError = false;
        if ($scope.userAccount.FirstName === undefined || $scope.userAccount.LastName === undefined || $scope.userAccount.Email === undefined) {
            alert($scope.text.missing_fields_alert);
            hasError = true;
        }
        if (!hasError) {
            submitPost();
        }
    };

    function submitPost() {
        var userAccountData = JSON.stringify($scope.userAccount);
        var webCall = $http({
            method: 'POST',
            url: '/api/account',
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: userAccountData
        });
        webCall.then(function (response) {
            alert("Account Successfully Created");
            Invitation.delete({inviteid: $scope.inviteid});
            $location.path('#');
        },
        function (response) { // optional
            alert("Error: ");
        });
    }
}]);