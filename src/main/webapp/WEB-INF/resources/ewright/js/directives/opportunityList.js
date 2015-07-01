angular.module('eWrightDirectives').directive('opportunityViewer', function () {


    var controller = ['$scope', function ($scope) {

        $scope.model = {
            opportunities : [
                {
                    id : 1
                },
                {
                    id : 2
                },
                {
                    id : 3
                },
                {
                    id : 4
                }
            ]

        };


        function model() {
            return $scope.model;
        }

        function handleLogin(data) {

        }
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function($event) {
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

        $scope.getDayClass = function(date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i=0;i<$scope.events.length;i++){
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        };




    }];


    return {
        restrict: 'E',
        scope: {
            header : "@header"
        },
        controller: controller,
        templateUrl: '/resources/ewright/templates/oppertunityList.html',
        link: function (scope, elem, attrs) {
        },
        compile: function (tElem, attrs) {

        }
    };
});

angular.module('eWrightDirectives').directive('opportunity', function () {


    var controller = ['$scope', function ($scope) {

        $scope.model = {};


        $scope.click = function() {
            console.log($scope.poi);
        }
    }];


    return {
        restrict: 'E',
        scope: {
            opportunityObj : "=opportunityObj"
        },
        controller: controller,
        templateUrl: '/resources/ewright/templates/opportunity.html',
        link: function (scope, elem, attrs) {
        },
        compile: function (tElem, attrs) {

        }
    };
});