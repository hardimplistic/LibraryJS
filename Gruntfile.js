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
                        'dependencies/polyfill.promise.js',
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
                        'src/library.cache.js',
                        'src/library.hashcode.js',
                        'src/library.assert.js',
                    ]
                }
            },
            xjxy: {
                files: {
                    'xjxy/library.dependencies.js': [
                        'dependencies/jquery.js',
                        'dependencies/jquery.json.js',
                        'dependencies/jquery.base64.js',
                        'dependencies/jquery.cookie.js',
                        'dependencies/moment.js',
                        'dependencies/moment-with-locales.js',
                        'dependencies/md5.js',
                        'dependencies/polyfill.promise.js',
                    ],
                    'xjxy/library.js': [
                        'src/library.polyfill.js',
                        'src/library.common.js',
                        'src/library.network.js',
                        'src/library.form.js',
                        'src/library.storage.js',
                        'src/library.chain.js',
                        'src/library.asyncqueue.js',
                        'src/library.data.js',
                        'src/library.uuid.js',
                        'src/library.cache.js',
                        'src/library.hashcode.js',
                        'src/library.assert.js',
                        'src/library.mini.js',
                    ]
                }
            },
            datapage: {
                files: {
                    'datapage/dist/library.js': [
                        'src/library.polyfill.js',
                        'src/library.common.js',
                        'src/library.network.js',
                        'src/library.form.js',
                        'src/library.storage.js',
                        'src/library.chain.js',
                        'src/library.asyncqueue.js',
                        'src/library.data.js',
                        'src/library.uuid.js',
                        'src/library.cache.js',
                        'src/library.hashcode.js',
                        'src/library.assert.js',
                        'datapage/src/functions.js',
                    ]
                }
            },
            datepicker: {
                files: {
                    'datepicker/dist/bootstrap-datepicker.locales.all.js': [
                        'datepicker/src/bootstrap-datepicker.ar.js',
                        'datepicker/src/bootstrap-datepicker.az.js',
                        'datepicker/src/bootstrap-datepicker.bg.js',
                        'datepicker/src/bootstrap-datepicker.ca.js',
                        'datepicker/src/bootstrap-datepicker.cs.js',
                        'datepicker/src/bootstrap-datepicker.cy.js',
                        'datepicker/src/bootstrap-datepicker.da.js',
                        'datepicker/src/bootstrap-datepicker.de.js',
                        'datepicker/src/bootstrap-datepicker.el.js',
                        'datepicker/src/bootstrap-datepicker.es.js',
                        'datepicker/src/bootstrap-datepicker.et.js',
                        'datepicker/src/bootstrap-datepicker.fa.js',
                        'datepicker/src/bootstrap-datepicker.fi.js',
                        'datepicker/src/bootstrap-datepicker.fr.js',
                        'datepicker/src/bootstrap-datepicker.gl.js',
                        'datepicker/src/bootstrap-datepicker.he.js',
                        'datepicker/src/bootstrap-datepicker.hr.js',
                        'datepicker/src/bootstrap-datepicker.hu.js',
                        'datepicker/src/bootstrap-datepicker.id.js',
                        'datepicker/src/bootstrap-datepicker.is.js',
                        'datepicker/src/bootstrap-datepicker.it.js',
                        'datepicker/src/bootstrap-datepicker.ja.js',
                        'datepicker/src/bootstrap-datepicker.ka.js',
                        'datepicker/src/bootstrap-datepicker.kk.js',
                        'datepicker/src/bootstrap-datepicker.kr.js',
                        'datepicker/src/bootstrap-datepicker.lt.js',
                        'datepicker/src/bootstrap-datepicker.lv.js',
                        'datepicker/src/bootstrap-datepicker.mk.js',
                        'datepicker/src/bootstrap-datepicker.ms.js',
                        'datepicker/src/bootstrap-datepicker.nb.js',
                        'datepicker/src/bootstrap-datepicker.nl-BE.js',
                        'datepicker/src/bootstrap-datepicker.nl.js',
                        'datepicker/src/bootstrap-datepicker.no.js',
                        'datepicker/src/bootstrap-datepicker.pl.js',
                        'datepicker/src/bootstrap-datepicker.pt-BR.js',
                        'datepicker/src/bootstrap-datepicker.pt.js',
                        'datepicker/src/bootstrap-datepicker.ro.js',
                        'datepicker/src/bootstrap-datepicker.rs-latin.js',
                        'datepicker/src/bootstrap-datepicker.rs.js',
                        'datepicker/src/bootstrap-datepicker.ru.js',
                        'datepicker/src/bootstrap-datepicker.sk.js',
                        'datepicker/src/bootstrap-datepicker.sl.js',
                        'datepicker/src/bootstrap-datepicker.sq.js',
                        'datepicker/src/bootstrap-datepicker.sv.js',
                        'datepicker/src/bootstrap-datepicker.sw.js',
                        'datepicker/src/bootstrap-datepicker.th.js',
                        'datepicker/src/bootstrap-datepicker.tr.js',
                        'datepicker/src/bootstrap-datepicker.ua.js',
                        'datepicker/src/bootstrap-datepicker.vi.js',
                        'datepicker/src/bootstrap-datepicker.zh-CN.js',
                        'datepicker/src/bootstrap-datepicker.zh-TW.js',
                    ]
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/library.min.js': ['dist/library.js'],
                    'dist/library.dependencies.min.js': ['dist/library.dependencies.js']
                }
            },
            xjxy: {
                files: {
                    'xjxy/library.min.js': ['xjxy/library.js'],
                    'xjxy/library.dependencies.min.js': ['xjxy/library.dependencies.js']
                }
            },
            datapage: {
                files: {
                    'datapage/dist/library.min.js': ['datapage/dist/library.js']
                }
            },
            datepicker: {
                files: {
                    'datepicker/dist/bootstrap-datepicker.locales.all.min.js': ['datepicker/dist/bootstrap-datepicker.locales.all.js']
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
    grunt.registerTask('xjxy', ['concat:xjxy', 'uglify:xjxy']);
    grunt.registerTask('datapage', ['concat:datapage', 'uglify:datapage']);
    grunt.registerTask('datepicker', ['concat:datepicker', 'uglify:datepicker']);
    grunt.registerTask('jshintc', ['jshint']);
};