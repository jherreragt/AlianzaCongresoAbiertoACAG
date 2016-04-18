/*global module:false*/

var request = require('request');
var fs = require('fs');
var tabletop = require('tabletop');
var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1-CvUisj_21LEjfvU1QaHK3ZtEmrwquZhjDSekSMNO7A/pubhtml';

var current_branch = 'gh-pages';

function functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
    for (var i = 0; i < arraytosearch.length; i++) {

        if (arraytosearch[i][key] == valuetosearch) {
        return i;
        }
    }
    return -1;
}

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-git');
  // Project configuration.
  grunt.initConfig({
    gitcommit: {
        data: {
         options: {
             'allowEmpty': true
          },
          files: [
            {
              src: ["_data/analisis.json","_data/cumplimientos.json"],
              expand: true,
            }
          ]
        },
      },
    gitadd: {
        task: {
          options: {
            force: true
          },
          files: {
              src: ["_data/analisis.json","_data/cumplimientos.json"],
          }
        }
      },
    gitpush: {
        data: {
            options: {
                'branch': current_branch
          }
        }
      },
    gitpull: {
        data: {
            options: {
                "remote": "origin",
                "branch": current_branch
            }
        }
    }
  });

  // These plugins provide necessary tasks.

  // Default task.
    grunt.registerTask('UpdateData', 'Va a buscar las cosas a google docs y las deja en un json ◕‿◕', function() {
      var done = this.async();
      var i = tabletop.init({key: public_spreadsheet_url, callback: function(data, tabletop) {

        /*cumplimientos*/
        var all_cumplimientos = tabletop.models.cumplimiento.elements;
        var cumplimientos = []

        for (var i=0; i < all_cumplimientos.length; i++){
          if( all_cumplimientos[i].area !== 'TOTAL' ) {
            cumplimientos.push({
              "area": all_cumplimientos[i].area,
              "total": all_cumplimientos[i].total,
              "nota": all_cumplimientos[i].nota
            })
          }
        }

        /*analisis*/
        var all_analisis = tabletop.models.analisis.elements;
        var analisis = []

        for (var i=0; i < all_analisis.length; i++){
          if( all_analisis[i].area !== '' ) {
            analisis.push({
              "id": all_analisis[i].uid,
              "area": all_analisis[i].area,
              "promesa": all_analisis[i].promesa,
              "cumplimiento_total": all_analisis[i].cumplimiento_total,
              "coherencia_total": all_analisis[i].coherencia_total
            })
          }
        }

        /*save files*/
        grunt.file.write("_data/cumplimientos.json", JSON.stringify(cumplimientos, null, 4));
        grunt.log.ok("_data/cumplimientos.json")
        grunt.file.write("_data/analisis.json", JSON.stringify(analisis, null, 4));
        grunt.log.ok("_data/analisis.json")
      }, simpleSheet: true})
    });

    grunt.registerTask("default", ['UpdateData', 'gitadd', 'gitcommit', 'gitpull', 'gitpush'])


};
