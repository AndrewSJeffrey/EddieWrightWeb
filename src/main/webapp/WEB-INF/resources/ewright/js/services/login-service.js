angular.module('eWrightServices').service('LoginService',  ['DAOAbstract', 'AppModel', function (DAOAbstract, AppModel) {

    var dao = DAOAbstract.createDAO('/login');


    function attemptLogin(username, password) {
        console.log(username + ":" + password);
        dao.query("?user=" + username + "&password=" + password, handleLoginResult);
    }

    function handleLoginResult(result) {
        AppModel.setLoggedIn(result.data);
    }


    return ({
        attemptLogin: attemptLogin
    })
}]);