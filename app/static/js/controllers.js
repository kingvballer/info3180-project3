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
      AuthService.register($scope.registerForm.email,
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
        $http.post("/api/user/" + $scope.userid + "/wishlist", {"title": $scope.title, "description": $scope.ddsc, "imageUrl": ""})  
        // handle success
        .then(function () {
          $location.path('/selectImage'); // remember to create this route
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
    
    $scope.scrapeForImages = function () {
        // After you click on Add to Wishlist, redirect to another route (e.g. /selectImage to display images
        // for user to select
        
        // On that route you would do an ng-init for this function which will
        // send an ajax request to /api/thumbnail/process/<wishid> which should return a JSON object
        // with image urls
        
        // Then use ng-repeat in your angular template to show the images that were scraped
        
        // Then you would have an ng-click on each image and when clicked you would
        // grab the image url and then make another ajax request to /api/thumbnail/add
        // which would then update the wishlist item with the image url
        
        // redirect the user to their wishlist
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
      $http.get('/api/user/' + $scope.userid + '/wishlist')
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
    
    
          
      
   
      
}]);