'use strict';

    angular
        .module('myApp')
        .controller('JourneyController',JourneyController)
        .factory('getTaskService',getTaskService)
        .service('getjourneysService' , function($http){
            this.getData = function() {
                return $http.get('Repositories/foodie-journal.json')
            }});

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

    function JourneyController($http, $scope, $interval,getDataService,$sce,$window, getjourneysService, getTaskService, $location){
        JourneyController.$inject = ['$http','$scope', '$interval','getDataService','$sce','$window','getjourneysService', 'getTaskService', '$location'];
        var selectedCuisine;
        getTaskService.setSelectedJourney(getDataService.getCountry());
        var usrnm  = $window.localStorage.getItem('username');
        $scope.fromLocalStorage = JSON.parse($window.localStorage.getItem('jsonData_'+ usrnm +'_Journey'));
        if(undefined !== getDataService.getCountry()) {
            //selectedCuisine = getDataService.getCountry();
            if(null !== $window.localStorage.getItem('selectedJourney')) {
                if ($window.localStorage.getItem('selectedCuisine') === $window.localStorage.getItem('selectedJourney')
                && $window.localStorage.getItem('back') === 'back') {
                    selectedCuisine = $window.localStorage.getItem('selectedCuisine');
                    $scope.selectedCuisine = selectedCuisine;
                    $scope.status = $window.localStorage.getItem('status');
                    $scope.duration = $window.localStorage.getItem('duration');
                    $window.localStorage.removeItem("back");
                }
                else {
                    selectedCuisine = getDataService.getCountry();
                    $scope.selectedCuisine = selectedCuisine;
                    $scope.status = getDataService.getStatus();
                    $scope.duration = getDataService.getDuration();
                }
            }else{
                selectedCuisine = getDataService.getCountry();
                $scope.selectedCuisine = selectedCuisine;
                $scope.status = getDataService.getStatus();
                $scope.duration = getDataService.getDuration();
            }

            $window.localStorage.removeItem("selectedCuisine");
            $window.localStorage.removeItem("status");
            $window.localStorage.removeItem("duration");
            $window.localStorage.setItem('selectedCuisine', selectedCuisine);
            $window.localStorage.setItem('status', $scope.status );
            $window.localStorage.setItem('duration', $scope.duration);
        }else{
            selectedCuisine = $window.localStorage.getItem('selectedCuisine');
            $scope.selectedCuisine = selectedCuisine;
            $scope.status = $window.localStorage.getItem('status');
            $scope.duration = $window.localStorage.getItem('duration');

        }
        $scope.range = new Array(5);
        $scope.MapURL=function(address){
            var preMapURL ="https://www.google.com/maps/embed/v1/place?key=AIzaSyDeesusO5tFgcZ-HET_3hFKfuZtfxNprCk&q="+address;
            return $sce.trustAsResourceUrl(preMapURL);
        }
        var createCanvas=function(percent)
        {
            var canvas = document.getElementById("myCanvas");
            var ctx = canvas.getContext("2d");
            var lastend = 0;
            var x= percent*3.6;
            var y = 360-x;
            var data = [y, x];
            var myColor = ['#CB3729', '#FE5140'];

            for (var i = 0; i < data.length; i++) {
                ctx.fillStyle = myColor[i];
                ctx.beginPath();
                ctx.moveTo(canvas.width / 2, canvas.height / 2);
                ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, -(lastend), -(lastend + (Math.PI * 2 * (data[i] / 360))), true);
                ctx.lineTo(canvas.width / 2, canvas.height / 2);
                ctx.fill();
                lastend += Math.PI * 2 * (data[i] / 360);
            }
        };

        var createImage =function(name)
        {
            if(name=="American")
                document.getElementById("canvasimage").innerHTML = "<img class='imgcuisine' src='Repositories/[FoodieChallenge]Asset (25).png'/>";
            else if(name=="Italian")
                document.getElementById("canvasimage").innerHTML = "<img class='imgcuisine' src='Repositories/[FoodieChallenge]Asset (1).png'/>";
            else if(name=="Mexican")
                document.getElementById("canvasimage").innerHTML = "<img class='imgcuisine' src='Repositories/[FoodieChallenge]Asset (2).png'/>";
            else
                document.getElementById("canvasimage").innerHTML = "<img class='imgcuisine' src='Repositories/[FoodieChallenge]Asset (3).png'/>";
        };
        var timer = $interval(function(){
            document.getElementById(selectedCuisine).focus();
            document.getElementById("pickButton").innerHTML = selectedCuisine + " <span class='caret'></span>";
            createImage(selectedCuisine);
            createCanvas($scope.status);
            if(angular.isDefined(timer))
            {
                $interval.cancel(timer);
                timer=undefined;
            }
        },500);



        if($scope.fromLocalStorage !== null && $scope.fromLocalStorage !== undefined) {
            $scope.journeys = $scope.fromLocalStorage;
        }else {
            getjourneysService.getData().then(function (data) {
                $scope.journeysData = data.data;
                angular.forEach($scope.journeysData.users, function (value, key) {
                    if (key === usrnm) {
                        $scope.journeys = value;
                        var dataToStore = JSON.stringify($scope.journeys);
                        $window.localStorage.setItem('jsonData_' + usrnm + '_Journey', dataToStore);
                    }
                });
            });
        }

        $scope.setValue= function()
        {
            var target = event.target || event.srcElement;
            selectedCuisine = target.id;
            $scope.selectedCuisine = selectedCuisine;
            getTaskService.setSelectedJourney(target.id);
            if($scope.fromLocalStorage !== null && $scope.fromLocalStorage !== undefined) {
                for(var i=0; i< $scope.journeys .length;i++)
                {
                    if(target.id != $scope.journeys [i].Cuisine)
                        continue;
                    else {
                        $scope.status = $scope.journeys [i].Status;
                        $scope.duration =$scope.journeys [i].Duration;
                        createCanvas($scope.status);
                        createImage($scope.selectedCuisine);
                    }
                }
            }else {
                angular.forEach($scope.journeysData.users, function (value, key) {
                    if (key === usrnm) {
                        for (var i = 0; i < value.length; i++) {
                            if (target.id != value[i].Cuisine)
                                continue;
                            else {
                                $scope.status = value[i].Status;
                                $scope.duration = value[i].Duration;
                                createCanvas($scope.status);
                                createImage($scope.selectedCuisine);
                            }
                        }
                    }
                });
            }

            $window.localStorage.removeItem("selectedCuisine");
            $window.localStorage.removeItem("status");
            $window.localStorage.removeItem("duration");

            $window.localStorage.setItem('selectedCuisine', selectedCuisine);
            $window.localStorage.setItem('status', $scope.status );
            $window.localStorage.setItem('duration', $scope.duration);

        };
        $scope.setValueMinBtn= function(text)
        {
           $scope.fromLocalStorage = JSON.parse($window.localStorage.getItem('jsonData_'+usrnm+'_Journey'))
            if($scope.fromLocalStorage !== null && $scope.fromLocalStorage !== undefined) {
                $scope.journeys = $scope.fromLocalStorage
                for(var i=0; i< $scope.journeys .length;i++)
                {
                    if(text != $scope.journeys [i].Cuisine)
                        continue;
                    else {
                        $scope.status = $scope.journeys [i].Status;
                        $scope.duration =$scope.journeys [i].Duration;
                        createCanvas($scope.status);
                        createImage($scope.selectedCuisine);
                    }
                }
            }else {
                angular.forEach($scope.journeysData.users, function (value, key) {
                    if (key === usrnm) {
                        for (var i = 0; i < value.length; i++) {
                            if (text != value[i].Cuisine)
                                continue;
                            else {
                                $scope.status = value[i].Status;
                                $scope.duration = value[i].Duration;
                                createCanvas($scope.status);
                                createImage($scope.selectedCuisine);
                            }
                        }
                    }
                });
            }
            selectedCuisine = text;
            getTaskService.setSelectedJourney(text);
            $scope.selectedCuisine = selectedCuisine;

            $window.localStorage.removeItem("selectedCuisine");
            $window.localStorage.removeItem("status");
            $window.localStorage.removeItem("duration");

            $window.localStorage.setItem('selectedCuisine', selectedCuisine);
            $window.localStorage.setItem('status', $scope.status );
            $window.localStorage.setItem('duration', $scope.duration);
            document.getElementById("pickButton").innerHTML = text + " <span class='caret'></span>";
        };


        $scope.followCuisine =function(event){
            $scope.fromLocalStorage = JSON.parse($window.localStorage.getItem('jsonData_'+usrnm+'_Journey'))
            if($scope.fromLocalStorage !== null && $scope.fromLocalStorage !== undefined) {
                $scope.journeys = $scope.fromLocalStorage
                angular.forEach($scope.journeys, function(key, value) {
                    if($scope.selectedCuisine == key.Cuisine){
                        var putbreak = true;
                        angular.forEach(key.Dishes, function(key, value,count) {
                            if('Completed' != key.Status && putbreak){
                                getTaskService.setTask(key.Dish);
                                getTaskService.setIndex(key.DishIndex);
                                putbreak = false;
                            }
                        });
                    }
                });

            }else{
                angular.forEach($scope.journeys, function(key, value) {
                if($scope.selectedCuisine == key.Cuisine){
                    var putbreak = true;
                    angular.forEach(key.Dishes, function(key, value,count) {
                        if('Completed' != key.Status && putbreak){
                            getTaskService.setTask(key.Dish);
                            getTaskService.setIndex(key.DishIndex);
                            putbreak = false;
                        }
                    });
                }
            });
            }
            $location.path('/JourneyDetails');
        }

}
