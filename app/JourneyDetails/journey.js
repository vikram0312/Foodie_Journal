    angular
        .module('myApp')
        .controller('JourneysDetailsController', JourneysDetailsController)

    function JourneysDetailsController($http,$scope,$sce,getTaskService,$window,$location){
            JourneysDetailsController.$inject = ['$http', '$scope','$sce','getTaskService','$window','$location'];
        var usrnm  = $window.localStorage.getItem('username');
        if(undefined !== getTaskService.getSelectedJourney()) {
                $scope.pendingTask = getTaskService.getTask();
                $scope.selectedJourney = getTaskService.getSelectedJourney();
                $scope.dishIndex = getTaskService.getIndex();
                $window.localStorage.removeItem("pendingTask");
                $window.localStorage.removeItem("selectedJourney_"+usrnm);
                $window.localStorage.removeItem("dishIndex");
                $window.localStorage.setItem('pendingTask', $scope.pendingTask);
                $window.localStorage.setItem('selectedJourney_'+usrnm, $scope.selectedJourney );
                $window.localStorage.setItem('dishIndex', $scope.dishIndex);
                $window.localStorage.setItem('back', 'back');
        }else{
            $scope.pendingTask = $window.localStorage.getItem('pendingTask');
            $scope.selectedJourney = $window.localStorage.getItem('selectedJourney_'+usrnm);
            $scope.dishIndex = $window.localStorage.getItem('dishIndex');
        }

        $scope.fromLocalStorage = JSON.parse($window.localStorage.getItem('jsonData_'+usrnm+'_Journey'))

        if($scope.fromLocalStorage !== null && $scope.fromLocalStorage !== undefined) {
            $scope.journeys = $scope.fromLocalStorage;
            //alert($scope.journeys)
        }

        $scope.fromLocalStorage2 = JSON.parse($window.localStorage.getItem('jsonData_'+usrnm))
        if($scope.fromLocalStorage2 !== null && $scope.fromLocalStorage2 !== undefined) {
            $scope.cuisines  = $scope.fromLocalStorage2;
            //alert($scope.cuisines);
        }

            $scope.range = new Array(5);
            //$scope.selectedCuisine ="American";
            $scope.MapURL=function(address){
                var preMapURL ="https://www.google.com/maps/embed/v1/place?key=AIzaSyDeesusO5tFgcZ-HET_3hFKfuZtfxNprCk&q="+address;
                return $sce.trustAsResourceUrl(preMapURL);
            }

        $scope.markStarted=function(a) {
            if($scope.fromLocalStorage !== null && $scope.fromLocalStorage !== undefined) {
                $scope.journeys = $scope.fromLocalStorage;
            }
            if($scope.fromLocalStorage2 !== null && $scope.fromLocalStorage2 !== undefined) {
                $scope.cuisines  = $scope.fromLocalStorage2;
                //alert($scope.journeys)
            }
            if( a === 'Started'){
                angular.forEach($scope.journeys, function(key) {
                    if($scope.selectedJourney == key.Cuisine){
                        var putbreak = true;
                        angular.forEach(key.Dishes, function(key) {
                            if(key.Dish === $scope.pendingTask) {
                                key.Status = 'Started';
                                var dataToStore = JSON.stringify($scope.journeys);
                                $window.localStorage.setItem('jsonData_' + usrnm + '_Journey', dataToStore);
                                putbreak = false;
                            }
                        });
                    }
                });

            }else if(a === 'Completed'){
                var count = 0;
                angular.forEach($scope.journeys, function(key) {
                    if($scope.selectedJourney == key.Cuisine){
                        var putbreak = true;
                        angular.forEach(key.Dishes, function(key) {
                            if(key.Dish === $scope.pendingTask) {
                                key.Status = 'Completed';
                                $window.localStorage.removeItem('jsonData_'+ usrnm +'_Journey');
                                var dataToStore = JSON.stringify($scope.journeys);
                                $window.localStorage.setItem('jsonData_'+ usrnm +'_Journey', dataToStore);
                                putbreak = false;
                            }if(key.Status === 'Completed'){
                                count++;
                            }
                        });

                        key.Status = 50*count;
                        var dataToStore = JSON.stringify($scope.journeys);
                        $window.localStorage.setItem('jsonData_' + usrnm + '_Journey', dataToStore);

                        for(var i =0;i<$scope.cuisines.length;i++){
                            if ($scope.cuisines[i].countryName === key.Cuisine) {
                                $scope.cuisines[i].status =  50*count;
                                var dataToStore = JSON.stringify($scope.cuisines);
                                $window.localStorage.setItem('jsonData_' + usrnm, dataToStore);
                                $window.localStorage.removeItem("status");
                                $window.localStorage.setItem('status', $scope.cuisines[i].status );
                            }
                        }
                    }
                });

            }

        }
        $scope.previousPage = function(){
            $location.path('/Content');
        }
    }
