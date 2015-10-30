<html>
<head>
    <link href="${pageContext.request.contextPath}/resources/css/main.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/resources/css/bootstrap-theme.min.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/resources/css/bootstrap.min.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/resources/css/toaster.css" rel="stylesheet"/>
    <link href="${pageContext.request.contextPath}/resources/css/angular-block-ui.css" rel="stylesheet"/>
    <link href="${pageContext.request.contextPath}/resources/css/angular-bootstrap-calender.css" rel="stylesheet"/>
    <link href="${pageContext.request.contextPath}/resources/css/datetimepicker.css" rel="stylesheet"/>

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
    <script src="${pageContext.request.contextPath}/resources/js/moment.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/angular-bootstrap-calender.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/angular-bootstrap-calender-tpls.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/datetimepicker.js"></script>

    <script src="${pageContext.request.contextPath}/resources/js/core.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/scalyr.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/slyEvaluate.js"></script>
    <script src="${pageContext.request.contextPath}/resources/js/slyRepeat.js"></script>
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
</head>

<body ng-app="app" ng-controller="MenuController" ng-style="getPageStyle()">


<div ng-hide="isLoggedIn()">
    <login-page/>
</div>

<div ng-show="isLoggedIn()">
    <dashboard/>
</div>


<alerting/>
</body>

<script type="text/javascript">


   /* $(window).bind('beforeunload', function(){
        return 'Are you sure you want to close JDev WebApp?';
    });*/

</script>


<script src="${pageContext.request.contextPath}/resources/ewright/js/ewright-main.js"></script>

<script src="${pageContext.request.contextPath}/resources/ewright/js/services/app-model.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/services/dao/dao-abstract.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/services/dao/websocket-abstract.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/services/toaster-service.js"></script>

<script src="${pageContext.request.contextPath}/resources/ewright/js/services/action-service.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/services/login-service.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/services/user-service.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/services/event-service.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/services/opportunity-service.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/services/contact-service.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/services/leads-service.js"></script>

<script src="${pageContext.request.contextPath}/resources/ewright/js/controllers/menu-controller.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/controllers/planner-controller.js"></script>

<script src="${pageContext.request.contextPath}/resources/ewright/js/directives/login.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/directives/dashboard.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/directives/toaster.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/directives/users.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/directives/username.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/directives/opportunityList.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/directives/contact.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/directives/contacts.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/directives/leads.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/directives/tasks.js"></script>
<script src="${pageContext.request.contextPath}/resources/ewright/js/directives/actions.js"></script>


</html>




