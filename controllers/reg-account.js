angular.module("helpNow").controller("RegAccountCtrl", ["$scope", "$http", "$location", "$routeParams", "$resource", function ($scope, $http, $location, $routeParams, $resource) {
    $scope.setCurrentView("reg-account");
    $scope.setTitle("Register an Account");

    $scope.showUsername = true;
    $scope.showUser = false;

    $scope.userAccount = {OrganizationGroupID: 1, Active: true, AccountRoleID: 3, CreateDate: new Date()};

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
            $location.path('#');
        },
        function (response) { // optional
            alert("Error: ");
        });
    }
}]);