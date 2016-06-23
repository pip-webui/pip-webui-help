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
                templateUrl: 'help/help_test.html'
            }
        });

        pipHelpProvider.addPage({
            state: 'test2',
            title: 'Test2 help page',
            auth: true,
            visible: true,
            stateConfig: {
                url: '/test2',
                template: '<h1>Test page 2</h1>\n<h2>Code to add this page</h2>\n\n<pre>\n     pipHelpProvider.addPage({\n            state: \'test2\',\n            title: \'Test2 help page\',\n            auth: true,\n            visible: true,\n            stateConfig: {\n                url: \'/test2\',\n                template: \'&lt;h1>Tets page 2&lt;/h1>\'\n            }\n        });\n</pre>'
            }
        });

        pipHelpProvider.setDefaultPage('test');
    });

})(window.angular);
