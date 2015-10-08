angular.module('eWrightDirectives').directive('contact', function () {
    var controller = ['$scope','$modal' ,'blockUI' ,'ContactService', 'ToasterService', 'AppModel', function ($scope, $modal,blockUI, ContactService, ToasterService, AppModel) {
        $scope.model = {
            editMode : false

        };




    }];

    return {
        restrict: 'E',
        scope: {
            contact : "=contact",
            enquire : "@enquire"
        },
        controller: controller,
        templateUrl: '/resources/ewright/templates/contact.html',
        link: function (scope, elem, attrs) {
        },
        compile: function (tElem, attrs) {

        }
    };


});
