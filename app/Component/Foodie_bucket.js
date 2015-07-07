'use strict';
angular
    .module('myApp')
    .controller('FoodieController', FoodieController)

function FoodieController($http, $scope, getDataService, Authenticator, $location, $window) {
    FoodieController.$inject = ['$http','$scope', 'getDataService', 'Authenticator', '$location', '$window'];
    $scope.results = [];
    var usrname = Authenticator.getUsername();

    $scope.fromLocalStorage = JSON.parse($window.localStorage.getItem('jsonData_'+usrname))

    if($scope.fromLocalStorage !== null && $scope.fromLocalStorage !== undefined) {
        $scope.cuisines = $scope.fromLocalStorage;
        $scope.clickable = function (country, status, duration) {
            getDataService.setCountry(country);
            getDataService.setStatus(status);
            getDataService.setDuration(duration);
            $location.path('/Content');

        }
    }else {
        getDataService.getData().then(function (data) {
            $scope.results = data.data;
            angular.forEach($scope.results.users, function (value, key) {
                if (key === Authenticator.getUsername()) {
                    $scope.cuisines = value;
                    var dataToStore = JSON.stringify($scope.cuisines);
                    $window.localStorage.setItem('jsonData_' + usrname, dataToStore);
                }
            });
            $scope.clickable = function (country, status, duration) {
                getDataService.setCountry(country);
                getDataService.setStatus(status);
                getDataService.setDuration(duration);
                $location.path('/Content');

            }
        })
    }
}

angular.module('myApp.services')
.service('getDataService', function($http) {
    var country;
    var status;
    var duration;
    this.getData = function() {
        return $http.get('Component/Foodie_bucket.json')
    }
    this.setCountry =  function (value) {
        country = value;
    }
    this.getCountry = function () {
        return country;
    }
    this.setStatus = function (value) {
        status = value;
    }
    this.getStatus= function () {
        return status;
    }
    this.setDuration = function (value) {
        duration = value;
    }
    this.getDuration = function () {
        return duration;
    }

});



