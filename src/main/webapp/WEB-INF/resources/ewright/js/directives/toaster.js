angular.module('eWrightDirectives').directive('alerting', function () {

    var controller = ['$scope', 'toasty', '$window', 'ToasterService',
        function ($scope, toasty, $window, ToasterService) {

            function handleToast(data) {
                switch (data.priority) {
                    case 1:
                        toasty.pop.error({
                            title: 'Error!',
                            msg: data.message,
                            timeout: 3000,
                            showClose: true,
                            clickToClose: true
                        });
                        break;

                    case 2:
                        toaster.pop('warning', '', data.message, 15000, 'trustedHtml');
                        break;
                    case 3:
                    case 4:
                        toaster.pop('info', '', data.message, 15000, 'trustedHtml');
                        break;
                    case 5:
                        toasty.pop.success({
                            title: "Success!",
                            msg: data.message,
                            timeout: 3000,
                            showClose: true,
                            clickToClose: true
                        });
                        break;
                }

            }

            ToasterService.subscribe(handleToast);

            $scope.goToLink = function (toaster) {
                var match = toaster.body.match(/http[s]?:\/\/[^\s]+/);
                if (match) $window.open(match[0]);
                return true;
            };

            $scope.clear = function () {
                toaster.clear();
            };
        }];


    return {
        restrict: 'E',
        replace: 'true',
        scope: true,
        controller: controller,
        templateUrl: '/resources/ewright/templates/toaster.html',
        link: function (scope, elem, attrs) {

        },
        compile: function (tElem, attrs) {
        }
    };
});