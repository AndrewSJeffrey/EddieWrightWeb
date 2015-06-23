angular.module('eWrightDirectives').directive('username', ['$q', '$timeout', 'AppModel', function ($q, $timeout, AppModel) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            console.log(attrs.defaultUsername); //literally "modelObject.obj"
            var defaultUsername = (attrs.defaultUsername); //literally "modelObject.obj"


            var userNames = [];

            var users = AppModel.getAllUsers();
            for (var i = 0; i < users.length; i++){
                userNames.push(users[0].username);
            }


            ctrl.$asyncValidators.username = function (modelValue, viewValue) {

                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty model valid
                    return $q.when();
                }

                var def = $q.defer();

                $timeout(function () {
                    if (modelValue == defaultUsername) {
                        def.resolve();
                    }
                    // Mock a delayed response
                    if (userNames.indexOf(modelValue) === -1) {
                        // The username is available
                        def.resolve();
                    } else {
                        def.reject();
                    }

                }, 1000);

                return def.promise;
            };
        }
    };
}]);