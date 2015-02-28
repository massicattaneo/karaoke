module.exports = function (grunt) {

    var getBowerPaths = function () {
        var config = grunt.file.read('config.js'), arr = [];
        config = config.replace('require.config({', 'var o = {');
        config = config.replace('requirejs.config({', 'var o = {');
        config = config.replace('});', '}');
        eval(config);
        for (var path in o.paths) {
            arr[arr.length] = o.paths[path] + '.js';
        }
        return arr;
    };
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bowerRequirejs: {
            all: {
                rjsConfig: 'config.js',
                options: {
                    transitive: true,
                    'exclude-dev': true
                }
            }
        },
        bowerPaths: getBowerPaths(),
        watch: {
            scripts: {
                files: ['js/**/*.js'],
                tasks: [],
                options: {
                    spawn: false
                }
            },
            test: {
                files: ['js/**/*.js', 'tests/**/*Spec.js'],
                tasks: ['jasmine']
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
                    vendor: '<%= bowerPaths %>'
                }
            }
        },
        wiredep: {
            task: {
                src: [
                    'index.html',   // .html support...
                    'style.scss'  // .scss & .sass support...
                ],
                options: {}
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower-requirejs');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-wiredep');

    grunt.registerTask('demo', ['bowerRequirejs', 'wiredep', 'watch']);

};