var app = angular.module('observatorioApp', ['ngSanitize'], function ($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
});
var macro_areas = {{site.data.macro_areas | jsonify }}
var totales = {{site.data.totales | jsonify}}
var categories_by_macro = {{site.data.categories_by_macro | jsonify}}
var data_categories = {{site.data.data_categories | jsonify}}

function slugify(text)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

app.controller('MainController', ["$scope", "$http", "$timeout", "$filter", function ($scope, $http, $timeout, $filter) {
      totales.forEach(function (d) {

        var classname = '';
        if (d.fulfillment_macro_area == '') {
          d.fulfillment_macro_area = 0;
        }
        d.fulfillment_macro_area = $filter('number')(d.fulfillment_macro_area, 0)
        var label = [d.fulfillment_macro_area + "%"," "];
        if (d.mensaje) {
          label = [d.mensaje, 'lanzamiento'];
          classname = 'only-txt';
          $('.ct-chart-' + d.id).addClass(classname);
        }
        new Chartist.Pie('.ct-chart-' + d.id, {
          labels: label,
          series: [parseInt(d.fulfillment_macro_area),parseInt(100)]
        }, {
          donut: true,
          total:100,
          donutWidth: 15,
          startAngle: 0,
          showLabel: true,
          labelOffset: -68
        }, [
          ['screen and (max-width: 1199px)', {
            labelOffset: -68
          }],
          ['screen and (max-width: 991px)', {
            labelOffset: -70
          }],
          ['screen and (max-width: 320px)', {
            labelOffset: -60
          }]
        ]);
        $('.note-' + d.id).text($filter('number')(d.quality_macro_area, 1))
      })
}]);

app.controller('PromissesController', ["$scope", "$http", "$timeout", "$filter", function ($scope, $http, $timeout, $filter) {
  $scope.macro_area = []
  $scope.promisses = {};
  $scope.promisses.items = [];
  var categories = {};
  macro_areas.forEach(function (d) {
    $scope.macro_area.push(d.macro_area)
    $scope.promisses.name = "Promisses"
    $scope.promisses.items.push({
      "name": d.macro_area,
      "id": slugify(d.macro_area),
      "fulfillment_macro_area": d.fulfillment_macro_area,
      "quality_macro_area": d.quality_macro_area,
      "items": get_category_by_macro_category(d.macro_area)
    });
  })
  fill_total();

  function fill_total() {
    $(function(){

      totales.forEach(function (d) {
        if ($('.ct-chart-' + d.id).length) {

          var classname = '';
          if (d.fulfillment_macro_area == '') {
            d.fulfillment_macro_area = 0;
          }
          d.fulfillment_macro_area = $filter('number')(d.fulfillment_macro_area, 0)
          var label = [d.fulfillment_macro_area + "%"];
          if (d.mensaje!='' && d.macro_area === $('.ct-chart-' + d.id + ' svg g:eq(2) text')) {
            label = [d.mensaje, 'lanzamiento'];
            classname = 'only-txt';
            $('.ct-chart-' + d.id).addClass(classname);
          }
          new Chartist.Pie('.ct-chart-' + d.id, {
            labels: label,
            series: [parseInt(d.fulfillment_macro_area)]
          }, {
            donut: true,
            total: 100,
            donutWidth: 15,
            startAngle: 0,
            showLabel: true,
            labelOffset: -68
          }, [
            ['screen and (max-width: 980px)', {
              labelOffset: -75
            }]
          ]);        }
      })
    })
  }

  function get_category_by_macro_category(macro) {
    var categories = [];
    categories_by_macro[macro].forEach(function (d) {
      var category = {};
      category.name = d.category;
      category.id = slugify(d.category),
      get_promisse_by_category(category);
      categories.push(category);
    })
    return categories;
  }

  function get_promisse_by_category(category) {
    category.full = 0;
    category.advance = 0;
    category.progress = 0;
    category.total = 0;
    category.accomplished = 0;
    category.avg_progress = 0;
    category.avg_quality = 0;
    category.items = [];
    var cnt = 1;
    var new_fulfillment = 0;
    var ponderator = 0;
    data_categories[category.name].forEach(function (d) {
      if (d.fulfillment == '100%') {
        category.full = category.full + 1;
      } else if (d.fulfillment == '0%') {
        category.advance = category.advance + 1;
      } else {
        category.progress = category.progress + 1;
      }
      float_ponderator = parseFloat(d.ponderator.replace("%", ""))
      if (d.destacado=='1') {
        d.importance = "color-high";
      }
      else {
          d.importance = ''
      }
      if(cnt == 1){
        category.accomplished = d.fulfillment_cat * 100;
        category.quality = d.quality_cat;
      }
      cnt++;
      category.items.push(d)
    })
  }

}])


