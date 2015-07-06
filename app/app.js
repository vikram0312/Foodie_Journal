// Declare app level module which depends on views, and components
    angular.module('myApp', ['ngMaterial',
        'vAccordion',
        'ngRoute',
        'myApp.services'
    ]).config(['$routeProvider' ,
        function($routeProvider) {
            $routeProvider.
                when('/' , {templateUrl: 'StartPage/FirstPage.html'}).
                when('/Foodie_bucket',
                {templateUrl: 'Component/Foodie_bucket.html', controller: FoodieController}).
                when('/Content' ,
                {templateUrl: 'Journeys/Content.html' , controller: JourneyController}).
                when('/JourneyDetails' ,
                {templateUrl: 'JourneyDetails/JourneyDetails.html' , controller: JourneysDetailsController});
        }])
    .controller('MainController', function ($http, $scope, Authenticator, $location, $window) {
            $scope.usrnm = $window.localStorage.getItem('username');
            var keepGoing = true;
            if(($scope.usrnm) === undefined || ($scope.usrnm) === null) {
                $scope.isAuthenticated = false;
            }else{
                Authenticator.getLoginData().then(function (users) {
                    $scope.users = users.data;
                    angular.forEach($scope.users, function (key) {
                        if(keepGoing) {
                            if (key.name === $scope.usrnm) {
                                $scope.isAuthenticated = true;
                                Authenticator.setUsername($scope.usrnm);
                                keepGoing = false;
                            }
                            else {
                                $scope.isAuthenticated = false;
                            }
                        }
                    });
                });

            }

            $scope.Logout = function(){
                $window.localStorage.removeItem('username');
                $scope.isAuthenticated = false;
                history.go(-(history.length - 1));
            }
        $scope.Authenticate = function (username , password) {

            Authenticator.getLoginData().then(function (users) {
                $scope.users = users.data;
                angular.forEach($scope.users, function(key) {
                    if(keepGoing) {
                        if ((key.name === username) && key.password === password) {
                            $scope.isAuthenticated = true;
                            $location.path('/Foodie_bucket');
                            Authenticator.setUsername(username);
                            $window.localStorage.setItem('username', username);
                            keepGoing = false;
                        } else {
                            $scope.isAuthenticated = false;
                        }
                    }
                });
            });
        }
    });


angular.module('myApp.services', [])
    .service('Authenticator', function ($http) {
        var userName;
        return {
            getLoginData: function () {
                return $http.get('api/users.json');
            },

            setUsername : function(value){
                userName = value;
            },

            getUsername : function(){
                return userName;
            }

        };
    });






