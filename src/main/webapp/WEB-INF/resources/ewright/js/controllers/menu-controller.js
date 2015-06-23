angular.module('eWrightControllers').controller('MenuController', ['$scope', 'AppModel', 'MenuService', function ($scope, AppModel, MenuService) {

    $scope.isLoggedIn = function () {
        return AppModel.isLoggedIn();
    };

    $scope.getPageStyle = function () {
        var bgColor = AppModel.isLoggedIn() ? '#FFFFFF' : '#E8D1FF';
        var style = {
            height: "100%",
            width: '100%',
            background: bgColor
        };
        return style;
    };
    $scope.mainMenu = MenuService.mainMenu;
    $scope.getSelectedMenuItem = MenuService.getSelectedMenuItem;
}]);


angular.module('eWrightServices').service('MenuService', ['AppModel', function (AppModel) {
        var MENU_TYPE = {
            single: 0,
            mega: 1,
            fullMega: 2,
            classic: 3,
            element: 4
        };

        var homeMenuItem = createMenuItem("Home", MENU_TYPE.single, null, true, 'resources/ewright/templates/dashlet/home.html', function () {
            return true;
        });

        var prospectingMenuItem = createMenuItem("Prospecting", MENU_TYPE.single, null, true, 'resources/ewright/templates/dashlet/prospecting.html', function () {
            return AppModel.hasPermission(['ADMINISTRATOR', 'OPERATOR']);
        });

        var settingsMenuItem = createMenuItem("Admin", MENU_TYPE.mega, null, false, null, function () {
            return AppModel.hasPermission(['ADMINISTRATOR']);
        });

        var accountSettings = createMenuItem("Users", MENU_TYPE.element, null, false, 'resources/ewright/templates/dashlet/users.html', function () {
            return AppModel.hasPermission(['ADMINISTRATOR']);
        });

        settingsMenuItem.addChild(accountSettings);

        var mainMenu = [
            homeMenuItem,
            prospectingMenuItem,
            settingsMenuItem
        ];


        //    THIS SETS THE DEFAULT MENU ITEM! - MUST BE MAP ON COMMIT
        var selectedMainMenuItem = homeMenuItem;
        homeMenuItem.onClick();

        function createMenuItem(title, type, onClick, selected, url, permission) {
            var menuItem = {
                title: title,
                type: type,
                onClick: onClick,
                children: [],
                selected: selected,
                url: url,
                parent: null,
                hasPermission: permission ? permission : function () {
                    return true
                },
                addChild: function (childMenuItem) {
                    this.children.push(childMenuItem);
                    childMenuItem.parent = this;
                }
            };

            menuItem.onClick = function () {
                if (menuItem.children == null || menuItem.children.length == 0) {
                    deselectAll();
                    var temp = selectParent(menuItem);
                    temp.selected = true;
                    selectedMainMenuItem = menuItem;
                }
            };

            return menuItem;
        }

        function selectParent(menuItem) {
            if (menuItem.parent) {
                return selectParent(menuItem.parent);
            }
            return menuItem;
        }

        function deselectAll() {
            for (var i = 0; i < mainMenu.length; i++) {
                deselect(mainMenu[i]);
            }
        }

        function deselect(menuItem) {
            menuItem.selected = false;
            if (menuItem.children == null || menuItem.children.length == 0) {
                return;
            }
            for (var i = 0; i < menuItem.children.length; i++) {
                menuItem.children[i].selected = false;
                deselect(menuItem.children[i]);
            }
        }

        function getSelectedMenuItem() {
            return selectedMainMenuItem;
        }

        return ({
            mainMenu: mainMenu,
            getSelectedMenuItem: getSelectedMenuItem
        });
    }]
);