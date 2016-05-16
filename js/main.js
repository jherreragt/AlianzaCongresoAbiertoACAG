var app = angular.module('webApp', ['ngSanitize'], function($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
});

app.controller('cumplimientoController', function($scope,$http){
  $scope.analisis = [];
  $scope.hash = '';
  $http.get('/data/analisis.json')
      .success(function (data) {
        $scope.analisis = data;
        $scope.hash = window.location.hash.slice(1);
      })
      .error(function (){
        $scope.messages = { response: false, message: 'no org loaded' }
      });
});