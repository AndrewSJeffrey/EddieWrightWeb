angular.module('eWrightServices').service('LeadsService', ['DAOAbstract', 'AppModel', function (DAOAbstract, AppModel) {

    var dao = DAOAbstract.createDAO('/emailMessage');


    function getUnprocessedLeads(callback) {
        dao.query(null, function (result) {
            callback(result.data)
        });
    }


    function getAllLeads(callback) {
        dao.query("/all", function (result) {
            callback(result.data)
        });
    }


    function createLead(event, callback) {
        dao.postURL("/new", repack(event), function () {
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
            firstName: contact.firstName ? contact.firstName : "",
            surname: contact.surname ? contact.surname : "",
          companyName: contact.companyName ? contact.companyName : "",
            addressLine1: contact.addressLine1 ? contact.addressLine1 : "",
            addressLine2: contact.addressLine2 ? contact.addressLine2 : "",
            addressLine3: contact.addressLine3 ? contact.addressLine3 : "",
            country: contact.country ? contact.country : "",
            email: contact.email ? contact.email : "",
            postcode: contact.postcode ? contact.postcode : "",
            telephone: contact.telephone ? contact.telephone : "",
            mobile: contact.mobile ? contact.mobile : "",
            completeContact: contact.completeContact ? contact.completeContact : false,
            removed: contact.removed ? contact.removed : false,
            createdBy: contact.createdBy ? contact.createdBy : AppModel.getLoggedInUser(),
            createdOn: contact.createdOn ? new Date(contact.createdOn) : new Date(),
            modifiedOn: contact.modifiedOn ? new Date(contact.modifiedOn) : new Date(),
           // modifiedBy: contact.modifiedBy ? contact.modifiedBy : AppModel.getLoggedInUser()




        };
        console.log(object);
        return object;
    }

    return ({
        getUnprocessedLeads: getUnprocessedLeads,
        getAllLeads: getAllLeads,
        createLead: createLead,
        updateLead: updateLead,
        deleteLead: deleteLead,
        restoreLead: restoreLead
    })
}]);