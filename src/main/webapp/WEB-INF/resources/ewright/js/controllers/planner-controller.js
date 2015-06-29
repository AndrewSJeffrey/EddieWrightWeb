angular.module('eWrightControllers')
    .controller('CalendarController', ['$scope', '$modal', 'EventService', 'ToasterService', 'blockUI',
        function ($scope, $modal, EventService, ToasterService, blockUI) {
            //These variables MUST be set as a minimum for the calendar to work
            $scope.calendarView = 'month';
            $scope.calendarDay = new Date();
            $scope.selectedDay = $scope.calendarDay;
            $scope.events = [
                {
                    title: 'An event',
                    type: 'warning',
                    startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
                    endsAt: moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
                    message: "This is the message that has been attached the event, does it really help to know this information?",
                    visibleTo: ['JIM', 'ENDO', 'SAM'],
                    createdBy: 'me',
                    createdOn: new Date(),
                    ticketID: 0


                }, {
                    title: 'A different kind of message',
                    type: 'info',
                    startsAt: moment().subtract(1, 'day').toDate(),
                    endsAt: moment().add(5, 'days').toDate(),
                    message: "This is the message that has been attached the event, does it really help to know this information?",
                    visibleTo: ['JIM', 'ENDO', 'SAM'],
                    createdBy: 'me',
                    createdOn: new Date(),
                    ticketID: 0
                }, {
                    title: 'This is a really long event title that occurs on every year',
                    type: 'important',
                    startsAt: moment().startOf('day').add(7, 'hours').toDate(),
                    endsAt: moment().startOf('day').add(19, 'hours').toDate(),
                    recursOn: 'year',
                    message: "This is the message that has been attached the event, does it really help to know this information?",
                    visibleTo: ['JIM', 'ENDO', 'SAM'],
                    createdBy: 'me',
                    createdOn: new Date(),
                    ticketID: 0
                }
            ];

            function eventsLoaded(events) {
                console.log("Events:" + events);
                $scope.events = events;
            }

            function refresh() {
                EventService.getAllEvents(eventsLoaded);
            }

            refresh();


            $scope.getSelectedEvents = function () {
                var selectedEvents = [];

                for (var i = 0; i < $scope.events.length; i++) {
                    var event = $scope.events[i];
                    var startDate = new Date((new Date(event.startsAt)).getTime());
                    startDate.setHours(0, 0, 0, 0);

                    var endDate = new Date((new Date(event.endsAt)).getTime());
                    endDate.setHours(0, 0, 0, 0);


                    if (between($scope.selectedDay.getTime(), startDate, endDate)) {
                        selectedEvents.push(event);
                    }
                }

                return selectedEvents;
            };

            function between(x, min, max) {
                return x >= min && x <= max;
            }

            /*
             var currentYear = moment().year();
             var currentMonth = moment().month();

             function random(min, max) {
             return Math.floor((Math.random() * max) + min);
             }

             for (var i = 0; i < 1000; i++) {
             var start = new Date(currentYear,random(0, 11),random(1, 28),random(0, 24),random(0, 59));
             $scope.events.push({
             title: 'Event ' + i,
             type: 'warning',
             startsAt: start,
             endsAt: moment(start).add(2, 'hours').toDate()
             })
             }*/

            $scope.open = function (event, size) {
                var modalInstance = $modal.open({
                    animation: false,
                    templateUrl: '/resources/ewright/templates/eventView.html',
                    controller: 'EventViewController',
                    size: size,
                    resolve: {
                        model: function () {
                            var model = {
                                event: event
                            };
                            return model;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                }, function () {
                });
            };


            $scope.edit = function (newEvent, event, size) {
                console.log("newEvent:" + newEvent);
                var modalInstance = $modal.open({
                    animation: false,
                    templateUrl: '/resources/ewright/templates/eventEdit.html',
                    controller: 'EventEditController',
                    size: 'lg',
                    resolve: {
                        model: function () {
                            var model = {
                                event: event,
                                newEvent: newEvent,
                                ToasterService: ToasterService,
                                EventService: EventService,
                                refresh : refresh,
                                blockUI : blockUI
                            };
                            return model;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                }, function () {
                });
            };


            $scope.eventClicked = function (event) {
                console.log(event);
                //  showModal('Clicked', event);
            };

            $scope.eventEdited = function (event) {
                console.log(event);
                // showModal('Edited', event);
            };

            $scope.eventDeleted = function (event) {
                console.log(event);
                //showModal('Deleted', event);
            };

            $scope.eventDropped = function (event) {
                console.log(event);
                //showModal('Dropped', event);
            };

            $scope.onTimeSpanClick = function (selectedDay) {
                $scope.selectedDay = selectedDay;
            };

            $scope.toggle = function ($event, field, event) {
                $event.preventDefault();
                $event.stopPropagation();
                event[field] = !event[field];
            };

        }]);


angular.module('eWrightControllers').controller('EventViewController', function ($scope, $modalInstance, model) {

    $scope.event = model.event;
    //  $scope.user = jQuery.extend(true, {}, model.user);
    // $scope.refUser = model.user;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.delete = function () {
        var user = setModifiedBy($scope.user);
        UserService.deleteUser(user, closeDialog(function () {
            ToasterService.createToast(ToasterService.PRIORITY.SUCCESS, "User " + user.username + " has been disabled.");
        }));
    };

    $scope.restore = function () {
        var user = setModifiedBy($scope.user);
        UserService.restoreUser(user, closeDialog(function () {
            ToasterService.createToast(ToasterService.PRIORITY.SUCCESS, "User " + user.username + " has been enabled.");
        }));
    };

    function setModifiedBy(user) {
        user.modifiedBy = AppModel.getLoggedInUser().username;
        return user;
    }

    function closeDialog(postClose) {
        return function () {
            $modalInstance.dismiss("closing");
            blockUI.stop();
            model.refresh();
            postClose();
        }
    }
});


angular.module('eWrightControllers').controller('EventEditController', function ($scope, $modalInstance, model) {

    $scope.model = model;
    $scope.event = model.event;
    $scope.date = new Date();
    var ToasterService = model.ToasterService;
    var EventService = model.EventService;
    var blockUI = model.blockUI;

    //  $scope.user = jQuery.extend(true, {}, model.user);
    // $scope.refUser = model.user;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.delete = function () {
        var user = setModifiedBy($scope.user);
        UserService.deleteUser(user, closeDialog(function () {
            ToasterService.createToast(ToasterService.PRIORITY.SUCCESS, "User " + user.username + " has been disabled.");
        }));
    };

    $scope.restore = function () {
        var user = setModifiedBy($scope.user);
        UserService.restoreUser(user, closeDialog(function () {
            ToasterService.createToast(ToasterService.PRIORITY.SUCCESS, "User " + user.username + " has been enabled.");
        }));
    };

    $scope.create = function () {
        blockUI.start();
        EventService.createEvent($scope.event, closeDialog(function () {
            ToasterService.createToast(ToasterService.PRIORITY.SUCCESS, "Event has been created.");
        }));

        /* var user = setModifiedBy($scope.user);
         UserService.restoreUser(user, closeDialog(function(){
         ToasterService.createToast(ToasterService.PRIORITY.SUCCESS, "User " + user.username + " has been enabled.");
         }));*/
    };

    function setModifiedBy(user) {
        user.modifiedBy = AppModel.getLoggedInUser().username;
        return user;
    }

    function closeDialog(postClose) {
        return function () {
            $modalInstance.dismiss("closing");
            blockUI.stop();
            model.refresh();
            if (postClose instanceof Function) {
                postClose();
            }
        }
    }
});