// window.onload = function() {
//     var images = document.getElementsByTagName('img');
//     console.log(images);
    
//     for (var i=0; i < images.length; i++) {
//         images[i].onclick = function(elem) {
//             console.log(elem.target.src);
//             image_url = elem.target.src;
//             var xhr = new XMLHttpRequest();
//             xhr.open('POST', '/api/thumbnail/add');
//             xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//             xhr.send('image_url=' + encodeURIComponent(image_url) + "&item_id=16");
//             return false;
//         }
//     }
// }

var myApp = angular.module('myApp',[]);

myApp.controller('appController', function($scope, $http) {
    //$scope.imgclick = "";
    
// Get images
    //var images = document.getElementsByTagName('img');
    
// When you click on an image, trigger 'onclick' event handler
    
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
        
    
// Get the URL for the image clicked by grabbing it's src attribute
        //this.url = url;
    // Then make an Ajax request using the POST method to the 
    //appropriate API route
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
