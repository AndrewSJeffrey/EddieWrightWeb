<html>
<head>
    <link href="${pageContext.request.contextPath}/resources/css/main.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/resources/css/bootstrap-theme.min.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/resources/css/bootstrap.min.css" rel="stylesheet">

    <script src="${pageContext.request.contextPath}/resources/js/jquery-2.1.4.min.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/bootstrap.min.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/angular.min.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/angular-route.min.js"></script>
</head>
<body ng-app="app">

<div ng-controller="menu">


    <div ng-hide="isLoggedIn()">
        <login-page/>
    </div>

    <div ng-show="isLoggedIn()">

        <dashboard/>
    </div>

</div>


</body>

<script src="${pageContext.request.contextPath}/resources/ewright/js/ewright-main.js"></script>

<script src="${pageContext.request.contextPath}/resources/ewright/js/services/app-model.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/services/dao/dao-abstract.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/services/dao/websocket-abstract.js"></script>

<script src="${pageContext.request.contextPath}/resources/ewright/js/services/login-service.js"></script>

<script src="${pageContext.request.contextPath}/resources/ewright/js/controllers/menu-controller.js"></script>

<script src="${pageContext.request.contextPath}/resources/ewright/js/directives/login.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/directives/dashboard.js"></script>

</html>




