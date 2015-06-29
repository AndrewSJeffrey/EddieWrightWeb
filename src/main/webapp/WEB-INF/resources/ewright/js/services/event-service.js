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

    function updateEvent(event, callback) {
        dao.postURL("/update", repack(event), function () {
            if (callback instanceof Function) {
                callback();
            }
        });
    }

    function repack(event) {
        var object = {
            id: event.id ? event.id : 0,
            title: event.title ? event.title : "",
            message: event.message ? event.message : "",
            startsAt: event.startsAt ? new Date(event.startsAt) : new Date(),
            endsAt: event.endsAt ? new Date(event.endsAt) : new Date(),
            createdBy: event.user ? event.user : AppModel.getLoggedInUser(),
            ticketID: event.ticketID ? event.ticketID : null,
            removed: event.removed ? event.removed : false,
            modifiedAt: event.modifiedAt ? new Date(event.modifiedAt) : new Date(),
            createdAt: event.createdAt ? new Date(event.createdAt) : new Date()
        } ;
        return object;
    }

    return ({
        getAllEvents: getAllEvents,
        createEvent: createEvent,
        updateEvent: updateEvent
    })
}]);