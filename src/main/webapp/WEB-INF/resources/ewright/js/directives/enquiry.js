angular.module('eWrightDirectives').directive('enquiry', function () {
    var controller = ['$scope','$modal' ,'blockUI' ,'ContactService', 'ToasterService', 'AppModel', function ($scope, $modal,blockUI, ContactService, ToasterService, AppModel) {

        $scope.model = {

        };

        function model() {
            return $scope.model;
        }



    }];

    return {
        restrict: 'E',
        scope: {

        },
        controller: controller,
        templateUrl: '/resources/ewright/templates/enquiry.html',
        link: function (scope, elem, attrs) {
        },
        compile: function (tElem, attrs) {

        }
    };


});
