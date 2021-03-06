/**
 * RegulationEditCtrl
 */
angular.module("helpNow").controller("RegulationEditCtrl", ["$scope", "$resource", "$routeParams", "Regulation", "$location", "$uibModal", function ($scope, $resource, $routeParams, Regulation, $location, $uibModal) {

    $scope.regulationResource = Regulation.get({id: $routeParams.organizationRegulationsID}, function (data) {
        $scope.editRegulations = data.json;
        $scope.editReg = $scope.editRegulations[0];
        $scope.$broadcast("RegulationDataLoaded", {});
    });

    $scope.updateRegulation = function (regulation) {
        Regulation.update({id: $routeParams.organizationRegulationsID}, regulation);
        $location.path("/regulations");
    };

    $scope.deleteRegulation = function (regulation) {
        $scope.modalInstance = $uibModal.open(
            {
                templateUrl: '/manage/regulations-modal-delete.html',
                scope: $scope,
                controller: function ($scope) {
                    this.regulation = regulation;
                    this.Regulation = Regulation;
                    this.text = $scope.text;

                    $scope.deleteReg = function () {
                        console.log("regulation.OrganizationRegulationsID" + regulation.OrganizationRegulationsID);
                        Regulation.delete({id: regulation.OrganizationRegulationsID});
                        $location.path("/regulations");
                    };
                },
                controllerAs: "model"
            });
    };

    $scope.go = function (path) {
        $location.path(path);
    };
}]);
