var _ = require('lodash');

module.exports = function (grunt) {

    "use strict";

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        lego: [], // to be filled by build
        dist: 'dist',
        meta: {
            legoTplModules: 'angular.module("lf.tpls", [<%= legoTplModules %>]);',
            all: 'angular.module("LegoForm", ["lf.tpls", <%= modules %>]);',
            banner: [
                '/*',
                ' * <%= pkg.name %>',
                ' * <%= pkg.homepage %>',
                ' *',
                ' * Version: <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>',
                ' * License: <%= pkg.license %>',
                ' */'
            ].join('\n')
        },

        html2js: {
            dist: {
                options: {
                    module: null, // no bundle module for all the html2js templates
                    base: '.',
                    rename: function (moduleName) {
                        var fileName = _.last(moduleName.split('/'));
                        return `lf/${fileName}`;
                    }
                },
                files: [{
                    expand: true,
                    src: ['src/lego/*/*.html'],
                    ext: '.html.js'
                }]
            }
        },
        concat: {
            options: {
                banner: '<%= meta.banner %>\n<%= meta.all %>\n<%= meta.legoTplModules %>\n'
            },
            dist: {
                src: [],
                dest: '<%= dist %>/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    src: ['dist/*.js'],
                    dest: 'examples/passenger/public/',
                    flatten: true,
                    filter: 'isFile'
                }]
            }
        },
        clean: {
            js: ['src/lego/**/*.html.js']
        }
        
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-html2js');

    grunt.registerTask('default', ['html2js', 'build', 'concat', 'copy', 'clean']);

    grunt.registerTask('build', 'Build LegoForm module.', function () {

        var srcFiles = [], lego, modules = [], tplJsFiles = [];

        // Process
        grunt.file.expand('src/services/*.js').forEach(function (dir) {
            srcFiles.push(dir);
            modules.push(`"lf.service.${dir.split('/')[2].replace('Service.js', '')}"`);
        });

        grunt.file.expand({filter: 'isDirectory', cwd: '.'}, ['src/lego/*']).forEach(function (dir) {
            findLegoInfo(dir.split('/')[2]);
        });

        lego = grunt.config('lego');
        modules = modules.concat(_.map(lego, 'moduleName'));

        grunt.config('modules', modules);
        grunt.config('legoTplModules', _.flatten(_.map(lego, 'tplModuleName')));

        srcFiles = srcFiles.concat(_.flatten(_.map(lego, 'srcFiles')));
        tplJsFiles = tplJsFiles.concat(_.flatten(_.map(lego, 'tplJsFiles')));

        grunt.config('concat.dist.src', grunt.config('concat.dist.src').concat(srcFiles).concat(tplJsFiles));
    });

    var foundLego = {};

    function findLegoInfo(name) {
        if (foundLego[name]) {
            return false;
        }
        foundLego[name] = true;

        function enQuote(str) {
            return `"${str}"`;
        }

        function enQuoteWithLf(str) {
            var fileName = _.last(str.split('/'));
            return `"lf/${fileName}"`;
        }


        var legoInfo = {
            name: name,
            moduleName: enQuote(`lf.lego.${name}`),
            tplModuleName: grunt.file.expand(`src/lego/${name}/*.html`).map(enQuoteWithLf),
            srcFiles: grunt.file.expand([`src/lego/${name}/*.js`, `!src/lego/${name}/*.html.js`]),
            tplFiles: grunt.file.expand([`src/lego/${name}/*.html`]),
            tplJsFiles: grunt.file.expand([`src/lego/${name}/*.html.js`])
        };

        grunt.config('lego', grunt.config('lego').concat(legoInfo));
    }
};