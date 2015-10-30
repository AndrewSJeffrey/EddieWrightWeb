angular.module('eWrightDirectives').directive('contact', function () {
    var controller = ['$scope','$modal' ,'blockUI' ,'ContactService', 'ToasterService', 'AppModel', function ($scope, $modal,blockUI, ContactService, ToasterService, AppModel) {

        $scope.model = {
            editMode : false,
            locked : true
        };

        function model() {
            return $scope.model;
        }

        function showContact(data) {
            $scope.contact = data.data;
        }

        if ($scope.task) {
            ContactService.getContactById($scope.task.contactId, showContact);
        }

        if (!$scope.contact && !$scope.task) {
            model().locked = false;
            model().newuser = true;
        }

        if ($scope.contact && !$scope.contact.id ){
            model().locked = false;
            model().newuser = true;
        }

        $scope.update = function () {
            blockUI.start();
            var contact = setModifiedBy($scope.contact);
            ContactService.updateContact(contact, function () {
                ToasterService.createToast(ToasterService.PRIORITY.SUCCESS, "Customer " + contact.firstName + " " + contact.surname + " has been updated.");
                blockUI.stop();
            });
        };

        $scope.create = function () {
            blockUI.start();
            var contact = setModifiedBy($scope.contact);
            ContactService.createContact(contact, function(){
                ToasterService.createToast(ToasterService.PRIORITY.SUCCESS, "Customer " + contact.firstName + " " + contact.surname + " has been created.");
                blockUI.stop();
            });
        };

        function setModifiedBy(contact) {
            contact.modifiedBy = AppModel.getLoggedInUser().username;
            return contact;
        }

    }];

    return {
        restrict: 'E',
        scope: {
            contact : "=contact",
            enquire : "@enquire",
            task : "=task"
        },
        controller: controller,
        templateUrl: '/resources/ewright/templates/contact.html',
        link: function (scope, elem, attrs) {
        },
        compile: function (tElem, attrs) {

        }
    };


});
