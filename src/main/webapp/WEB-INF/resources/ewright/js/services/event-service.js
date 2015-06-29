angular.module('eWrightServices').service('EventService', ['DAOAbstract', function (DAOAbstract) {

    var dao = DAOAbstract.createDAO('/events');


    function getAllEvents(callback) {
        dao.query(null, function (result) {
            callback(result.data)
        });
    }

    return ({
        getAllEvents: getAllEvents
    })
}]);