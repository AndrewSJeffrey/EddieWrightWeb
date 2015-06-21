angular.module('eWrightDirectives').directive('loginPage', function () {


    var controller = ['$scope', 'LoginService', function ($scope, LoginService) {

        $scope.model = {
            emailAddress: "",
            password: ""
        };

        function model() {
            return $scope.model;
        }

        function handleLogin(data) {
            console.log(data)
        }

        $scope.login = function () {
            LoginService.attemptLogin(model().emailAddress, model().password, handleLogin);
        }

    }];


    return {
        restrict: 'E',
        replace: 'true',
        scope: true,
        controller: controller,
        templateUrl: '/resources/ewright/templates/login.html',
        link: function (scope, elem, attrs) {

        },
        compile: function (tElem, attrs) {
        }
    };
});