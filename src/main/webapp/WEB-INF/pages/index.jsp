<html>
<head>
    <link href="${pageContext.request.contextPath}/resources/css/main.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/resources/css/bootstrap-theme.min.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/resources/css/bootstrap.min.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/resources/css/toaster.css" rel="stylesheet"/>
    <link href="${pageContext.request.contextPath}/resources/css/angular-block-ui.css" rel="stylesheet"/>

    <script src="${pageContext.request.contextPath}/resources/js/jquery-2.1.4.min.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/bootstrap.min.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/angular.min.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/angular-route.min.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/angular-animate.min.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/angular-block-ui.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/toaster.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/smart-table.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/underscore.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/ui-bootstrap-tpls.js"></script>
</head>

<body ng-app="app" ng-controller="menu" ng-style="getPageStyle()">


<div ng-hide="isLoggedIn()">
    <login-page/>
</div>

<div ng-show="isLoggedIn()">
    <dashboard/>
</div>


<alerting/>
</body>


<script src="${pageContext.request.contextPath}/resources/ewright/js/ewright-main.js"></script>

<script src="${pageContext.request.contextPath}/resources/ewright/js/services/app-model.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/services/dao/dao-abstract.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/services/dao/websocket-abstract.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/services/toaster-service.js"></script>

<script src="${pageContext.request.contextPath}/resources/ewright/js/services/login-service.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/services/user-service.js"></script>

<script src="${pageContext.request.contextPath}/resources/ewright/js/controllers/menu-controller.js"></script>

<script src="${pageContext.request.contextPath}/resources/ewright/js/directives/login.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/directives/dashboard.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/directives/toaster.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/directives/users.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/directives/username.js"></script>


</html>




