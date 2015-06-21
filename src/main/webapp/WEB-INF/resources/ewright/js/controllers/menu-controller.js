angular.module('eWrightControllers').controller('menu', ['$scope', 'AppModel', function ($scope, AppModel) {

    $scope.isLoggedIn = function () {
        return AppModel.isLoggedIn();
    }
}]);