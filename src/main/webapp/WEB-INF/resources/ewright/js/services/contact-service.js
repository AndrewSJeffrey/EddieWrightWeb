angular.module('eWrightServices').service('ContactService', ['DAOAbstract', 'AppModel', function (DAOAbstract, AppModel) {

    var dao = DAOAbstract.createDAO('/contacts');


    function getContacts(callback) {
        dao.query(null, function (result) {
            callback(result.data)
        });
    }

    function getContactById(id, callback){
        dao.query("/getContactById?id=" + id, function (result) {
            callback(result)
        });
    }

    function searchContacts(search, callback) {
        dao.query("/search?search=" + search, function (result) {
            callback(result.data)
        });
    }
    function searchContactsFirstName(search, callback) {
        dao.query("/searchFirstName?search=" + search, function (result) {
            callback(result.data)
        });
    }

    function getContactCount(callback) {
        dao.query("/count", function (result) {
            callback(result.data)
        });
    }

    function createContact(event, callback) {
        dao.postURL("/new", repack(event), function () {
            if (callback instanceof Function) {
                callback();
            }
        });
    }

    function restoreContact(event, callback) {
        dao.postURL("/restore", repack(event), function () {
            if (callback instanceof Function) {
                callback();
            }
        });
    }

    function deleteContact(event, callback) {
        dao.postURL("/delete", repack(event), function () {
            if (callback instanceof Function) {
                callback();
            }
        });
    }

    function updateContact(contact, callback) {
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
        getContacts: getContacts,
        getContactCount: getContactCount,
        createContact: createContact,
        updateContact: updateContact,
        deleteContact: deleteContact,
        restoreContact: restoreContact,
        searchContacts : searchContacts,
        searchContactsFirstName : searchContactsFirstName,
        getContactById : getContactById
    })
}]);