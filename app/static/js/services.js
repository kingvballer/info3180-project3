angular.module('myApp').factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    // create user variable
    var user = null;

    // return available functions for use in controllers
    return ({
      isLoggedIn: isLoggedIn,
      login: login,
      logout: logout,
      register: register
      //getUserStatus: getUserStatus
    });

    function isLoggedIn() {
      if(user) {
        return true;
      } else {
        return false;
      }
    }

    function login(email, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/api/user/login', {email: email, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.result){
            user = true;
            //console.log(data.userid);
            localStorage.setItem('userid', data.userid);
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;
    }
    
    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/api/user/logout')
        // handle success
        .success(function (data) {
          user = false;
          localStorage.removeItem('userid');
          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }
    
    function register(firstname, lastname, sex, age, email, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/api/user/register', {firstname:firstname, lastname: lastname, sex: sex, age: age, email: email, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.result){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }
    
    
    function add(title, description, url, imageUrl) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/api/user/<id>/wishlist', {title: title, description: description, url: url, imageUrl: imageUrl})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.result){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }
    
    
    function viewWish(title, description, url, imageUrl) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.get('/api/user/1/wishlist')
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.result){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }
    
    
    
    
    
    
    
    
    function getUserStatus() {
      return $http.get('/api/user/status')
      // handle success
      .success(function (data) {
        if(data.status){
          user = true;
        } else {
          user = false;
        }
      })
      // handle error
      .error(function (data) {
        user = false;
      });
    }
}]);