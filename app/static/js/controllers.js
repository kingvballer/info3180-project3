angular.module('myApp').controller('loginController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.loginForm.email, $scope.loginForm.password)
        // handle success
        .then(function () {
          $location.path('/welcome');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });

    };

}]);

angular.module('myApp').controller('logoutController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $location.path('/login');
        });

    };

}]);

angular.module('myApp').controller('registerController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.registerForm.firstname,
                            $scope.registerForm.lastname,
                            $scope.registerForm.sex,
                            $scope.registerForm.age,
                            $scope.registerForm.email,
                           $scope.registerForm.password)
        // handle success
        .then(function () {
          $location.path('/login');
          $scope.disabled = false;
          $scope.registerForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };

}]);


angular.module('myApp').controller('wishlistController',
  ['$scope', '$location', '$http', '$routeParams', 'AuthService',
  function ($scope, $location, $http, $routeParams, AuthService) {
      
    $scope.userid = localStorage.getItem('userid');
      
    $scope.wishAdd = function() {
        // initial values
        $scope.error = false;
        $scope.disabled = true;
        
        $http.post("/api/user/" + $scope.userid + "/wishlist", {
          "userid": $scope.userid,
          "title": $scope.addForm.title, 
          "description": $scope.addForm.description,
          "url": $scope.addForm.url,
          "imageUrl": ""
        })  
        .then(function (response) {
          // handle success
          localStorage.setItem('wishid', response.data.wishid);
          $location.path('/selectImage/' + response.data.wishid); // remember to create this route
          $scope.disabled = false;
          $scope.registerForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };
    
    $scope.wishid = localStorage.getItem('wishid');
      
    
    $scope.scrapeForImages = function () {
        // After you click on Add to Wishlist, redirect to another route (e.g. /selectImage to display images
        // for user to select
        var wishid = $routeParams.wishid ? $routeParams.wishid : $scope.wishid;
        // On that route you would do an ng-init for this function which will
        // send an ajax request to /api/thumbnail/process/<wishid> which should return a JSON object
        // with image urls
        $http.post("/api/thumbnail/process/" + $scope.wishid)
        
        // Then use ng-repeat in your angular template to show the images that were scraped
        
        // Then you would have an ng-click on each image and when clicked you would
        // grab the image url and then make another ajax request to /api/thumbnail/add
        // which would then update the wishlist item with the image url
        
        // redirect the user to their wishlist
        .then(function (response) {
            // console.log(response);
            $scope.images = response.data.images;
            $scope.disabled = false;
        },
        function (response) {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
        });

    
    };
    
    $scope.viewWish = function() {
          
          // initial values
          $scope.error = false;
          $scope.disabled = true;
          $scope.wishListItems = [];
          
          // call register from service
    //   AuthService.register($scope.viewForm.title,
    //                       $scope.viewForm.description,
    //                       $scope.viewForm.url,
    //                       $scope.viewForm.imageUrl
    //                       )
    var userid = $routeParams.userid ? $routeParams.userid : $scope.userid;
    
    // send a post request to the server
      $http.get('/api/user/' + userid + '/wishlist')
        // handle success
        .then(function (response) {
            console.log(response.data.wishes);
            $scope.wishListItems = response.data.wishes;
        },
        function (response) {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
        });

    };
    
    
    $scope.myClickedEvent = function(clickEvent) {
        //$scope.clickEvent = simpleKeys(clickEvent);
        var element = clickEvent.target;
        //var url = element.text()
        var url = element.src;
        console.log(url);
        
        // Get URL from location bar
        var addressBarUrl = $location.path();
        console.log(addressBarUrl);
        // split URL into different parts after each "/"
        var addressBarUrlParts = addressBarUrl.split("/");
        console.log(addressBarUrlParts);
       
        $http.post('/api/thumbnail/add',{
            image_url : url,
            item_id : addressBarUrlParts[2]
        }).then(function(response){
            // Do something if the AJAX request is successful
            // console.log(response);
            $location.path('/view/' + $scope.userid);
        });
    
    };
    
          
      
   
      
}]);