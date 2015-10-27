angular.module('eWrightServices').service('ActionService', ['DAOAbstract', 'AppModel', function (DAOAbstract, AppModel) {

    var dao = DAOAbstract.createDAO('/actions');



    function createAction(event, callback) {
        dao.postURL("/new", event, function () {
            if (callback instanceof Function) {
                callback();
            }
        });
    }

    function restoreLead(event, callback) {
        dao.postURL("/restore", repack(event), function () {
            if (callback instanceof Function) {
                callback();
            }
        });
    }

    function discardLead(id, reason, userId, callback) {
        dao.query("/discard?id=" + id + "&reason=" + reason + "&userId=" + userId, function () {
            if (callback instanceof Function) {
                callback();
            }
        });
    }

    function deleteLead(event, callback) {
        dao.postURL("/delete", repack(event), function () {
            if (callback instanceof Function) {
                callback();
            }
        });
    }

    function updateLead(contact, callback) {
        dao.postURL("/update", repack(contact), function () {
            if (callback instanceof Function) {
                callback();
            }
        });
    }

    function repack(contact) {
        var object = {
            id: contact.id ? contact.id : 0,
             createdBy:null,
            assignedTo:null,
            createdOn:null,
            actionRequiredBy:null,
            type:'CALL',
            reason:'null',
            note:'null',
            outcome:'null',
            previousAction:null,
            nextAction:null

        };
        console.log(object);
        return object;
    }

    return ({
        createAction: createAction,
        updateLead: updateLead,
        deleteLead: deleteLead,
        restoreLead: restoreLead,
        discardLead: discardLead
    })
}]);