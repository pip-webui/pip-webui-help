(function (angular) {
    'use strict';

    var thisModule = angular.module('pipHelpConfig', ['pipHelp']);

    thisModule.config(function (pipHelpProvider, pipTranslateProvider) {

        pipTranslateProvider.translations('en', {
            TEST_HELP_PAGE: 'Test help page',
            FIRST_TEST_PAGE: 'The first test page',
            SECOND_TEST_PAGE: 'The second test page',
            CODE_TO_ADD_PAGE: 'Code to add this page',
            TEST_HELP_PAGE_2: 'Test help page 2',
            TEMPLATE: 'template'
        });
        pipTranslateProvider.translations('ru', {
            TEST_HELP_PAGE: 'Тестовая страница help',
            FIRST_TEST_PAGE: 'Первая тестовая страница',
            SECOND_TEST_PAGE: 'Вторая тестовая страница',
            CODE_TO_ADD_PAGE: 'Код для добавления этой страницы',
            TEST_HELP_PAGE_2: 'Тестовая страница help 2',
            TEMPLATE: 'шаблон'
        });
        // Register custom help page
        pipHelpProvider.addPage({
            state: 'test',
            title: 'TEST_HELP_PAGE',
            auth: true,
            stateConfig: {
                url: '/test',
                templateUrl: 'help/help_test.html'
            }
        });

        pipHelpProvider.addPage({
            state: 'test2',
            title: 'TEST_HELP_PAGE_2',
            auth: true,
            visible: true,
            stateConfig: {
                url: '/test2',
                template: '<h2 class="text-title tm0 bm24">{{ \'SECOND_TEST_PAGE\' | translate }}</h2>\n' +
                '<h3 class="text-subhead2 tm0">{{ \'CODE_TO_ADD_PAGE\' | translate }}</h3>\n' +
                '\n<pre class="text-body1 color-window-bg p16">\n     <strong>pipHelpProvider.addPage</strong>({\n            state: \'test2\',\n            title: {{\'TEST_HELP_PAGE_2\' | translate }},\n            auth: true,\n            visible: true,\n            stateConfig: {\n                url: \'/test2\',\n                template: \'&lt;h2>{{ \'SECOND_TEST_PAGE\' | translate }}&lt;/h1>\'\n            }\n        });\n</pre>' // eslint-disable-line
            }
        });

        pipHelpProvider.setDefaultPage('test');
    });

})(window.angular);
