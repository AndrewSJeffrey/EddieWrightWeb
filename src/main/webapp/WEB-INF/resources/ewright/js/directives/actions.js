angular.module('eWrightDirectives').directive('action', function () {


    var controller = ['$scope', 'LeadsService', 'blockUI', 'AppModel', '$modal', 'ToasterService', 'MenuService', function ($scope, LeadsService, blockUI, AppModel, $modal, ToasterService, MenuService) {

        $scope.model = {
            showNewAction : true,
            actions : [
                {type : "PHONE", text : "Contact via phone"},
                {type : "EMAIL", text : "Contact via email"},
                {type : "APT_SC", text : "Appoint to sales controller"},
                {type : "APT_OS", text : "Appoint to online sales"},
                {type : "DISCARD", text : "Discard message"}
            ]
        };

        $scope.showNextNewPage = function() {
            console.log($scope.model.selectedType)
        }
    }
    ];


    return {
        restrict: 'E',
        replace: 'true',
        scope: {
            lead : "=lead"
        },
        controller: controller,
        templateUrl: '/resources/ewright/templates/actions.html',
        link: function (scope, elem, attrs) {

        },
        compile: function (tElem, attrs) {
        }
    };
});

