angular.module('eWrightServices').service('EventService', ['DAOAbstract', 'AppModel', function (DAOAbstract, AppModel) {

    var dao = DAOAbstract.createDAO('/events');


    function getAllEvents(callback) {
        dao.query(null, function (result) {
            callback(result.data)
        });
    }

    function createEvent(event, callback) {
        dao.postURL("/new", repack(event), function () {
            if (callback instanceof Function) {
                callback();
            }
        });
    }

    function repack(event) {
        var user = AppModel.getLoggedInUser();
        return {
            id: event.id ? event.id : 0,
            title: event.title ? event.title : "",
            message: event.message ? event.message : "",
            startsAt: event.startsAt ? event.startsAt : new Date(),
            endsAt: event.endsAt ? event.endsAt : new Date(),
            createdBy: user,
            ticketID: event.ticketID ? event.ticketID : null,
            removed: event.removed ? event.removed : false,
        };
    }

    return ({
        getAllEvents: getAllEvents,
        createEvent: createEvent
    })
}]);