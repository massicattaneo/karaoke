module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bowerRequirejs: {
            all: {
                rjsConfig: 'config.js',
                options: {
                    exclude: []
                }
            }
        },
        watch: {
            scripts: {
                files: ['js/**/*.js'],
                tasks: ['jshint', 'jasmine'],
                options: {
                    spawn: false
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'js/*.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                }
            },
            all: ['js/*.js']
        },
        jasmine: {
            test: {
                src: 'js/**/*.js',
                options: {
                    specs: 'tests/*Spec.js',
                    vendor: ''
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-bower-requirejs');

    grunt.registerTask('demo', ['bowerRequirejs', 'watch']);

};