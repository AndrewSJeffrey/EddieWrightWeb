angular.module('eWrightDirectives').directive('action', function () {


    var controller = ['$scope', 'LeadsService', 'blockUI', 'AppModel', '$modal', 'ToasterService', 'MenuService', 'ActionService', 'AppModel',
        function ($scope, LeadsService, blockUI, AppModel, $modal, ToasterService, MenuService, ActionService, AppModel) {

            $scope.model = {
                showNewAction: true,
                actions: [
                    {type: "PHONE", text: "Contact via phone"},
                    {type: "EMAIL", text: "Contact via email"},
                    {type: "APT_SC", text: "Appoint to sales controller"},
                    {type: "APT_OS", text: "Appoint to online sales"},
                    {type: "DISCARD", text: "Discard message"}
                ],
                currentAction: null,
                previousAction: null,
                startsAt: new DateObject(),
                datetime: new Date(),
                isNew: true,
                outcome: ""

            };


            function model() {
                return $scope.model;
            }

            if ($scope.lead.assignedContact) {
                $scope.model.currentAction = $scope.lead.assignedContact.currentAction;
                if ($scope.model.currentAction) {
                    $scope.model.isNew = false;
                    $scope.model.datetime = new Date($scope.lead.assignedContact.currentAction.actionRequiredBy);
                }
            }

            $scope.onTimeSet = function (newDate, oldDate) {
                console.log(newDate);
                console.log(newDate.localDateValue);
                console.log(oldDate);
            };

            function createdAction() {
                ToasterService.createToast(ToasterService.PRIORITY.SUCCESS, "New Action Created '" + $scope.model.currentAction.reason + "'");
                $scope.hide();
            }


            $scope.showBackPage = function () {
                if (model().previousAction) {
                    model().currentAction = model().previousAction;
                    model().previousAction = null;
                    model().isNew = false;
                }
            };

            $scope.showNextNewPage = function () {
                if (model().isNew) {
                    $scope.model.currentAction.actionRequiredBy = model().datetime;
                    $scope.model.currentAction.type = model().selectedType;

                    $scope.model.currentAction.createdBy = AppModel.getLoggedInUser().id;
                    $scope.model.currentAction.assignedTo = AppModel.getLoggedInUser().id;

                    $scope.model.currentAction.messageId = $scope.lead.id;
                    $scope.model.currentAction.contactId = $scope.lead.assignedContact.id;
                    ActionService.createAction($scope.model.currentAction, createdAction);

                } else {
                    model().previousAction = model().currentAction;
                    model().currentAction = null;
                    model().isNew = true;
                }
            };

            function DateObject() {

                var tempDate = new Date();
                var localOffset = tempDate.getTimezoneOffset() * 60000;
                this.utcDateValue = tempDate.getTime();
                this.selectable = true;

                this.localDateValue = function () {
                    return this.utcDateValue + localOffset;
                };

                var validProperties = ['utcDateValue', 'localDateValue', 'display', 'active', 'selectable', 'past', 'future'];

                for (var prop in arguments[0]) {
                    /* istanbul ignore else */
                    //noinspection JSUnfilteredForInLoop
                    if (validProperties.indexOf(prop) >= 0) {
                        //noinspection JSUnfilteredForInLoop
                        this[prop] = arguments[0][prop];
                    }
                }
            }

        }
    ];


    return {
        restrict: 'E',
        replace: 'true',
        scope: {
            lead: "=lead",
            hide : "&hide"
        },
        controller: controller,
        templateUrl: '/resources/ewright/templates/actions.html',
        link: function (scope, elem, attrs) {

        },
        compile: function (tElem, attrs) {
        }
    };
});

