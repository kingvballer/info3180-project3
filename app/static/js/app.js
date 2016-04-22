var myApp = angular.module('myApp',["ngRoute"]);

myApp.controller('appController', function($scope, $http) {
    $scope.myClickedEvent = function(clickEvent) {
        //$scope.clickEvent = simpleKeys(clickEvent);
        var element = clickEvent.target;
        //var url = element.text()
        var url = element.src;
        console.log(url);
        
        // Get URL from location bar
        var addressBarUrl = location.pathname;
        console.log(addressBarUrl);
        // split URL into different parts after each "/"
        var addressBarUrlParts = addressBarUrl.split("/");
        console.log(addressBarUrlParts);
       
        $http.post('/api/thumbnail/add',{
            image_url : url,
            item_id : addressBarUrlParts[4]
        }).then(function(response){
            // Do something if the AJAX request is successful
            // console.log(response);
            window.location = '/api/user/6';
        });
    
    };
    
});
myApp.controller('emailControler', function($scope, $http) {
    $scope.isPopupVisible = false;
    
    $scope.showPopup = function(email) {
        $scope.isPopupVisible = true;
        $scope.selectedEmail = email;
    };
    
    $scope.closePopup = function() {
        $scope.isPopupVisible = false;
    };
    
    $scope.composeEmail = {};
    $scope.emailSent = false;
    
    var addressBarUrl = location.pathname;
        console.log(addressBarUrl);
        // split URL into different parts after each "/"
        var addressBarUrlParts = addressBarUrl.split("/");
        console.log(addressBarUrlParts);
    
    $scope.sendEmail = function() {
        $http.post("/api/user/" + addressBarUrlParts[3] + "/wishlists/share", {email: $scope.email}).then(function (response) {
            $scope.emailSent = true;
            console.log (response.data);
            $('#myModal').modal('hide')
            //$scope.isComposePopupVisible = false;
            
            // $scope.composeEmail = response.data;
            // $scope.sentEmails.splice(0, 0, $scope.composeEmail);
        }, function() {
            $scope.emailSent = false;
            // Display a message that wishlist wasn't shared.
        });
    };
    
    $scope.showComposePopup = function() {
        $scope.composeEmail = {};
        $scope.isComposePopupVisible = true;
    };


});

myApp.config(function ($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'static/angularT/home.html'
        })
        .when('/login',{
            templateUrl: 'static/angularT/login.html',
            controller: 'loginController',
            access: {restricted: false}
            
        })
        .when('/logout', {
            controller: 'logoutController',
            access: {restricted: true}
        })
        
        .when('/welcome', {
            templateUrl: 'static/angularT/welcome.html',
            controller: 'wishlistController',
            access: {restricted: true}
        })
        
        .when('/register', {
            templateUrl: 'static/angularT/register.html',
            controller: 'registerController',
            access: {restricted: false}
        })
        
        .when('/add', {
            templateUrl: 'static/angularT/addWish.html',
            controller: 'wishlistController',
            access: {restricted: false}
            
        })
        
        .when('/view/:userid', {
            templateUrl: 'static/angularT/viewWish.html',
            controller: 'wishlistController',
            access: {restricted: false}
            
        })
        
        
        
        
        .otherwise({
            redirectTo: '/'
        });
    
    
    
    
    
    
    
    
});
