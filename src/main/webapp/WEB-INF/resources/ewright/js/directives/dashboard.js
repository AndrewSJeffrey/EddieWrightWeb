angular.module('eWrightDirectives').directive('dashboard', function () {


    var controller = ['$scope', 'LoginService', function ($scope, LoginService) {


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