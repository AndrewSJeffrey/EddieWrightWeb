angular.module('eWrightServices').service('WebSocketAbstract', ['$http', '$q', function ($http, $q) {
    var windowURL = window.location.host;
    var service = {};
    service.SOCKET_URL = "http://" + windowURL + "/hello";
    service.RECONNECT_TIMEOUT = 30000;
    service.CHAT_BROKER = "/app/hello";

    function createWebSocket(url, handler, preSubscriptions) {
        //console.log('Starting websocket:' + url);

        var socket = null;
        var listener = $q.defer();
        socket = {
            client: null,
            stomp: null
        };


        var reconnect = function () {
            $timeout(function () {
                initialize();
            }, this.RECONNECT_TIMEOUT);
        };


        var initialize = function () {
            socket.client = new SockJS(service.SOCKET_URL);
            socket.stomp = Stomp.over(socket.client);
            socket.stomp.onclose = reconnect;
            socket.stomp.debug = null

        };

        initialize();

        var subscription = {};
        subscription.subscribers = [];
        subscription.handler = handler;
        subscription.url = url;

        subscription.publish = function (data, subscribers) {
            for (var i = 0; i < subscribers.length; i++) {
                if (subscribers[i] instanceof Function) {
                    subscribers[i](data);
                }
            }
            if (subscription.handler) {
                subscription.handler(data);
            }
        };

        subscription.subscribe = function (subscriber) {
            subscription.subscribers.push(subscriber);
        };

        if (preSubscriptions && Array.isArray(preSubscriptions)) {
            for (var i = 0; i < preSubscriptions.length; i++) {
                subscription.subscribe(preSubscriptions[i]);
            }
        }

        var listenerMethod = function () {
            socket.stomp.subscribe(url, function (data) {
                listener.notify(subscription.publish(data.body, subscription.subscribers));
            })
        };

        socket.stomp.connect({}, listenerMethod);

        return subscription;
    }

    return ({createWebSocket: createWebSocket});

}]);