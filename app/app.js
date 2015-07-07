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
        .factory('getTaskService',getTaskService)
        .controller('MainController', MainController )


                function getTaskService(){
                    var task;
                    var index;
                    var selectedJourney;
                    return{
                        setIndex:function(value){
                            index=value;
                        },
                        getIndex:function(){
                            return index;
                        },
                        setSelectedJourney:function(value){
                            selectedJourney=value;
                        },
                        getSelectedJourney:function(){
                            return selectedJourney;
                        },
                        setTask: function (value) {
                            task = value;
                        },
                        getTask: function () {
                            return task;
                        }
                    }

                }

        function MainController ($http, $scope, Authenticator, $location, $window , getTaskService){
           // $scope.isFooter = true;
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
                $location.path('/');
               // $scope.isFooter = true;
            }
        $scope.Authenticate = function (username , password) {

            Authenticator.getLoginData().then(function (users) {
                $scope.users = users.data;
                angular.forEach($scope.users, function(key) {
                    if(keepGoing) {
                        if ((key.name === username) && key.password === password) {
                            $scope.isAuthenticated = true;


                            ////////
                            $scope.fromLocalStorage = JSON.parse($window.localStorage.getItem('jsonData_'+username+'_Journey'))
                            if($scope.fromLocalStorage !== null && $scope.fromLocalStorage !== undefined) {
                                $scope.journeys = $scope.fromLocalStorage
                                $scope.selectedCuisine = $window.localStorage.getItem('selectedJourney_'+username);
                                angular.forEach($scope.journeys, function(key, value) {
                                    if($scope.selectedCuisine == key.Cuisine){
                                        var putbreak = true;
                                        angular.forEach(key.Dishes, function(key, value,count) {
                                            if('Completed' != key.Status && key.Status == 'Started' && putbreak){
                                                getTaskService.setTask(key.Dish);
                                                getTaskService.setIndex(key.DishIndex);
                                                $location.path('/JourneyDetails');
                                                putbreak = false;
                                            }else if(putbreak) {
                                                $location.path('/Foodie_bucket');
                                            }
                                        });
                                    }
                                });
                            }else {
                                $location.path('/Foodie_bucket');
                            }
                            //$scope.isFooter = false;
                            Authenticator.setUsername(username);
                            $window.localStorage.setItem('username', username);
                            keepGoing = false;
                        } else {
                            $scope.isAuthenticated = false;
                            //$scope.isFooter = true;
                        }
                    }
                });
            });
        }
    };


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






