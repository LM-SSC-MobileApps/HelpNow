angular.module("helpNow").controller("ManageMapLayersCtrl", ["$scope", "$location", "$route", "$resource", "MapLayer", "$uibModal",
	function ($scope, $location, $route, $resource, MapLayer, $uibModal) {

	    $scope.orgMapLayers = [];
	    $scope.noLayers = true;

	    $scope.setTitle($scope.text.manage_map_layers_title);
	    $scope.setCurrentView("manage_map_layers");

	    var mapLayersResource = $resource("/api/maplayer/:id");

	    filterMapLayers();

	    function filterMapLayers() {
	        mapLayersResource.get({}, function (data) {
	            $scope.mapLayers = data.json;
	            angular.forEach($scope.mapLayers, function (mapLayer) {
	                if (mapLayer.OrganizationID == $scope.currentOrg.OrganizationID) {
	                    $scope.orgMapLayers.push(mapLayer);
	                }
	            });
	            if ($scope.orgMapLayers.length > 0) $scope.noLayers = false;
	        });
	    }

	    $scope.editMapLayer = function (mapLayer) {
	        if (mapLayer.EventID != null && mapLayer.EventID > 0) {
	            $location.path("/new_map_layer/" + mapLayer.EventID + "/" + mapLayer.MapLayerID);
	        }
	        else
	        {
	            $location.path("/new_map_layer/0/" + mapLayer.MapLayerID);
	        }
	        
	    };

	    $scope.deleteMapLayer = function (mapLayer) {
	        var deletedMapLayer = mapLayer;
	        $scope.modalInstance = $uibModal.open(
                    {
                        templateUrl: '/manage/map-layer-modal-delete.html',
                        scope: $scope,
                        controller: function ($scope) {
                            this.deletedMapLayer = deletedMapLayer;
                            this.MapLayer = MapLayer;
                            this.text = $scope.text;

                            $scope.deleteMapLayer = function () {
                                mapLayersResource.delete({ id: deletedMapLayer.MapLayerID }, function (data) {
                                    $route.reload();
                                });
                            };
                        },
                        controllerAs: "model"
                    });
	    };

	}]);