angular.module('eWrightServices').service('ToasterService', function () {

    var MESSAGES = {
        FAILED_LOGIN: "Username / Password is invalid.",
        LOGOUT: "Logged out successfully."
    };

    var PRIORITY = {
        ERROR : 1,
        WARNING : 2,
        INFO : 3,
        SUCCESS : 5
    };


    var subscribers = [];
    function subscribe(subscriber) {
        subscribers.push(subscriber);
    }

    function createToast(priority, message) {
        var toast = {priority : priority, message : message};
        publish(toast);
    }

    function publish(toast) {
        for (var i = 0; i < subscribers.length; i++) {
            subscribers[i](toast);
        }
    }

    return ({
        MESSAGES: MESSAGES,
        PRIORITY: PRIORITY,
        subscribe: subscribe,
        createToast: createToast
    });

});

