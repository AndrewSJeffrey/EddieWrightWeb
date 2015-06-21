angular.module('eWrightServices').service('AppModel', function () {

    var user = null;

    function isLoggedIn() {
        return user != null;
    }

    function setLoggedIn(loggedIn) {
        console.log(loggedIn);
        if (loggedIn.username) {
            user = loggedIn;
            console.log(user.username)
        } else {
            user = null;
        }


    }

    return ({
        isLoggedIn: isLoggedIn,
        setLoggedIn: setLoggedIn
    })
});