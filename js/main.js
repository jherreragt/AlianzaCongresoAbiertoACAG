var app = angular.module('webApp', ['ngSanitize'], function($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
});

app.controller('cumplimientoController', function($scope,$http){
  $scope.analisis = [];
  $http.get('/data/analisis.json')
      .success(function (data) {
        $scope.analisis = data;
      })
      .error(function (){
        $scope.messages = { response: false, message: 'no org loaded' }
      });

  $scope.getInfo = function(area){
    $scope.area = area;
  }

});