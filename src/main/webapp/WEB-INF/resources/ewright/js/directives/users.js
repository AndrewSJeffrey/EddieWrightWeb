angular.module('eWrightDirectives').directive('users', function () {


    var controller = ['$scope', 'UserService', 'blockUI', 'AppModel', '$modal', function ($scope, UserService, blockUI, AppModel, $modal) {
        $scope.rowCollection = AppModel.getAllUsers();
        $scope.displayedCollection = [];


        function processData(data) {
            $scope.rowCollection = data;
            $scope.displayedCollection = [].concat(data);
        }

        UserService.getAllUsers(processData);


        $scope.items = ['item1', 'item2', 'item3'];


        $scope.animationsEnabled = false;

        $scope.open = function (newuser, user, size) {
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/resources/ewright/templates/userForm.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    model: function () {
                        var model = {
                            items: $scope.items,
                            newuser: newuser,
                            user : user,
                            UserService : UserService,
                            AppModel : AppModel
                        };
                        return model;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
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

    $scope.model = model;

    var UserService = model.UserService;
    var AppModel = model.AppModel;

    $scope.items = model.items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.user = jQuery.extend(true, {}, model.user);
    $scope.refUser = model.user;

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.delete = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.update = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.create = function () {
        var user = setModifiedBy($scope.user);
        UserService.createNewUser(user);
        $modalInstance.dismiss('created');
    };
    $scope.resetPassword = function () {
        $modalInstance.dismiss('cancel');
    };


    function setModifiedBy(user) {
        user.modifiedBy =  AppModel.getLoggedInUser().username;
        return user;
    }
});