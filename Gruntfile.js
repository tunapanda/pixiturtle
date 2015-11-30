module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-browserify');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		browserify: {
			pixelchallenge: {
				src: "src/PixiTurtle.js",
				dest: "bundle.js"
			}
		}
	})
}