module.exports = function (grunt) {
  'use strict';

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    watch: {
      options: {
        livereload: true
      },
      js: {
        files: ['resources/scripts/*.js'],
        tasks: [
          'jshint:client',
          'jscs:client'
        ]
      },
      css: {
        files: ['styles/*.css', 'resources/*/*/*.css', 'resources/*/*/*/*.css']
      },
      express: {
        files: ['app/*.js', 'app/*/*.js', 'app/*/*/*.js'],
        tasks: ['jshint:server', 'jscs:server', 'express:dev'],
        options: {
          spawn: false
        }
      },
      handlebars: {
        files: [
          'views/layouts/*.handlebars',
          'views/public/*.handlebars',
          'views/public/partials/*.handlebars',
          'views/public/user/*.handlebars'
        ]
      }
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        jshintrc: true
      },
      client: {
        src: ['resources/scripts/*.js']
      },
      server: {
        src: ['app/*.js', 'app/*/*.js']
      },
      mocha: {
        src: ['test/model/*.js', 'test/controller/*.js']
      }
    },
    jscs: {
      client: {
        src: ['resources/scripts/*.js']
      },
      server: {
        src: ['app/*.js', 'app/*/*.js']
      }
    },
    open: {
      express: {
        path: 'http://localhost:3000'
      }
    },
    express: {
      dev: {
        options: {
          script: 'app/server.js'
        }
      }
    },
    mochaTest: {
      dist: {
        src: ['test/*/*.js']
      }
    }
  });

  grunt.registerTask('default', 'serve');
  grunt.registerTask('serve', ['express:dev', 'open:express', 'watch']);
  grunt.registerTask('mocha', ['watch:mocha']);
};