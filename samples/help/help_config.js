(function (angular) {
    'use strict';

    var thisModule = angular.module('pipHelpConfig', ['pipHelp']);

    thisModule.config(function (pipHelpProvider) {
        // Register custom help page
        pipHelpProvider.addPage({
            state: 'test',
            title: 'Test help page',
            auth: true,
            stateConfig: {
                url: '/test',
                templateUrl: 'help/help_test1.html'
            }
        });

        pipHelpProvider.addPage({
            state: 'test2',
            title: 'Test2 help page',
            auth: true,
            visible: true,
            stateConfig: {
                url: '/test2',
                template: '<h1>This is test2 page in help inserted through provider</h1>'
            }
        });

        pipHelpProvider.setDefaultPage('test');
    });

})(window.angular);
