angular.module("helpNow").controller("RegAccountCtrl", ["$scope", "$http", "$routeParams", "$resource", function ($scope, $http, $routeParams, $resource) {
    $scope.setCurrentView("reg-account");

    $scope.showUsername = true;
    $scope.showUser = false;

    $scope.userAccount = {OrganizationGroupID: 1, Active: true, AccountRoleID: 3};

    $scope.showUserForm = function () {
        var hasError = false;
        if ($scope.userAccount.Username === undefined || $scope.userAccount.Password === undefined || $scope.confirmedPassword === undefined) {
            alert("Missing field(s)");
            hasError = true;
        }
        else if ($scope.userAccount.Password != $scope.confirmedPassword) {
            alert("Passwords do not match");
            hasError = true;
        }
        if (!hasError)
        {
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
            alert("Missing field(s)");
            hasError = true;
        }
        if (!hasError) {
            alert("Org Group ID: " + $scope.userAccount.OrganizationGroupID
            + "\nUsername: " + $scope.userAccount.Username
            + "\nPassword: " + $scope.userAccount.Password
            + "\nFirst Name: " + $scope.userAccount.FirstName
            + "\nMiddle Initial: " + $scope.userAccount.MiddleInitial
            + "\nLast Name: " + $scope.userAccount.LastName
            + "\nEmail: " + $scope.userAccount.Email
            + "\nPhone: " + $scope.userAccount.Phone
            + "\nMobile Phone: " + $scope.userAccount.MobilePhone
            + "\nActive: " + $scope.userAccount.Active
            + "\nAccount Role ID: " + $scope.userAccount.AccountRoleID);
            //submitPost();
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
        },
        function (response) { // optional
            alert("Error: ");
        });
    }
}]);