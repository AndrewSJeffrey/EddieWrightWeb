angular.module('eWrightControllers').controller('ToastAlerts', ['$scope', 'toaster', '$window', 'ToasterService',
    function ($scope, toaster, $window, ToasterService) {


        function handleToast(data) {
            switch (data.priority) {
                case 1:
                    toaster.pop('error', '', data.message, 30000, 'trustedHtml');
                    break;

                case 2:
                    toaster.pop('warning', '', data.message, 15000, 'trustedHtml');
                    break;
                case 3:
                case 4:
                    toaster.pop('info', '', data.message, 15000, 'trustedHtml');
                    break;
                case 5:
                    toaster.pop('success', '', data.message, 3000, 'trustedHtml');
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
    }]);