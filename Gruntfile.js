'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    src: 'src',
    lib: 'lib',

    babel: {
      options: {
        stage: 0
      },
      all: {
        files: [{
          expand: true,
          cwd: '<%=src%>',
          src: ['**/*.js'],
          dest: '<%=lib%>/'
        }]
      }
    },

    watch: {
      babel: {
        files: ['<%=src%>/**/*.js'],
        tasks: ['babel:all']
      }
    }

  });

  grunt.registerTask('default', ['build', 'watch']);
  grunt.registerTask('build', ['babel']);

};
