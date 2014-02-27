module.exports = function (grunt) {

    var src = ['src/**/*.js'],
        specs = ['specs/**/*.js'],
        lib = ['lib/jquery.js'],
        src_spec = src.concat(specs),
        src_lib = src.concat(lib);

    grunt.initConfig(
        {
            jasmine: {
                default: {
                    src: src_lib,
                    options: {
                        specs: specs,
                        junit: {
                            path: 'reports',
                            consolidate: true
                        },
                        keepRunner: true
                    }
                }
            },
            jslint: {
                default: {
                    src: src_spec,
                    exclude: [],
                    directives: {
                        sloppy: true,
                        browser: true,
                        predef: [
                            'console', 'describe', 'it', 'runs', 'waitsFor', 'xdescribe', 'xit', 'spyOn', 'jasmine', 'expect', 'beforeEach', 'afterEach'
                        ]
                    }
                }
            },
            watch: {
                js: {
                    files: src_spec,
                    tasks: ['jslint', 'jasmine']
                }
            },
            exec: {
                remove_docs: {
                    command: 'del README.md'
                },
                generate_docs: {
                    command: 'jsdox --output . src/eventPublisher.js',
                    stdout: true
                },
                rename_docs: {
                    command: 'rename eventPublisher.md README.md'
                }
            }
        }
    );

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('default', ['jslint', 'jasmine', 'exec']);
};