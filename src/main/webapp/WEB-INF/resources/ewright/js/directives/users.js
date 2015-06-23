angular.module('eWrightDirectives').directive('users', function () {


    var controller = ['$scope', 'UserService', 'blockUI', 'AppModel', '$modal', function ($scope, UserService, blockUI, AppModel, $modal) {
        $scope.rowCollection = AppModel.getAllUsers();
        $scope.displayedCollection = [];


        function processData(data) {
            $scope.rowCollection = data;
            $scope.displayedCollection = [].concat(data);
        }

        UserService.getAllUsers(processData);


        $scope.removedRowColor = function (row) {
            if (row.removed) {
                return {'backgroundColor': '#FFFFCC'}
            }
            return null;
        };

        $scope.refresh = function () {
            UserService.getAllUsers(processData);
        };

        $scope.open = function (newuser, user, size) {
            var modalInstance = $modal.open({
                animation: false,
                templateUrl: '/resources/ewright/templates/userForm.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    model: function () {
                        var model = {
                            newuser: newuser,
                            user: user,
                            UserService: UserService,
                            AppModel: AppModel,
                            blockUI: blockUI,
                            refresh : $scope.refresh

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


    }];


    return {
        restrict: 'E',
        replace: 'true',
        scope: true,
        controller: controller,
        templateUrl: '/resources/ewright/templates/users.html',
        link: function (scope, elem, attrs) {

        },
        compile: function (tElem, attrs) {
        }
    };
});

angular.module('eWrightControllers').controller('ModalInstanceCtrl', function ($scope, $modalInstance, model) {
    var UserService = model.UserService;
    var AppModel = model.AppModel;
    var blockUI = model.blockUI;

    $scope.model = model;
    $scope.user = jQuery.extend(true, {}, model.user);
    $scope.refUser = model.user;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.delete = function () {
        var user = setModifiedBy($scope.user);
        UserService.deleteUser(user, closeDialog);
        $modalInstance.dismiss('delete');
    };

    $scope.restore = function () {
        var user = setModifiedBy($scope.user);
        UserService.restoreUser(user, closeDialog);
        $modalInstance.dismiss('restore');
    };

    $scope.update = function () {
        var user = setModifiedBy($scope.user);
        UserService.updateUser(user, closeDialog);
        $modalInstance.dismiss('update');
    };

    $scope.create = function () {
        blockUI.start();
        var user = setModifiedBy($scope.user);
        UserService.createNewUser(user, closeDialog);
    };

    $scope.resetPassword = function () {
        $modalInstance.dismiss('cancel');
    };


    function setModifiedBy(user) {
        user.modifiedBy = AppModel.getLoggedInUser().username;
        return user;
    }

    function closeDialog() {
        $modalInstance.dismiss("closing");
        blockUI.stop();
        model.refresh();
    }
});