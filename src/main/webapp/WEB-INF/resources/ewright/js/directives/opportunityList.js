angular.module('eWrightDirectives').directive('opportunityContainer', function () {
    var controller = ['$scope', 'OpportunityService', function ($scope, OpportunityService) {
        $scope.model = {

            opportunities: {
                SEARCH : [],
                ATTENTION_REQUIRED: [],
                AWAITING_ACTION: [],
                ACTIONED: []
            },
            selectedView : 'ATTENTION_REQUIRED'
        };
        function model() {
            return $scope.model;
        }

        function handleDataLoad(data) {

            model().opportunities.ATTENTION_REQUIRED = [];
            model().opportunities.AWAITING_ACTION = [];
            model().opportunities.ACTIONED = [];

            console.log(data[0].id);
            for (var i = 0; i < data.length; i++){

                console.log(data[i].id)
                console.log(data[i].currentAction)
                model().opportunities[data[i].currentAction].push(data[i]);
            }

            console.log( model().opportunities.ATTENTION_REQUIRED.length);
            console.log( model().opportunities.AWAITING_ACTION.length);
            console.log( model().opportunities.ACTIONED.length);
           // $scope.model.opportunities = data;
        }

        function refresh() {
            OpportunityService.getAllOpportunities(handleDataLoad)
        }

        refresh();

        $scope.$watch('model.opportunities', function (value) {
            console.log("changed?:" + value)
        });

        $scope.show = function(display) {
            console.log(display);
            model().selectedView = display;
        };

        $scope.getSelectedView = function () {
            return model().opportunities[  model().selectedView];
        }


    }];

    return {
        restrict: 'E',
        scope: {},
        controller: controller,
        templateUrl: '/resources/ewright/templates/opportunityContainer.html',
        link: function (scope, elem, attrs) {
        },
        compile: function (tElem, attrs) {

        }
    };


});


angular.module('eWrightDirectives').directive('opportunityViewer', function () {

    var controller = ['$scope', function ($scope) {
        $scope.model = {
            opportunities: $scope.listItems
        };


        function model() {
            return $scope.model;
        }

        function handleLogin(data) {

        }

        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function (date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 2);
        $scope.events =
            [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];

        $scope.getDayClass = function (date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        };

        $scope.click = function() {
            console.log("listItems:" + $scope.listItems)
        }
        $scope.click();


    }];


    return {
        restrict: 'E',
        scope: {
            header: "@header",
            listItems: "=listItems"
        },
        controller: controller,
        templateUrl: '/resources/ewright/templates/oppertunityList.html',
        link: function (scope, elem, attrs) {
            scope.$watch('listItems', function (newValue, oldValue) {
              console.log("changed?jasd")
            });
        },
        compile: function (tElem, attrs) {


        }
    };
});

angular.module('eWrightDirectives').directive('opportunity', function () {


    var controller = ['$scope', function ($scope) {

        $scope.model = {
            opportunity: $scope.opportunityObj
        };


        $scope.click = function () {
            console.log($scope.opportunityObj);
        }


    }];


    return {
        restrict: 'E',
        scope: {
            opportunityObj: "=opportunityObj"
        },
        controller: controller,
        templateUrl: '/resources/ewright/templates/opportunity.html',
        link: function (scope, elem, attrs) {
        },
        compile: function (tElem, attrs) {

        }
    };
});