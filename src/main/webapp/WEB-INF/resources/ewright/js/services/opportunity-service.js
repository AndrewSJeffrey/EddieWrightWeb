angular.module('eWrightServices').service('OpportunityService', ['DAOAbstract', 'AppModel', function (DAOAbstract, AppModel) {

    var dao = DAOAbstract.createDAO('/opportunities');


    function getAllOpportunities(callback) {
        dao.query(null, function (result) {
            callback(result.data)
        });
    }

    function createOpportunity(event, callback) {
        dao.postURL("/new", repack(event), function () {
            if (callback instanceof Function) {
                callback();
            }
        });
    }

    function restoreOpportunity(event, callback) {
        dao.postURL("/restore", repack(event), function () {
            if (callback instanceof Function) {
                callback();
            }
        });
    }

    function deleteOpportunity(event, callback) {
        dao.postURL("/delete", repack(event), function () {
            if (callback instanceof Function) {
                callback();
            }
        });
    }

    function updateOpportunity(event, callback) {
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
        };
        return object;
    }

    return ({
        getAllOpportunities: getAllOpportunities,
        createOpportunity: createOpportunity,
        updateOpportunity: updateOpportunity,
        deleteOpportunity: deleteOpportunity,
        restoreOpportunity: restoreOpportunity
    })
}]);