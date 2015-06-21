angular.module('eWrightServices').service('AppModel', function () {

    var user = null;

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

    return ({
        isLoggedIn: isLoggedIn,
        setLoggedIn: setLoggedIn
    })
});