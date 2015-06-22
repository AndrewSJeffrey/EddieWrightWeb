angular.module('eWrightDirectives').directive('users', function () {


    var controller = ['$scope', 'LoginService', 'ToasterService', 'blockUI', function ($scope, LoginService, ToasterService, blockUI) {

        $scope.rowCollection = [
              {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
            dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "Bobby", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "Jimmy", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "Jimmy", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"},
            {username : "ABC", firstname:"Andrew", surname : "Jeffrey", email : "AndrewJeffrey@live.co.uk", role : "Admin" , password :"***", dateCreated : new Date(),
                dateModified: new Date(), modifiedBy: "SystemAdmin"}

        ];

    }];


    return {
        restrict: 'E',
        replace: 'true',
        scope: true,
        controller: controller,
        templateUrl: '/resources/ewright/templates/users.html',
        link: function (scope, elem, attrs) {

        },
        compile: function (tElem, attrs) {
        }
    };
});