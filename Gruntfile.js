module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                stripBanners: true,
                banner: [
                    '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */',
                    '/*! <%= pkg.author %> */',
                    '\'use strict\';',
                    '\n\n',
                ].join('\n'),
                process: function(src, filepath) {
                    return '// Source: ' + filepath + '\n' +
                        src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                }
            },
            dist: {
                files: {
                    'dist/library.dependencies.js': [
                        'dependencies/jquery.json.js',
                        'dependencies/jquery.base64.js',
                        'dependencies/jquery.cookie.js',
                        'dependencies/moment.js',
                        'dependencies/moment-with-locales.js',
                        'dependencies/md5.js',
                    ],
                    'dist/library.js': [
                        'src/library.polyfill.js',
                        'src/library.common.js',
                        'src/library.network.js',
                        'src/library.form.js',
                        'src/library.storage.js',
                        'src/library.chain.js',
                        'src/library.asyncqueue.js',
                        'src/library.data.js',
                        'src/library.uuid.js',
                        'src/library.hashcode.js',
                        'src/library.assert.js',
                    ]
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/library.min.js': ['dist/library.js'],
                    'dist/library.dependencies.min.js': ['dist/library.js']
                }
            }
        },
        copy: {
            test: {
                files: [
                    {expand: true, src: ['dist/*'], dest: 'server/public/', filter: 'isFile'},
                ]
            }
        },

        jshint: {
            options: {
                browser: true,
                devel: true
            },
            all: [
                // 'src/library.polyfill.js',
                'src/library.common.js',
                'src/library.network.js',
                'src/library.form.js',
                'src/library.storage.js',
                'src/library.chain.js',
                'src/library.asyncqueue.js',
                'src/library.data.js',
                'src/library.uuid.js',
                'src/library.hashcode.js',
                // 'src/library.assert.js',
            ]
        }

    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', ['concat:dist', 'uglify:dist', 'copy:test']);
    grunt.registerTask('jshintc', ['jshint']);
};