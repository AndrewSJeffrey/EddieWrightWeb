angular.module('eWrightServices').service('DAOAbstract', ['$http', '$q', function ($http, $q) {
    function createDAO(url) {
       // console.log("dao - url:" + url);
        var dao = {};
        dao.url = url;
        dao.config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        dao.firstLoad = true;

        dao.subscribers = [];
        dao.cache = [];
        dao.token = $("meta[name='_csrf']").attr("content");
        $http.defaults.headers.common['x-csrf-token'] = dao.token;

        dao.post = function(url, data) {
            var request = $http.post(url, data);
            return (request.then(dao.handleSuccess, dao.handleError));
        };

        dao.postURL = function(params, data, success, error){
            var request = $http.post(dao.url + (params ? params : ''), data);
            return (request.then(success ? success : dao.handleSuccess, error ? error : dao.handleError));
        };

        dao.queryURL = function(url) {
            var request = $http.get(url, dao.config);
            return (request.then(dao.handleSuccess, dao.handleError));
        };

        dao.query = function (params, success, error) {
            var url = dao.url + (params ? params : '');
            var request = $http.get(url, dao.config);
            return (request.then(success ? success : dao.handleSuccess, error ? error : dao.handleError));
        };

        dao.loadData = function (params) {
            var request = $http.get(dao.url + (params ? params : ''), dao.config);
            return (request.then(dao.handleSuccess, dao.handleError));
        };

        dao.handleSuccess = function (response) {
            dao.publish(response.data, dao.subscribers);
            dao.cache = response.data;
            if (dao.firstLoad) {
                dao.firstLoad = false;
            }
            return (response.data);
        };

        dao.handleError = function (response) {
            if (!angular.isObject(response.data) || !response.data.message) {
                return ( $q.reject("An unknown error occurred.") );
            }
            return ( $q.reject(response.data.message) );
        };

        dao.publish = function (data, subscribers) {
            for (var i = 0; i < subscribers.length; i++) {
                if (subscribers[i] instanceof Function) {
                    subscribers[i](data);
                }
            }
        };

        dao.subscribe = function (subscriber) {
            if (subscriber instanceof Function) {
                dao.subscribers.push(subscriber);
                subscriber(dao.firstLoad ? null : dao.cache);
            } else {
                console.log('Value passed is not a function');
            }
        };



        return dao;
    }

    return ({createDAO: createDAO});

}]);