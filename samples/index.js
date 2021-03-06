/**
 * @file Sample application to provide end-to-end example of WebUI
 * @copyright Digital Living Software Corp. 2014-2016
 */

((angular) => {
    'use strict';

    var thisModule = angular.module('pipSample', [
        // 3rd Party Modules
        'ui.router', 'ui.utils', 'ngResource', 'ngAria', 'ngCookies', 'ngSanitize', 'ngMessages',
        'ngMaterial', 'wu.masonry', 'LocalStorageModule', 'ngAnimate', //  'angularFileUpload',
        // Application Configuration must go first
        'pipSampleConfig',
        // Modules from WebUI Framework
       'pipLayout', 'pipNav',
        // Sample Application Modules
         'pipHelp', 'pipHelpConfig'
    ]);

    thisModule.controller('pipSampleController',
        function ($scope, $rootScope) {
           // pipTheme.setCurrentTheme('blue');
            //pipAppBar.showLanguage();
        }
    );

})(window.angular);

