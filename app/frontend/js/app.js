'use strict';

var app = angular.module('vulnNode', [
    'ngRoute',
    'ngResource',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'ui.bootstrap',
    'ngNotificationsBar'
]);

app.controller('MainController', function($scope, $http, $window,notifications) {

    $scope.login = function() {
        // body...
        if ($scope.success || $scope.warning) {
            $scope.success = "";
            $scope.warning = "";
        }
        if ($scope.user) {


            $http.post('/signin', $scope.user).then(response => {
                    console.log(response.data);
                    if(response.data.email){


                    $scope.success = "Login Success! Now Redirecting."
                    $window.sessionStorage.name = response.data.fullname;

                    var url = 'http://' + $window.location.host + '/home';
                    $window.location.href = url;  
                  }else{
                     $scope.warning = "Wrong Username Password"
                  }

                })
                .catch(error => {
                    console.log(error);
                    if (error.status == 401) {
                        if (error.data.message == "Account Not Verified") {
                            $scope.warning = "Account Not verified!"
                        } else {
                            $scope.warning = "Username/Password mismatch"
                        };
                    }
                });
        };

    };

    $scope.create = function() {
        // body...
        if ($scope.user) {

            $scope.user.email = $scope.user.email;
            $scope.user.password = $scope.user.password;
       
                $http.post('/signup', $scope.user).then(response => {
                        if (response.data.error == false) {
                            notifications.showWarning('Account Created You Can Login Now');
                        }

                    })
                    .catch(error => {

                        if (error.status == 422) {
                            $scope.warning1 = "Account with this email address already exists"
                        }

                    });



        };

    };

})

app.controller('HomeController', function($scope, $http, $window,notifications) {
  console.log('Home Awaits You!');
  $scope.name = $window.sessionStorage.getItem("name");
})
app.config(['$routeProvider', '$locationProvider', '$httpProvider',

    function($routeProvider, $locationProvider, $httpProvider) {


        var isLoggedIn = function($q, $timeout, $http, $rootScope, $location) {
            var deferred = $q.defer();
            $http.get('/signedin').success(function(user) {
                if (user !== '0') {
                    $rootScope.isSignedIn = true;
                    $rootScope.currentUser = user;
                    $timeout(deferred.resolve, 0);
                } else {
                    $rootScope.isSignedIn = false;
                    $rootScope.currentUser = {};
                    $timeout(function() { deferred.reject(); }, 0);
                    $location.url('/');
                }
            });
            return deferred.promise;
        };


        $httpProvider.interceptors.push('InterceptorService');


        $routeProvider
        // .when('/', {
        //   templateUrl: 'views/main.html',
        //   controller: 'MainCtrl'
        // })
            .when('/404', {
                templateUrl: 'views/404.html',
                controller: '404Ctrl'
            })
            .when('/home', {
                templateUrl: 'views/404.html',
                controller: 'HomeController'
            })
            .otherwise({
                redirectTo: '/404'
            });


        $locationProvider.html5Mode(true);

    }
]);
