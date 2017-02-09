(function (angular) {
    'use strict';

    var thisModule = angular.module('pipHelpConfig', ['pipHelp']);

    thisModule.config(function (pipHelpProvider) {

/*
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
        });*/
        // Register custom help page
        pipHelpProvider.addTab({
            state: 'test',
            title: 'TEST_HELP_PAGE',
            stateConfig: {
                controller: function($timeout) {
                    $timeout(function() {
                        $('pre code').each(function(i, block) {
                            Prism.highlightElement(block);
                        });
                    });
                },
                url: '/test',
                auth: false,
                templateUrl: 'help/help_test.html'
            }
        });

        pipHelpProvider.addTab({
            state: 'test2',
            title: 'TEST_HELP_PAGE_2',
            visible: true,
            stateConfig: {
                controller: function($timeout) {
                    $timeout(function() {
                        $('pre code').each(function(i, block) {
                            Prism.highlightElement(block);
                        });
                    });
                },
                url: '/test2',
                auth: false,
                template: '<h2 class="text-title tm0 bm24">{{ \'SECOND_TEST_PAGE\' | translate }}</h2>\n' +
                '\n<pre class="color-window-bg p16">\n<h3 class="text-subhead2 m0">{{:: \'CODE_TO_ADD_PAGE\' | translate}}</h3>\n<code class="language-js">pipHelpProvider.addPage({\n    state: \'test2\',\n    title: {{\'TEST_HELP_PAGE_2\' | translate }},\n    visible: true,\n    stateConfig: {\n      url: \'/test2\',\n      template: \'&lt;h2>{{ \'SECOND_TEST_PAGE\' | translate }}&lt;/h2>\'\n    }\n});\n</code></pre>' // eslint-disable-line
            }
        });

        pipHelpProvider.setDefaultTab('test');
    });

})(window.angular);
