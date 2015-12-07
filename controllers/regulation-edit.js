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
                controller: function ($scope) {
                    this.regulation = regulation;
                    this.Regulation = Regulation;

                    $scope.deleteReg = function () {
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
