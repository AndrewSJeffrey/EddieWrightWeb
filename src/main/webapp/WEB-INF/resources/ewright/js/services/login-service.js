angular.module('eWrightServices').service('LoginService',  ['DAOAbstract', 'AppModel', function (DAOAbstract, AppModel) {

    var dao = DAOAbstract.createDAO('/login');


    function attemptLogin(username, password, callback) {
        dao.query("?user=" + username + "&password=" + password, function (result) {
            handleLoginResult(result);
            callback(result)
        });
    }

    function handleLoginResult(result) {
        AppModel.setLoggedIn(result.data);
    }

    function logout() {
        AppModel.setLoggedIn(null);
    }


    return ({
        attemptLogin: attemptLogin,
        logout : logout
    })
}]);