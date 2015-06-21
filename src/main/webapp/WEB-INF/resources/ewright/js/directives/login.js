angular.module('eWrightDirectives').directive('loginPage', function () {


    var controller = ['$scope', 'LoginService', 'ToasterService', function ($scope, LoginService, ToasterService) {

        $scope.model = {
            emailAddress: "",
            password: "",
            incorrectLogin : false
        };

        function model() {
            return $scope.model;
        }

        function handleLogin(data) {
            if (data.data == "") {
                model().incorrectLogin = true;
                ToasterService.createToast(ToasterService.PRIORITY.ERROR, ToasterService.MESSAGES.FAILED_LOGIN);
            } else {
                model().incorrectLogin = false;

            }
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