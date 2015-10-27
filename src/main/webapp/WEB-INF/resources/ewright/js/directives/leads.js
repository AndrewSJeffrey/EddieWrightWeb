angular.module('eWrightDirectives').directive('leads', function () {


    var controller = ['$scope', 'LeadsService', 'blockUI', 'AppModel', '$modal', 'ToasterService', 'MenuService', '$window', 'AppModel',
        function ($scope, LeadsService, blockUI, AppModel, $modal, ToasterService, MenuService, $window, AppModel) {

            $scope.model = {
                leads: [],
                filteredList: [],
                url: "http://localhost:8080/emails/87.html",
                leadsByContact: {},
                selectedMessage: null,
                searchText: ""
            };

            function model() {
                return $scope.model;
            }


            function processData(data) {
                model().leads = data;
                model().leadsByContact = {};

                for (var row in data) {

                    data[row].showAction = false;
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
                model().filteredList = model().leads;

            }


            $scope.showAction = function (lead) {
                lead.showAction = true;

            };

            $scope.getLeadsByContact = function (searchTerms) {
                return model().leadsByContact;
            };


            $scope.filter = function () {
                var filteredList = [];

                var search = model().searchText ? model().searchText : "";

                for (var id in model().leads) {

                    var lead = model().leads[id];

                    if (lead.name != null && lead.name.toUpperCase().indexOf(search.toUpperCase()) > -1) {
                        filteredList.push(lead);
                    }
                    else if (lead.email != null && lead.email.toUpperCase().indexOf(search.toUpperCase()) > -1) {
                        filteredList.push(lead);
                    }
                    else if (lead.phoneNumber != null && lead.phoneNumber.toUpperCase().indexOf(search.toUpperCase()) > -1) {
                        filteredList.push(lead);
                    }


                }
                model().filteredList = filteredList;
            };

            $scope.getLeads = function () {
                return model().filteredList;
            };

            var lastClicked = "";

            $scope.filterBy = function (TYPE) {
                model().filteredList = model().filteredList.sort(byProperty(TYPE));
                if (TYPE == lastClicked) {
                    model().filteredList = model().filteredList.reverse();
                    lastClicked = "";
                } else {
                    lastClicked = TYPE;
                }
            };

            var byProperty = function (prop) {
                return function (a, b) {
                    if (typeof a[prop] == "number") {
                        return (a[prop] - b[prop]);
                    } else {
                        return ((a[prop] < b[prop]) ? -1 : ((a[prop] > b[prop]) ? 1 : 0));
                    }
                };
            }

            $scope.selectLead = function (lead) {
                model().selectedMessage = lead;
                $window.scrollTo(0, 0);
            };

            function callback(result) {
                console.log("result:" + result);
                model().selectedMessage = null;
                LeadsService.getUnprocessedLeads(processData);
            }

            $scope.discard = function (lead) {
                var user = AppModel.getLoggedInUser();
                LeadsService.discardLead(lead.id.toString(), lead.reason, user.id.toString(), callback);

            };


            LeadsService.getUnprocessedLeads(processData);



            $scope.hide = function() {
                model().selectedMessage = null;
                $window.scrollTo(0, 0);
                LeadsService.getUnprocessedLeads(processData);
            };

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
                                LeadsService: LeadsService
                            };
                            return model;
                        }
                    }
                });
            }
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


angular.module('eWrightControllers').controller('EmailViewer', function ($scope, $modalInstance, model) {
    $scope.model = model;
    $scope.lead = model.lead;

    $scope.url = null;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    function handleUrl(data) {
        $scope.url = location.protocol + '//' + location.host + "/" + data.url;
    }


    function closeDialog(postClose) {
        return function () {
            $modalInstance.dismiss("closing");
        }
    }

    model.LeadsService.getEmailUrl($scope.lead.id, handleUrl);
});
