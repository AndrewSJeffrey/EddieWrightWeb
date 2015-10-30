angular.module('eWrightDirectives').directive('action', function () {


    var controller = ['$scope', 'LeadsService', 'blockUI', 'AppModel',
        '$modal', 'ToasterService', 'MenuService', 'ActionService', 'AppModel', 'UserService', 'ContactService',
        function ($scope, LeadsService, blockUI, AppModel, $modal, ToasterService, MenuService, ActionService, AppModel, UserService, ContactService) {

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
                datetime: new Date(),
                isNew: true,
                selectedType: null,
                assignableUsers: null,
                assignedUser: null,
                assignedTo: null
            };

            if ($scope.lead && $scope.lead.assignedContact) {
                ActionService.getLatestActionForContact($scope.lead.assignedContact.id, showAction);
            }

            if ($scope.task) {
                $scope.lead = {
                    id: null,
                    assignedContact: null
                };
                console.log("load task");
                loadMessage();
            }

            function setContact(data) {
                $scope.lead.assignedContact = data.data;
                if ($scope.lead.assignedContact) {
                    ActionService.getLatestActionForContact($scope.lead.assignedContact.id, showAction);
                }
            }

            function loadMessage() {
                console.log($scope.task);
                ContactService.getContactById($scope.task.contactId, setContact)
            }

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
                    getUserName();
                }
            }

            function userNameLoaded(data) {
                console.log(data.data)
                model().assignedTo = data.data.username;
            }

            function getUserName() {
                UserService.getUser(model().currentAction.assignedTo, userNameLoaded)
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

                    if (model().previousAction) {
                        $scope.model.currentAction.outcome = model().previousAction.outcome
                    }

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

            function setUsers(data) {
                model().assignableUsers = data.data;
            }

            $scope.$watch("model.selectedType", function () {
                if (model().selectedType != null) {
                    UserService.getByRole(model().selectedType.type, setUsers)
                } else {
                    model().assignableUsers = null
                }
            });

            $scope.$watch("model.password", function () {
                $scope.passwordMet();
            });

            $scope.passwordMet = function () {
                var availble = true;
                if (!model().isNew) {
                    var user = AppModel.getLoggedInUser();
                    if (model().currentAction.assignedTo != user.id) {
                        availble = ($scope.model.password == user.password);
                    }
                }
                return availble;
            };

            $scope.passwordReq = function () {
                var req = false;
                if (!model().isNew) {
                    var user = AppModel.getLoggedInUser();
                    req = (model().currentAction.assignedTo != user.id);

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
            hide: "&hide",
            task: "=task"
        },
        controller: controller,
        templateUrl: '/resources/ewright/templates/actions.html',
        link: function (scope, elem, attrs) {

        },
        compile: function (tElem, attrs) {
        }
    };
});

