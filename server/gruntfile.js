module.exports = function(grunt) {
  grunt.initConfig({
    exec: {
      unit_test: 'npm test'
    },
    watch: {
      files: ['spec/**', 'src/**'],
      tasks: ['exec:unit_test']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('default', ['watch']);
};
