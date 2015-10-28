angular.module('eWrightDirectives').directive('action', function () {


    var controller = ['$scope', 'LeadsService', 'blockUI', 'AppModel',
        '$modal', 'ToasterService', 'MenuService', 'ActionService', 'AppModel','UserService',
        function ($scope, LeadsService, blockUI, AppModel, $modal, ToasterService, MenuService, ActionService, AppModel, UserService) {

            $scope.model = {
                showNewAction: true,
                actions: [
                    {type: "PHONE", text: "Contact via phone"},
                    {type: "EMAIL", text: "Contact via email"},
                    {type: "APT_SC", text: "Appoint to sales controller"},
                    {type: "APT_OS", text: "Appoint to online sales"}
                ],
                currentAction: null,
                previousAction: null,
                startsAt: new DateObject(),
                datetime: new Date(),
                isNew: true,
                outcome: "",
                selectedType : null,
                assignableUsers : null,
                assignedUser : null
            };


            function model() {
                return $scope.model;
            }

            function showAction(data) {
                $scope.lead.assignedContact.currentAction = data.data;
                $scope.model.currentAction = $scope.lead.assignedContact.currentAction;
                if ($scope.model.currentAction) {
                    $scope.model.isNew = false;
                    $scope.model.datetime = new Date($scope.lead.assignedContact.currentAction.actionRequiredBy);
                    setType();
                }
            }

           $scope.getUserName = function() {

               UserService.get


           };

            if ($scope.lead.assignedContact) {
                ActionService.getLatestActionForContact($scope.lead.assignedContact.id, showAction);
            }

            function setType() {
                var type = null;
                for (var v in model().actions) {
                    if (model().actions[v].type == $scope.model.currentAction.type) {
                        type = model().actions[v];
                    }
                }
                model().selectedType = type;
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
                    model().datetime = new Date($scope.lead.assignedContact.currentAction.actionRequiredBy);
                    model().isNew = false;
                    setType();
                }
            };

            $scope.showNextNewPage = function () {
                if (model().isNew) {
                    $scope.model.currentAction.actionRequiredBy = model().datetime;
                    $scope.model.currentAction.type = model().selectedType.type;
                    $scope.model.currentAction.createdBy = AppModel.getLoggedInUser().id;
                    $scope.model.currentAction.assignedTo = model().assignedUser.id;

                    $scope.model.currentAction.messageId = $scope.lead.id;
                    $scope.model.currentAction.contactId = $scope.lead.assignedContact.id;
                    ActionService.createAction($scope.model.currentAction, createdAction);

                } else {
                    model().previousAction = model().currentAction;
                    model().currentAction = null;
                    model().isNew = true;
                    model().selectedType = null;
                    model().datetime = new Date();
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

            function setUsers(data) {
                model().assignableUsers = data.data;
            }


            $scope.$watch("model.selectedType", function() {
                if (model().selectedType != null) {
                    UserService.getByRole(model().selectedType.type, setUsers)
                }else {
                    model().assignableUsers = null
                }
            });

            $scope.$watch("model.password", function() {
              $scope.passwordMet();
            });

            $scope.passwordMet = function() {
                var availble = true;
                if (!model().isNew) {
                    var user = AppModel.getLoggedInUser();
                    if (model().currentAction.assignedTo != user.id) {
                        availble =  ($scope.model.password == user.password);
                        console.log($scope.model.password)
                        console.log(user.password)
                    }
                }

                console.log("available?: " + availble)
                return availble;
            };

            $scope.passwordReq = function() {
                var req = false;
                if (!model().isNew) {
                    var user = AppModel.getLoggedInUser();
                    req  = (model().currentAction.assignedTo != user.id);

                }
                return req;
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

