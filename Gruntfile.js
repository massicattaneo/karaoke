module.exports = function (grunt) {

    // Project configuration.
    var bower = grunt.file.readJSON('bower.json');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            test: {
                files: ['app/js/**/*.js', 'tests/**/*Spec.js'],
                tasks: ['jasmine:test']
            }
        },
        uglify: {
            options: {
                banner: '/* <%= pkg.name %> version: <%= pkg.version %> */\n'
            },
            build: {
                src: 'app/js/*.js',
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
            all: ['app/js/**/*.js']
        },
        jasmine: {
            test: {
                src: 'app/js/**/*.js',
                options: {
                    specs: 'tests/*Spec.js',
                    vendor: bower.dependenciesFiles
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.task.registerTask('jasmintest', 'A sample task that run one test', function (testname) {
        if (arguments.length !== 0) {
            grunt.config('jasmine.test.options.specs', 'tests/' + testname + 'Spec.js');
        }
        grunt.task.run('jasmine:test');
    });

    grunt.task.registerTask('watchTest', 'A sample task that watch one test', function (testname) {
        if (arguments.length !== 0) {
            grunt.config('watch.test.files', ['app/js/' + testname + '.js', 'tests/' + testname + 'Spec.js']);
            grunt.config('watch.test.tasks', ['jasmintest:' + testname]);
        }
        grunt.task.run('jshint');
        grunt.task.run('watch');
    });

    grunt.registerTask('build', ['uglify']);

};