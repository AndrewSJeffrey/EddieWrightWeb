angular.module('eWrightServices').service('UserService', ['DAOAbstract', 'AppModel', function (DAOAbstract, AppModel) {

    var dao = DAOAbstract.createDAO('/users');

    function getAllUsers(callback) {
        dao.query("/all", function (data) {
            callback(data.data);
            AppModel.setAllUsers(data.data);
        });
    }

    function createNewUser(user, callback) {
        dao.postURL("/new", repack(user), function () {
            callback();
        });
    }

    function deleteUser(user, callback) {
        dao.postURL("/delete", repack(user), function () {
            callback();
        });
    }

    function restoreUser(user, callback) {
        dao.postURL("/restore", repack(user), function () {
            callback();
        });
    }

    function updateUser(user, callback) {
        dao.postURL("/update", repack(user), function () {
            callback();
        });
    }

    function resetPassword(user, callback) {
        dao.postURL("/resetPassword", repack(user), function () {
            callback();
        });
    }

    function repack(user) {
        return {
            id: user.id ? user.id : 0,
            username: user.username ? user.username : "",
            firstname: user.firstname ? user.firstname : "",
            surname: user.surname ? user.surname : "",
            email: user.email ? user.email : "",
            dateCreated: user.dateCreated ? user.dateCreated : new Date(),
            dateModified: user.dateModified ? user.dateModified : new Date(),
            modifiedBy: user.modifiedBy ? user.modifiedBy : "SYSTEM",
            role: user.role ? user.role : null,
            password: user.password ? user.password : "SYSTEM",
            removed: user.removed
        };
    }


    return ({
        getAllUsers: getAllUsers,
        createNewUser: createNewUser,
        deleteUser: deleteUser,
        restoreUser: restoreUser,
        updateUser: updateUser,
        resetPassword: resetPassword
    })
}]);