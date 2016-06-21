/**
 * @file Registration of all help components
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
    'use strict';

    angular.module('pipHelp', [
        'pipHelp.Service',
        'pipHelp.Page'
    ]);
    
})(window.angular);
(function(module) {
try {
  module = angular.module('pipHelp.Templates');
} catch (e) {
  module = angular.module('pipHelp.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('help_page/help_page.html',
    '<!--\n' +
    '@file Help page\n' +
    '@copyright Digital Living Software Corp. 2014-2016\n' +
    '-->\n' +
    '\n' +
    '<md-toolbar class="pip-appbar-ext"></md-toolbar>\n' +
    '\n' +
    '<pip-document width="800" min-height="400">\n' +
    '    <div class="pip-menu-container pip-help"\n' +
    '            ng-if="!manager || manager === true">\n' +
    '        <md-list class="pip-menu pip-simple-list hide-xs"\n' +
    '                 pip-selected="selected.pageIndex"\n' +
    '                 pip-selected-watch="selected.navId"\n' +
    '                 pip-select="onNavigationSelect($event.id)">\n' +
    '            <md-list-item class="pip-simple-list-item pip-selectable"\n' +
    '                          ng-repeat="page in pages track by page.state"\n' +
    '                          md-ink-ripple\n' +
    '                          pip-id="{{::page.state }}">\n' +
    '                <p> {{::page.title | translate}} </p>\n' +
    '            </md-list-item>\n' +
    '        </md-list>\n' +
    '\n' +
    '        <div class="pip-content-container">\n' +
    '            <pip-dropdown class="hide-gt-xs"\n' +
    '                          pip-actions="pages"\n' +
    '                          pip-dropdown-select="onDropdownSelect"\n' +
    '                          pip-active-index="selected.pageIndex"></pip-dropdown>\n' +
    '            <div class="pip-body layout-column flex" ui-view></div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="layout-column layout-align-center-center flex"\n' +
    '         ng-if="manager === false">\n' +
    '        {{::\'ERROR_400\' | translate}}\n' +
    '    </div>\n' +
    '</pip-document>');
}]);
})();

/**
 * @file Page template for help components
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';

    config.$inject = ['pipStateProvider'];
    HelpPageController.$inject = ['$rootScope', '$scope', '$state', 'pipAppBar', 'pipHelp'];
    angular.module('pipHelp.Page', ['pipState', 'pipHelp.Service', 'pipAppBar', 'pipSelected', 'pipTranslate', 'pipHelp.Templates'])
        .config(config)
        .controller('pipHelpPageController', HelpPageController);

    function config(pipStateProvider) {
        pipStateProvider.state('help', {
            url: '/help',
            auth: true,
            controller: 'pipHelpPageController',
            templateUrl: 'help_page/help_page.html'
        });
    }

    function HelpPageController($rootScope, $scope, $state, pipAppBar, pipHelp) {

        $scope.pages = _.filter(pipHelp.getPages(), function (page) {

            if (page.visible && (page.access ? page.access($rootScope.$user, page) : true)) {
                return page;
            }
        });
        $scope.selected = {};

        if ($state.current.name != 'help')
            initSelect($state.current.name);
        else
            initSelect(pipHelp.getDefaultPage().state);
        appHeader();

        $scope.onNavigationSelect = onNavigationSelect;
        $scope.onDropdownSelect = onDropdownSelect;

        return;

        function onDropdownSelect(state) {
            onNavigationSelect(state.state);
        }

        function appHeader() {
            pipAppBar.showMenuNavIcon();
            pipAppBar.showTitleText('Help');
            pipAppBar.showShadowSm();
            pipAppBar.showLocalActions(null, []);
        }

        function onNavigationSelect(state) {
            initSelect(state);

            if ($scope.selected.page) {
                $state.go(state);
            }
        }

        function initSelect(state) {
            $scope.selected.page = _.find($scope.pages, function (page) {
                return page.state == state;
            });
            $scope.selected.pageIndex = _.indexOf($scope.pages, $scope.selected.page);
            $scope.selected.pageId = state;
        }
    }
})(window.angular, window._);
/**
 * @file Service for help components
 * @copyright Digital Living Software Corp. 2014-2016
 */


(function (angular, _) {
    'use strict';

    angular.module('pipHelp.Service', ['pipState'])
        .provider('pipHelp',
        ['pipAuthStateProvider', function (pipAuthStateProvider) {
            var defaultPage,
                pages = [];

            /** @see addPage */
            this.addPage = addPage;

            /** @see setDefaultPage */
            this.setDefaultPage = setDefaultPage;

            /** @see getPages */
            this.getPages = getPages;

            /** @see getDefaultPage */
            this.getDefaultPage = getDefaultPage;

            this.$get = function () {
                return {
                    /** @see getPages */
                    getPages: getPages,

                    /** @see getDefaultPage */
                    getDefaultPage: getDefaultPage,

                    /** @see addPage */
                    addPage: addPage,

                    /** @see setDefaultPage */
                    setDefaultPage: setDefaultPage
                }
            };

            function getFullStateName(state) {
                return 'help.' + state;
            }

            function getPages() {
                return _.clone(pages, true);
            }

            function getDefaultPage() {
                return _.clone(_.find(pages, function (page) {
                    return page.state === defaultPage;
                }), true);
            }

            function addPage(pageObj) {
                validatePage(pageObj);

                if (_.find(pages, function (page) {
                        return page.state === getFullStateName(pageObj.state);
                    })) {
                    throw new Error('Page with state name "' + pageObj.state + '" is already registered');
                }

                pages.push({
                    state: getFullStateName(pageObj.state),
                    title: pageObj.title,
                    access: pageObj.access,
                    visible: pageObj.visible !== false,
                    stateConfig: _.clone(pageObj.stateConfig, true)
                });

                pipAuthStateProvider.state(getFullStateName(pageObj.state), pageObj.stateConfig);

                // if we just added first state and no default state is specified
                if (_.isUndefined(defaultPage) && pages.length === 1) {
                    setDefaultPage(pageObj.state);
                }
            }

            function setDefaultPage(name) {
                if (!_.find(pages, function (page) {
                        return page.state === getFullStateName(name);
                    })) {
                    throw new Error('Page with state name "' + name + '" is not registered');
                }

                defaultPage = getFullStateName(name);

                pipAuthStateProvider.redirect('help', getFullStateName(name));
            }

            function validatePage(pageObj) {
                if (!pageObj || !_.isObject(pageObj)) {
                    throw new Error('Invalid object');
                }

                if (pageObj.state == null || pageObj.state == '') {
                    throw new Error('Page should have valid Angular UI router state name');
                }

                if (pageObj.access && !_.isFunction(pageObj.access)) {
                    throw new Error('"access" should be a function');
                }

                if (!pageObj.stateConfig || !_.isObject(pageObj.stateConfig)) {
                    throw new Error('Invalid state configuration object');
                }
            }
        }]);


})(window.angular, window._);
//# sourceMappingURL=pip-webui-help.js.map
