angular.module('eWrightDirectives').directive('leads', function () {


    var controller = ['$scope', 'LeadsService', 'blockUI', 'AppModel', '$modal', 'ToasterService' ,'MenuService', function ($scope, LeadsService, blockUI, AppModel, $modal, ToasterService, MenuService) {

        $scope.model = {
            leads: [],
            url: "http://localhost:8080/emails/87.html",
            leadsByContact: {},
            selectedMessage : null
        };

        function model() {
            return $scope.model;
        }


        function processData(data) {
            model().leads = data;
            model().leadsByContact = {};

            for(var row in data) {
                var contact = data[row].assignedContact;
                if (contact) {
                    if (!model().leadsByContact[contact.id]) {
                        model().leadsByContact[contact.id] = []
                    }
                    model().leadsByContact[contact.id].push(data[row]);
                }
                else {
                    if (!model().leadsByContact[0]) {
                        model().leadsByContact[0] = []
                    }
                    model().leadsByContact[0].push(data[row]);
                }
            }

            MenuService.getLeadsMenu().count = model().leads.length;

        }

        $scope.getLeadsByContact = function(searchTerms) {


            return model().leadsByContact;
        };

        LeadsService.getUnprocessedLeads(processData);


        $scope.open = function (lead) {
            var modalInstance = $modal.open({
                animation: false,
                templateUrl: '/resources/ewright/templates/emailViewer.html',
                controller: 'EmailViewer',
                size: 'lg',
                resolve: {
                    model: function () {
                        var model = {
                            lead: lead,
                            LeadsService : LeadsService
                        };
                        return model;
                    }
                }
            });
        }}];


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



angular.module('eWrightControllers').controller('EmailViewer', function ($scope, $modalInstance, model) {
    $scope.model = model;
    $scope.lead = model.lead;

    $scope.url = null;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    function handleUrl(data){
        $scope.url =  location.protocol + '//' + location.host + "/" + data.url;
    }




    function closeDialog(postClose) {
        return function() {
            $modalInstance.dismiss("closing");
        }
    }

    model.LeadsService.getEmailUrl($scope.lead.id, handleUrl);
});
