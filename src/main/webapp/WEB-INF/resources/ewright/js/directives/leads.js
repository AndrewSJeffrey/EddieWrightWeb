angular.module('eWrightDirectives').directive('leads', function () {


    var controller = ['$scope', 'LeadsService', 'blockUI', 'AppModel', '$modal', 'ToasterService', function ($scope, LeadsService, blockUI, AppModel, $modal, ToasterService) {

        $scope.model = {
            leads: []

        };

        function model() {
            return $scope.model;
        }


        function processData(data) {
            model().leads = data;
        }

        LeadsService.getUnprocessedLeads(processData);


    }];


    return {
        restrict: 'E',
        replace: 'true',
        scope: true,
        controller: controller,
        templateUrl: '/resources/ewright/templates/leads.html',
        link: function (scope, elem, attrs) {

        },
        compile: function (tElem, attrs) {
        }
    };
});
