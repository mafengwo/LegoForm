/**
 * Created by mafengwo on 16/5/31.
 */
module.exports = function (config) {
    config.set({

        // base path used to resolve all patterns (e.g. files, exclude)
        basePath: '',

        // frameworks to use
        frameworks: ['mocha', 'chai', 'sinon'],

        // // list of files / patterns to load in the browser
        files: [
            'node_modules/underscore/underscore.js',
            'node_modules/angular/angular.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'src/**/*.js',
            'test/**/*.spec.js'
        ],

        // list of files to exclude
        exclude: []

        // preprocess matching files before serving them to the browser
        // preprocessors: {
        //     'src/*.js': ['coverage']
        // },
        //
        // coverageReporter: {
        //     type: 'text-summary',
        //     dir: 'coverage/'
        // }
    });
};