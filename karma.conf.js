// Karma configuration
// Generated on Tue Aug 25 2015 20:04:51 GMT-0700 (US Mountain Standard Time)

module.exports = function (config) {
    'use strict';

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: 'src',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai', 'sinon'],

        // l§ of files / patterns to load in the browser
        files: [
            '../node_modules/pip-webui-lib/dist/pip-webui-lib.js',
            '../node_modules/pip-webui-core/dist/pip-webui-core.js',
            '../node_modules/pip-webui-rest/dist/pip-webui-rest.js',
            '../node_modules/pip-webui-controls/dist/pip-webui-controls.js',
            '../node_modules/pip-webui-nav/dist/pip-webui-nav.js',
            '../node_modules/pip-webui-test/dist/pip-webui-test.js',
            '../node_modules/angular-mocks/angular-mocks.js',
            '../temp/pip-webui-help-html.js',
            '../node_modules/pip-webui-lib/dist/pip-webui-lib-test.js',
            '**/*.js',
            { pattern: '**/*.html', included: false },
            '../test/**/*.js'
        ],
        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            '**/*.js': ['coverage']
        },

        // optionally, configure the reporter
        coverageReporter: {
            reporters: [
                { type: 'html', dir: '../coverage' },
                { type: 'text-summary' }
            ]
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],

        // list of used plugins
        plugins: [
            'karma-mocha',
            'karma-istanbul-reporter',
            'karma-coverage',
            'karma-chai',
            'karma-sinon',
            'karma-phantomjs-launcher'
        ],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values:
        // config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
