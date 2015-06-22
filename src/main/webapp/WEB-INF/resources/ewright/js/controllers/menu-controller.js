angular.module('eWrightControllers').controller('menu', ['$scope', 'AppModel', function ($scope, AppModel) {

    $scope.isLoggedIn = function () {
        return AppModel.isLoggedIn();
    }

    $scope.getPageStyle = function () {
        var bgColor = AppModel.isLoggedIn() ? '#FFFFFF' : '#E8D1FF';
        var style = {
            height: "100%",
            width: '100%',
            background: bgColor
        };
        return style;
    }
}]);