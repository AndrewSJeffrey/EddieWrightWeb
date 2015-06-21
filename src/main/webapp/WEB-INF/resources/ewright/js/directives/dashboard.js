angular.module('eWrightDirectives').directive('dashboard', function () {


    var controller = ['$scope', 'LoginService', 'ToasterService', function ($scope, LoginService, ToasterService) {

        $scope.logout = function () {
            LoginService.logout();
            ToasterService.createToast(ToasterService.PRIORITY.SUCCESS, ToasterService.MESSAGES.LOGOUT)
        }

    }];


    return {
        restrict: 'E',
        replace: 'true',
        scope: true,
        controller: controller,
        templateUrl: '/resources/ewright/templates/dashboard.html',
        link: function (scope, elem, attrs) {

        },
        compile: function (tElem, attrs) {
        }
    };
});