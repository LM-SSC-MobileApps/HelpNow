angular.module("helpNow").controller("NewMapLayerCtrl", ["$scope", "$http", "$location", "$routeParams", "$resource", function ($scope, $http, $location, $routeParams, $resource) {

    var map;
    var mapLayers = [];

    $scope.setCurrentView("new-map-layer");
    $scope.eventID = $routeParams.eventID * 1;
    $scope.mapLayerID = $routeParams.mapLayerID * 1;

    $scope.mapLayerTypeResource = $resource("/api/maplayertype/");
    $scope.mapLayerResource = $resource("/api/maplayer/:id");

    var existingMapLayer = false;

    if ($scope.mapLayerID > 0) {
        $scope.setTitle($scope.text.btn_update_map_layer);
        existingMapLayer = true;
        getMapLayers();
    }
    else {
        $scope.setTitle($scope.text.btn_new_map_layer);
        existingMapLayer = false;
        $scope.mapLayer = { MapLayerType: 'Base Map', UsesEsri: false, UsesTSM: false };
        $scope.selectedMapLayerType = { selectedMapLayerTypeID: '1' };
    }

    loadMapLayerTypes();

    function loadMapLayerTypes() {
        $scope.mapLayerTypeResource.get({}, function (data) {
            $scope.mapLayerTypes = data.json;
            $scope.selectedMapLayerType.selectedMapLayerType = $scope.mapLayerTypes[$scope.selectedMapLayerType.selectedMapLayerTypeID - 1];
            $scope.selectedMapLayerType.selectedMapLayerTypeDescription = $scope.selectedMapLayerType.selectedMapLayerType.Description;
            $scope.getSelectedMapLayerType();
        });
    }

    function getMapLayers() {
        $scope.mapLayerResource.get({id: $scope.mapLayerID}, function (data) {
            $scope.existingMapLayer = data.json;
            $scope.mapLayer = $scope.existingMapLayer[0];
            if ($scope.mapLayer.IsEsri) {
                $scope.mapLayer.UsesEsri = true;
            }
            else
            {
                $scope.mapLayer.UsesEsri = false;
            }
            if($scope.mapLayer.IsTSM)
            {
                $scope.mapLayer.UsesTSM = true;
            }
            else
            {
                $scope.mapLayer.UsesTSM = false;
            }
            if ($scope.mapLayer.MapLayerTypeID == 1)
            {
                $scope.mapLayer.MapLayerType = 'Base Map';
                $scope.selectedMapLayerType = { selectedMapLayerTypeID: '1' };
            }
            else if ($scope.mapLayer.MapLayerTypeID == 2)
            {
                $scope.mapLayer.MapLayerType = 'Map Overlay';
                $scope.selectedMapLayerType = { selectedMapLayerTypeID: '2' };
            }
        })
    }

    $scope.getSelectedMapLayerType = function () {
        $scope.mapLayer.MapLayerTypeID = $scope.selectedMapLayerType.selectedMapLayerType.MapLayerTypeID;
    };

    $scope.submitNewMapLayer = function () {
        var hasError = false;
        if (($scope.mapLayer.Name === undefined || $scope.mapLayer.Name == "" ||
            $scope.mapLayer.ImageryURL === undefined || $scope.mapLayer.ImageryURL == "" ||
            $scope.mapLayer.MinZoomLevel === undefined || $scope.mapLayer.MinZoomLevel == "" ||
            $scope.mapLayer.MaxZoomLevel === undefined || $scope.mapLayer.MaxZoomLevel == "")) {
            hasError = true;
        }

        if ($scope.mapLayer.MapLayerType === undefined || $scope.mapLayer.MapLayerType == "") {
            hasError = true;
        }

        if ($scope.mapLayer.UsesEsri) {
            $scope.mapLayer.IsEsri = 1;
        }
        else {
            $scope.mapLayer.IsEsri = 0;
        }

        if ($scope.mapLayer.UsesTSM) {
            $scope.mapLayer.IsTSM = 1;
        }
        else {
            $scope.mapLayer.IsTSM = 0;
        }

        if ($scope.eventID > 0) {
            $scope.mapLayer.EventID = $scope.eventID;
        }

        $scope.mapLayer.OrganizationID = $scope.currentOrg.OrganizationID;
        
        if (!hasError) {
            $scope.postNewMapLayer();
        }
        else {
            alert($scope.text.missing_fields_alert);
        }
        return false;
    };

    $scope.updateMapLayer = function () {
        var hasError = false;
        if (($scope.mapLayer.Name === undefined || $scope.mapLayer.Name == "" ||
            $scope.mapLayer.ImageryURL === undefined || $scope.mapLayer.ImageryURL == "" ||
            $scope.mapLayer.MinZoomLevel === undefined || $scope.mapLayer.MinZoomLevel == "" ||
            $scope.mapLayer.MaxZoomLevel === undefined || $scope.mapLayer.MaxZoomLevel == "")) {
            hasError = true;
        }

        if ($scope.mapLayer.MapLayerType === undefined || $scope.mapLayer.MapLayerType == "") {
            hasError = true;
        }

        if ($scope.mapLayer.UsesEsri) {
            $scope.mapLayer.IsEsri = 1;
        }
        else {
            $scope.mapLayer.IsEsri = 0;
        }

        if ($scope.mapLayer.UsesTSM) {
            $scope.mapLayer.IsTSM = 1;
        }
        else {
            $scope.mapLayer.IsTSM = 0;
        }

        if ($scope.eventID > 0) {
            $scope.mapLayer.EventID = $scope.eventID;
        }

        $scope.mapLayer.OrganizationID = $scope.currentOrg.OrganizationID;

        if (!hasError) {
            $scope.updateLayer();
        }
        else {
            alert($scope.text.missing_fields_alert);
        }
        return false;
    };

    $scope.postNewMapLayer = function () {
        var newMapLayer = JSON.stringify($scope.mapLayer);
        var webCall = $http({
            method: 'POST',
            url: '/api/maplayer',
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: newMapLayer
        });
        webCall.then(function (response) {
            $location.path("#");
        },
        function (response) { // optional
            alert("Error: " + response.data.err);
            $scope.hasSubmissionError = true;
        });
    }

    $scope.updateLayer = function () {
        var newMapLayer = JSON.stringify($scope.mapLayer);
        var webCall = $http({
            method: 'PUT',
            url: '/api/maplayer/' + $scope.mapLayer.MapLayerID,
            async: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: newMapLayer
        });
        webCall.then(function (response) {
            $location.path("#");
        },
        function (response) { // optional
            alert("Error: " + response.data.err);
            $scope.hasSubmissionError = true;
        });
    }

}]);