angular.module('eWrightServices').service('AppModel', function () {

    var user = null;
    var allUsers = [];

    function isLoggedIn() {
        return user != null;
    }

    function setLoggedIn(loggedIn) {
        if (!loggedIn) {
            user = null;
            return;
        }

        if (loggedIn.username) {
            user = loggedIn;
        } else {
            user = null;
        }
    }

    function setAllUsers(users) {
        allUsers = users;
    }

    function getAllUsers() {
        return allUsers;
    }

    function getLoggedInUser() {
        return user;
    }

    function debug(object) {
        var output = '';
        for (var property in object) {
            output += property + ': ' + object[property] + '; ';
        }
        alert(output);
    }

    return ({
        isLoggedIn: isLoggedIn,
        setLoggedIn: setLoggedIn,
        setAllUsers: setAllUsers,
        getAllUsers: getAllUsers,
        getLoggedInUser : getLoggedInUser
    })
});