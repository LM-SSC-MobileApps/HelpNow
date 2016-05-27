angular.module("helpNow").controller("ManageEventsCtrl", ["$scope", "$location", "$resource", "Event", "$uibModal",
	function ($scope, $location, $resource, Event, $uibModal) {

	    $scope.orgEvents = [];
	    $scope.noEvents = true;

	    $scope.setTitle($scope.text.manage_events_title);
	    $scope.setCurrentView("manage_events");

	    filterEvents();
	    

	    function filterEvents() {
	        angular.forEach($scope.events, function (event) {
	            if (event.OrganizationID == $scope.currentOrg.OrganizationID) {
	                $scope.orgEvents.push(event);
	            }
	        });
	        if ($scope.orgEvents.length > 0) $scope.noEvents = false;
	    }

	    $scope.editEvent = function (event) {
	        $location.path("/new_event/" + event.EventID);
	    }
	    
	    $scope.disableEvent = function (event) {
	        var disabledEvent = event;
	        disabledEvent.Active = 0;
	        //Event.update({ id: event.EventID, Active: 0 }, disabledEvent);
	        $scope.modalInstance = $uibModal.open(
                    {
                        templateUrl: '/manage/event-modal-delete.html',
                        scope: $scope,
                        controller: function ($scope) {
                            this.disabledEvent = disabledEvent;
                            this.Event = Event;
                            this.text = $scope.text;

                            $scope.disableEvent = function () {
                                Event.update({ id: disabledEvent.EventID }, disabledEvent);
                                $location.path("/#");
                                $scope.loadEvents();
                            };
                        },
                        controllerAs: "model"
                    });
	    };

	}]);