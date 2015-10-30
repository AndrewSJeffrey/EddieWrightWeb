angular.module('eWrightControllers').controller('MenuController', ['$scope', 'AppModel', 'MenuService', function ($scope, AppModel, MenuService) {

    $scope.isLoggedIn = function () {
        return AppModel.isLoggedIn();
    };

    $scope.getPageStyle = function () {
        var bgColor = AppModel.isLoggedIn() ? 'rgba(0, 0, 0, 0.68)' : 'rgba(78, 71, 84, 1)';
        var style = {
            height: "100%",
            width: '100%',
            background: bgColor
        };
        return style;
    };
    $scope.mainMenu = MenuService.mainMenu;
    $scope.logout = MenuService.getLogoutMenuItem();
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
        homeMenuItem.icon = "fa fa-home";


        var leadssMenuItem = createMenuItem('Enquiries', MENU_TYPE.single, null, true, 'resources/ewright/templates/dashlet/leads.html', function () {
            return AppModel.hasPermission(['ADMINISTRATOR', 'CONTROLLER']);
        });
        leadssMenuItem.icon = "fa fa-star";
        leadssMenuItem.count = 1;


        var selfGenMenuItem = createMenuItem('Self Gen', MENU_TYPE.single, null, true, 'resources/ewright/templates/dashlet/leads.html', function () {
            return AppModel.hasPermission(['ADMINISTRATOR', 'OPERATOR', 'CONTROLLER']);
        });
        selfGenMenuItem.icon = "fa fa-star";
        selfGenMenuItem.count = 1;



        var tasksMenuItem = createMenuItem('Tasks', MENU_TYPE.single, null, true, 'resources/ewright/templates/dashlet/tasks.html', function () {
            return AppModel.hasPermission(['ADMINISTRATOR', 'OPERATOR', 'CONTROLLER']);
        });
        tasksMenuItem.icon = "fa fa-list";
        tasksMenuItem.count = 50;

        var opportunitiesMenuItem = createMenuItem("Opportunities", MENU_TYPE.single, null, true, 'resources/ewright/templates/dashlet/opportunities.html', function () {
            return AppModel.hasPermission(['ADMINISTRATOR', 'OPERATOR']);
        });
        opportunitiesMenuItem.icon = "fa fa-inbox";
        opportunitiesMenuItem.count = 25;


        var stockMenuItem = createMenuItem("Stock", MENU_TYPE.single, null, true, 'resources/ewright/templates/dashlet/stock.html', function () {
            return AppModel.hasPermission(['ADMINISTRATOR', 'OPERATOR']);
        });
        stockMenuItem.icon = "fa fa-car";


        var plannerMenuItem = createMenuItem("Calender", MENU_TYPE.single, null, true, 'resources/ewright/templates/planner.html', function () {
            return AppModel.hasPermission(['ADMINISTRATOR', 'OPERATOR']);
        });
        plannerMenuItem.icon = "fa fa-calendar";
        plannerMenuItem.count = 1;

        var contactsMenuItem = createMenuItem("Contacts", MENU_TYPE.single, null, true, 'resources/ewright/templates/dashlet/contacts.html', function () {
            return AppModel.hasPermission(['ADMINISTRATOR', 'OPERATOR', 'CONTROLLER']);
        });
        contactsMenuItem.icon  = "fa fa-users";



        var accountSettings = createMenuItem("Settings", MENU_TYPE.element, null, false, 'resources/ewright/templates/dashlet/users.html', function () {
            return AppModel.hasPermission(['ADMINISTRATOR']);
        });
        accountSettings.icon  = "fa fa-cogs";

        var logoutMenuItem = createMenuItem("Logout", MENU_TYPE.element, function() {
            selectedMainMenuItem = homeMenuItem;
            homeMenuItem.onClick();
            AppModel.setLoggedIn(false);
        }, false, 'resources/ewright/templates/dashlet/users.html', function () {
            return true;
        });
        logoutMenuItem.icon = "fa fa-sign-out";


        //settingsMenuItem.addChild(accountSettings);

        var mainMenu = [
            homeMenuItem,
            leadssMenuItem,
          //  selfGenMenuItem,
            tasksMenuItem,
           // opportunitiesMenuItem,
         //   stockMenuItem,
            contactsMenuItem,
         //   plannerMenuItem,
            accountSettings,
           // logoutMenuItem
        ];



        //    THIS SETS THE DEFAULT MENU ITEM! - MUST BE HOME ON COMMIT
        var selectedMainMenuItem = homeMenuItem;
        homeMenuItem.onClick();

        function createMenuItem(title, type, onClick, selected, url, permission) {
            var menuItem = {
                title: title,
                type: type,
                onClick: null,
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
                },
                icon : "fa fa-cogs"
            };

            menuItem.onClick = function () {
                if (menuItem.children == null || menuItem.children.length == 0) {
                    deselectAll();
                    var temp = selectParent(menuItem);
                    temp.selected = true;
                    selectedMainMenuItem = menuItem;
                }
                if (onClick instanceof Function) {
                    onClick();
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

        function getLeadsMenu() {
            return leadssMenuItem;
        }

        function getLogoutMenuItem() {
            return logoutMenuItem;
        }


        return ({
            mainMenu: mainMenu,
            getSelectedMenuItem: getSelectedMenuItem,
            getLeadsMenu : getLeadsMenu,
            getLogoutMenuItem : getLogoutMenuItem
        });
    }]
);