module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-shell');

  grunt.initConfig({
    port: 19101,

    shell: {
      server: {
        command: '(node server.js &) && open http://localhost:19101'
      }
    }
  });

  grunt.registerTask('server', [
    'shell:server'
  ]);
};