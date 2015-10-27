angular.module('eWrightDirectives').directive('contactContainer', function () {
    var controller = ['$scope','$modal' ,'blockUI' ,'ContactService', 'ToasterService', 'AppModel', function ($scope, $modal,blockUI, ContactService, ToasterService, AppModel) {
        $scope.model = {
            contacts: [],
            contactCount: 0,
            searchText: '',
            letters : ['-', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
            selectedLetter : 'A'
        };


        function model() {
            return $scope.model;
        }

        function handleDataLoad(data) {
            model().contacts = data;
        }

        function handleCount(data) {
            model().contactCount = data;
        }

        function refresh(id) {
            $scope.search();
        }

        $scope.getContacts = function() {
            return model().contacts;
        };


        //refresh();

        $scope.open = function (newuser, contact, size) {
            var modalInstance = $modal.open({
                animation: false,
                templateUrl: '/resources/ewright/templates/contactForm.html',
                controller: 'ContactInstanceCtrl',
                size: 'lg',
                resolve: {
                    model: function () {
                        var model = {
                            newuser: newuser,
                            contact: contact,
                            ContactService: ContactService,
                            blockUI: blockUI,
                            refresh : refresh,
                            ToasterService : ToasterService,
                            AppModel : AppModel

                        };
                        return model;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
            }, function () {
            });
        };

        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };

        $scope.setSelectedLetter = function(letter) {
            model().selectedLetter = letter;
            ContactService.searchContactsFirstName(model().selectedLetter, handleDataLoad);
        };

        $scope.search = function() {
            if (model().searchText.length > 2) {
            ContactService.searchContacts(model().searchText, handleDataLoad);
                } else {
                console.log("Search is too generic!!")
            }
        };

        $scope.setContact = function (contact) {
            $scope.text = contact;
        }


    }];

    return {
        restrict: 'E',
        scope: {
            text : "=text",
            enquire : "@enquire"

        },
        controller: controller,
        templateUrl: '/resources/ewright/templates/contactContainer.html',
        link: function (scope, elem, attrs) {
        },
        compile: function (tElem, attrs) {

        }
    };


});


angular.module('eWrightControllers').controller('ContactInstanceCtrl', [ '$scope', '$modalInstance', 'model', function ($scope, $modalInstance, model) {
    var ContactService = model.ContactService;
    var AppModel = model.AppModel;
    var blockUI = model.blockUI;
    var ToasterService = model.ToasterService;

    $scope.model = model;
    $scope.contact = jQuery.extend(true, {}, model.contact);
    $scope.refUser = model.user;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.delete = function () {
       // var user = setModifiedBy($scope.user);
       // UserService.deleteUser(user, closeDialog(function(){
        //    ToasterService.createToast(ToasterService.PRIORITY.SUCCESS, "User " + user.username + " has been disabled.");
       // }));
    };

    $scope.restore = function () {
      //  var user = setModifiedBy($scope.user);
       // UserService.restoreUser(user, closeDialog(function(){
        //    ToasterService.createToast(ToasterService.PRIORITY.SUCCESS, "User " + user.username + " has been enabled.");
       // }));
    };

    $scope.update = function () {
        blockUI.start();
        var contact = setModifiedBy($scope.contact);
        ContactService.updateContact(contact, closeDialog(function(){
           ToasterService.createToast(ToasterService.PRIORITY.SUCCESS, "Customer " + contact.firstName + " " + contact.surname + " has been updated.");
            blockUI.stop();
        }, contact.id));
    };

    $scope.create = function () {
        blockUI.start();
        var contact = setModifiedBy($scope.contact);
        ContactService.createContact(contact, closeDialog(function(){
            ToasterService.createToast(ToasterService.PRIORITY.SUCCESS, "Customer " + contact.firstName + " " + contact.surname + " has been created.");
            blockUI.stop();
        }, contact.id));
    };

    $scope.resetPassword = function () {
       // blockUI.start();
      //  var user = setModifiedBy($scope.user);
       // UserService.resetPassword(user, closeDialog(function(){
       //     ToasterService.createToast(ToasterService.PRIORITY.SUCCESS, "User " + user.username + " password reset email sent.");
       // }));
    };

    function setModifiedBy(contact) {
        contact.modifiedBy = AppModel.getLoggedInUser().username;
        return contact;
    }

    function closeDialog(postClose, id) {
        return function() {
            $modalInstance.dismiss("closing");
            blockUI.stop();
            model.refresh(id);
            postClose();
        }
    }
}]);
