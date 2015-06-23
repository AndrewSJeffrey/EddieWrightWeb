angular.module('eWrightServices').service('UserService', ['DAOAbstract', 'AppModel', function (DAOAbstract, AppModel) {

    var dao = DAOAbstract.createDAO('/users');

    function getAllUsers(callback) {
        dao.query("/all", function (data) {
            callback(data.data);
            AppModel.setAllUsers(data.data);
        });
    }

    return ({
        getAllUsers: getAllUsers
    })
}]);