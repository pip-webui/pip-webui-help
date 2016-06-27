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
    '         ng-if="manager !== false">\n' +
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
    angular.module('pipHelp.Page', ['pipState', 'pipHelp.Service', 'pipAppBar', 'pipSelected', 'pipTranslate',
        'pipHelp.Templates'])
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

    /**
     * @ngdoc controller
     * @name pipHelp.Page.pipHelpPageController
     *
     * @description
     * The controller is used for the root Help component.
     * It manages available pages provide navigation through those ones.
     *
     * @param {Object} $rootScope   Root scope object
     * @param {Object} $scope       Scope for the current controller
     * @param {Object} $state       UI Router service
     * @param {Object} pipAppBar    Service provides an interface to manage on application bar header.
     * @param {Object} pipHelp      Service to manage this component behaviour
     */
    function HelpPageController($rootScope, $scope, $state, pipAppBar, pipHelp) {

        $scope.pages = _.filter(pipHelp.getPages(), function (page) {
            if (page.visible && (page.access !== angular.noop ? page.access($rootScope.$user, page) : true)) {
                return page;
            }
        });
        $scope.selected = {};
        if ($state.current.name !== 'help') {
            initSelect($state.current.name);
        } else {
            initSelect(pipHelp.getDefaultPage().state);
        }
        appHeader();

        $scope.onNavigationSelect = onNavigationSelect;
        $scope.onDropdownSelect = onDropdownSelect;

        /**
         * @ngdoc method
         * @name pipHelp.Page.pipHelpPageController#onDropdownSelect
         * @methodOf pipHelp.Page.pipHelpPageController
         *
         * @description
         * It redirects to a passed state.
         *
         * @param {Object} state    State configuration object
         */
        function onDropdownSelect(state) {
            onNavigationSelect(state.state);
        }

        /**
         * Config appBar due to this page
         */
        function appHeader() {
            pipAppBar.showMenuNavIcon();
            pipAppBar.showTitleText('Help');
            pipAppBar.showShadowSm();
            pipAppBar.showLocalActions(null, []);
        }

        /**
         * @ngdoc method
         * @name pipHelp.Page.pipHelpPageController#onNavigationSelect
         * @methodOf pipHelp.Page.pipHelpPageController
         *
         * @description
         * It redirects to a passed state.
         *
         * @param {string} state    Name of the target state.
         */
        function onNavigationSelect(state) {
            initSelect(state);

            if ($scope.selected.page) {
                $state.go(state);
            }
        }

        /**
         * Set selected item for highlighting in the nav menu
         */
        function initSelect(state) {
            $scope.selected.page = _.find($scope.pages, function (page) {
                return page.state === state;
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

    /**
     * @ngdoc service
     * @name pipHelp.Service.pipHelp
     *
     * @description
     * This service is provided an interface to manage the Help component.
     * It is available on the config and run application phases. On the both phases the interface is the same.
     * This module requires the 'pipState' module.
     *
     * @requires pipState
     */
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
                    };
                };

                /**
                 * This method build the full name of state within the abstract 'help' state
                 */
                function getFullStateName(state) {
                    return 'help.' + state;
                }

                /**
                 * @ngdoc method
                 * @name pipHelp.Service.pipHelp#getPages
                 * @methodOf pipHelp.Service.pipHelp
                 *
                 * @description
                 * This method returns asset of all pages registered in the Help component.
                 *
                 * @returns {Array<Object>} List of registered states
                 *
                 * @example
                 * <pre>
                 * // on the config phase
                 * pipHelpProvider.getPages();
                 * </pre>
                 */
                function getPages() {
                    return _.clone(pages, true);
                }

                /**
                 * @ngdoc method
                 * @name pipHelp.Service.pipHelp#getDefaultPage
                 * @methodOf pipHelp.Service.pipHelp
                 *
                 * @description
                 * This method return name of the default state.
                 *
                 * @returns {string} Name of the state
                 *
                 * @example
                 * <pre>
                 * // on the config phase
                 * pipHelpProvider.getDefaultPage();
                 * </pre>
                 */
                function getDefaultPage() {
                    return _.clone(_.find(pages, function (page) {
                        return page.state === defaultPage;
                    }), true);
                }

                /**
                 * @ngdoc method
                 * @name pipHelp.Service.pipHelp#addPage
                 * @methodOf pipHelp.Service.pipHelp
                 *
                 * @description
                 * This method allows add new page into navigation menu. It accepts config object to define new state
                 * with needed params.
                 *
                 * @param {Object} pageObj Configuration object contains settings for another page
                 * @param {Object.<string>} pageObj.state   Name of page state which is available via UI router
                 * @param {Object.<string>} pageObj.title   Page title in the navigation menu.
                 * @param {Object.<boolean>} pageObj.access If it is true it will be available only for logged in users
                 * @param {Object.<boolean>} pageObj.visible If it is true the page will be visible
                 * @param {Object.<Object>} pageObj.stateConfig  Configuration object in format like UI Router state
                 *
                 * @example
                 * <pre>
                 *  // on the config phase
                 *  pipHelpProvider.addPage({
                 *      state: 'test',
                 *      title: 'Test help page',
                 *      auth: true,
                 *      stateConfig: {
                 *          url: '/test',
                 *          templateUrl: 'help/help_test1.html'
                 *      }
                 *  });
                 * </pre>
                 */
                function addPage(pageObj) {
                    var page;

                    validatePage(pageObj);

                    page = _.find(pages, function (page) {
                        return page.state === getFullStateName(pageObj.state);
                    });
                    if (page) {
                        throw new Error('Page with state name "' + pageObj.state + '" is already registered');
                    }

                    pages.push({
                        state: getFullStateName(pageObj.state),
                        title: pageObj.title,
                        access: pageObj.access || angular.noop,
                        visible: pageObj.visible || true,
                        stateConfig: _.clone(pageObj.stateConfig, true)
                    });

                    pipAuthStateProvider.state(getFullStateName(pageObj.state), pageObj.stateConfig);

                    // if we just added first state and no default state is specified
                    if (_.isUndefined(defaultPage) && pages.length === 1) {
                        setDefaultPage(pageObj.state);
                    }
                }

                /**
                 * @ngdoc method
                 * @name pipHelp.Service.pipHelp#setDefaultPage
                 * @methodOf pipHelp.Service.pipHelp
                 *
                 * @description
                 * This method establishes passed state as default which is redirected at after transfer on abstract
                 * state
                 *
                 * @param {Object} name     Name of the state
                 *
                 * @example
                 * <pre>
                 * pipHelpProvider.setDefaultPage('test');
                 * </pre>
                 */
                function setDefaultPage(name) {
                    var page, error;

                    page = _.find(pages, function (page) {
                        return page.state === getFullStateName(name);
                    });
                    if (!page) {
                        error = new Error('Page with state name "' + name + '" is not registered');
                        throw error;
                    }

                    defaultPage = getFullStateName(name);

                    pipAuthStateProvider.redirect('help', getFullStateName(name));
                }

                /**
                 * This method validates passed state.
                 * If it is incorrect it will throw an error.
                 */
                function validatePage(pageObj) {
                    if (!pageObj || !_.isObject(pageObj)) {
                        throw new Error('Invalid object');
                    }

                    if (!pageObj.state || pageObj.state === '') {
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
