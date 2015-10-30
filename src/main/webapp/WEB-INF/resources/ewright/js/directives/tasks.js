angular.module('eWrightDirectives').directive('tasks', function () {


    var controller = ['$scope', 'ActionService', 'blockUI', 'AppModel', '$modal', 'ToasterService', 'MenuService', '$window', 'AppModel',
        function ($scope, ActionService, blockUI, AppModel, $modal, ToasterService, MenuService, $window, AppModel) {

            $scope.model = {
                tasks: [],
                filteredList: [],
                searchText: "",
                selectedTask : null

            };

            function model() {
                return $scope.model;
            }

            $scope.selectTask = function(task){
              model().selectedTask = task;
            };

            $scope.getTasks = function () {
                return model().filteredList;
            };


            $scope.overDue = function (task) {
                var time = new Date().getTime();
                if (task.actionRequiredBy < time) {
                    return {'color': '#FF0000'}
                }

            };

            function handleTasks(data) {
                model().tasks = data.data;
                $scope.filter();
            }

            $scope.filter = function () {
                var filteredList = [];

                var search = model().searchText ? model().searchText : "";

                for (var id in model().tasks) {

                    var task = model().tasks[id];

                    if (task.reason != null && task.reason.toUpperCase().indexOf(search.toUpperCase()) > -1) {
                        filteredList.push(task);
                    }
                    else if (task.note != null && task.note.toUpperCase().indexOf(search.toUpperCase()) > -1) {
                        filteredList.push(task);
                    }


                }
                model().filteredList = filteredList;
            };

            var byProperty = function (prop) {
                return function (a, b) {
                    if (typeof a[prop] == "number") {
                        return (a[prop] - b[prop]);
                    } else {
                        return ((a[prop] < b[prop]) ? -1 : ((a[prop] > b[prop]) ? 1 : 0));
                    }
                };
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


            ActionService.myActions(AppModel.getLoggedInUser().id, handleTasks);

            $scope.hide = function() {
                ActionService.myActions(AppModel.getLoggedInUser().id, handleTasks);
                model().selectedTask = null;
            }

        }];


    return {
        restrict: 'E',
        replace: 'true',
        scope: true,
        controller: controller,
        templateUrl: '/resources/ewright/templates/tasks.html',
        link: function (scope, elem, attrs) {

        },
        compile: function (tElem, attrs) {
        }
    };
});

