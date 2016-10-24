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
    '                 pip-selected="selected.tabIndex"\n' +
    '                 pip-selected-watch="selected.navId"\n' +
    '                 pip-select="onNavigationSelect($event.id)">\n' +
    '            <md-list-item class="pip-simple-list-item pip-selectable"\n' +
    '                          ng-repeat="tab in tabs track by tab.state"\n' +
    '                          md-ink-ripple\n' +
    '                          pip-id="{{::tab.state }}">\n' +
    '                <p> {{::tab.title | translate}} </p>\n' +
    '            </md-list-item>\n' +
    '        </md-list>\n' +
    '\n' +
    '        <div class="pip-content-container">\n' +
    '            <pip-dropdown class="hide-gt-xs"\n' +
    '                          pip-actions="tabs"\n' +
    '                          pip-dropdown-select="onDropdownSelect"\n' +
    '                          pip-active-index="selected.tabIndex"></pip-dropdown>\n' +
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

/**
 * @file Page template for help components
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';

    config.$inject = ['$stateProvider'];
    HelpPageController.$inject = ['$rootScope', '$scope', '$state', 'pipAppBar', 'pipHelp'];
    angular.module('pipHelp.Page', ['ui.router', 'pipHelp.Service', 'pipAppBar', 'pipSelected', 'pipTranslate',
        'pipHelp.Templates'])
        .config(config)
        .controller('pipHelpPageController', HelpPageController);

    function config($stateProvider) {
        $stateProvider.state('help', {
            url: '/help',
            auth: false,
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
     * It manages available tabs provide navigation through those ones.
     *
     * {@link https://github.com/pip-webui/pip-webui-help/blob/master/src/help_page/help_page.js#L40 View source}
     *
     *
     * @param {Object} $rootScope   Root scope object
     * @param {Object} $scope       Scope for the current controller
     * @param {Object} $state       UI Router service
     * @param {Object} pipAppBar    Service provides an interface to manage on application bar header.
     * @param {Object} pipHelp      Service to manage this component behaviour
     */
    function HelpPageController($rootScope, $scope, $state, pipAppBar, pipHelp) {

        $scope.tabs = _.filter(pipHelp.getTabs(), function (tab) {
            if (tab.visible && (tab.access !== angular.noop ? tab.access($rootScope.$user, tab) : true)) {
                return tab;
            }
        });
        $scope.selected = {};

        if ($state.current.name !== 'help') {
            initSelect($state.current.name);
        } else {
            initSelect(pipHelp.getDefaultTab().state);
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
         * {@link https://github.com/pip-webui/pip-webui-help/blob/master/src/help_page/help_page.js#L72 View source}
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
         * {@link https://github.com/pip-webui/pip-webui-help/blob/master/src/help_page/help_page.js#L98 View source}
         *
         * @param {string} state    Name of the target state.
         */
        function onNavigationSelect(state) {
            initSelect(state);

            if ($scope.selected.tab) {
                $state.go(state);
            }
        }

        /**
         * Set selected item for highlighting in the nav menu
         */
        function initSelect(state) {
            $scope.selected.tab = _.find($scope.tabs, function (tab) {
                return tab.state === state;
            });

            $scope.selected.tabIndex = _.indexOf($scope.tabs, $scope.selected.tab);
            $scope.selected.tabId = state;
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
     * This module requires the '$state' module.
     */
    angular.module('pipHelp.Service', ['ui.router'])
        .provider('pipHelp',
            ['$stateProvider', function ($stateProvider) {
                var defaultTab,
                    tabs = [];

                /** @see addTab */
                this.addTab = addTab;

                /** @see setDefaultTab */
                this.setDefaultTab = setDefaultTab;

                /** @see getTabs */
                this.getTabs = getTabs;

                /** @see getDefaultTab */
                this.getDefaultTab = getDefaultTab;

                this.$get = function () {
                    return {
                        /** @see getTabs */
                        getTabs: getTabs,

                        /** @see getDefaultTab */
                        getDefaultTab: getDefaultTab,

                        /** @see addTab */
                        addTab: addTab,

                        /** @see setDefaultTab */
                        setDefaultTab: setDefaultTab
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
                 * @name pipHelp.Service.pipHelp#getTabs
                 * @methodOf pipHelp.Service.pipHelp
                 *
                 * @description
                 * This method returns asset of all tabs registered in the Help component.
                 *
                 * {@link https://github.com/pip-webui/pip-webui-help/blob/master/src/help_service/help_service.js#L79 View source}
                 *
                 * @returns {Array<Object>} List of registered states
                 *
                 * @example
                 * <pre>
                 * // on the config phase
                 * pipHelpProvider.getTabs();
                 * </pre>
                 */
                function getTabs() {
                    return _.clone(tabs, true);
                }

                /**
                 * @ngdoc method
                 * @name pipHelp.Service.pipHelp#getDefaultTab
                 * @methodOf pipHelp.Service.pipHelp
                 *
                 * @description
                 * This method return name of the default state.
                 *
                 * {@link https://github.com/pip-webui/pip-webui-help/blob/master/src/help_service/help_service.js#L101 View source}
                 *
                 * @returns {string} Name of the state
                 *
                 * @example
                 * <pre>
                 * // on the config phase
                 * pipHelpProvider.getDefaultTab();
                 * </pre>
                 */
                function getDefaultTab() {
                    return _.clone(_.find(tabs, function (tab) {
                        return tab.state === defaultTab;
                    }), true);
                }

                /**
                 * @ngdoc method
                 * @name pipHelp.Service.pipHelp#addTab
                 * @methodOf pipHelp.Service.pipHelp
                 *
                 * @description
                 * This method allows add new tab into navigation menu. It accepts config object to define new state
                 * with needed params.
                 *
                 * {@link https://github.com/pip-webui/pip-webui-help/blob/master/src/help_service/help_service.js#L139 View source}
                 *
                 * @param {Object} tabObj Configuration object contains settings for another tab
                 * @param {Object.<string>} tabObj.state   Name of tab state which is available via UI router
                 * @param {Object.<string>} tabObj.title   Tab title in the navigation menu.
                 * @param {Object.<boolean>} tabObj.access If it is true it will be available only for logged in users
                 * @param {Object.<boolean>} tabObj.visible If it is true the tab will be visible
                 * @param {Object.<Object>} tabObj.stateConfig  Configuration object in format like UI Router state
                 *
                 * @example
                 * <pre>
                 *  // on the config phase
                 *  pipHelpProvider.addTab({
                 *      state: 'test',
                 *      title: 'Test help tab',
                 *      auth: true,
                 *      stateConfig: {
                 *          url: '/test',
                 *          templateUrl: 'help/help_test1.html'
                 *      }
                 *  });
                 * </pre>
                 */
                function addTab(tabObj) {
                    var tab;

                    validateTab(tabObj);

                    tab = _.find(tabs, function (tab) {
                        return tab.state === getFullStateName(tabObj.state);
                    });
                    if (tab) {
                        throw new Error('Tab with state name "' + tabObj.state + '" is already registered');
                    }

                    tabs.push({
                        state: getFullStateName(tabObj.state),
                        title: tabObj.title,
                        access: tabObj.access || angular.noop,
                        visible: tabObj.visible || true,
                        stateConfig: _.clone(tabObj.stateConfig, true)
                    });

                    $stateProvider.state(getFullStateName(tabObj.state), tabObj.stateConfig);

                    // if we just added first state and no default state is specified
                    if (_.isUndefined(defaultTab) && tabs.length === 1) {
                        setDefaultTab(tabObj.state);
                    }
                }

                /**
                 * @ngdoc method
                 * @name pipHelp.Service.pipHelp#setDefaultTab
                 * @methodOf pipHelp.Service.pipHelp
                 *
                 * @description
                 * This method establishes passed state as default which is redirected at after transfer on abstract
                 * state
                 *
                 * {@link https://github.com/pip-webui/pip-webui-help/blob/master/src/help_service/help_service.js#L185 View source}
                 *
                 * @param {Object} name     Name of the state
                 *
                 * @example
                 * <pre>
                 * pipHelpProvider.setDefaultTab('test');
                 * </pre>
                 */
                function setDefaultTab(name) {
                    var tab, error;

                    tab = _.find(tabs, function (tab) {
                        return tab.state === getFullStateName(name);
                    });
                    if (!tab) {
                        error = new Error('Tab with state name "' + name + '" is not registered');
                        throw error;
                    }

                    defaultTab = getFullStateName(name);

                    $stateProvider.redirect('help', getFullStateName(name));
                }

                /**
                 * This method validates passed state.
                 * If it is incorrect it will throw an error.
                 */
                function validateTab(tabObj) {
                    if (!tabObj || !_.isObject(tabObj)) {
                        throw new Error('Invalid object');
                    }

                    if (!tabObj.state || tabObj.state === '') {
                        throw new Error('Tab should have valid Angular UI router state name');
                    }

                    if (tabObj.access && !_.isFunction(tabObj.access)) {
                        throw new Error('"access" should be a function');
                    }

                    if (!tabObj.stateConfig || !_.isObject(tabObj.stateConfig)) {
                        throw new Error('Invalid state configuration object');
                    }
                }
            }]);

})(window.angular, window._);

//# sourceMappingURL=pip-webui-help.js.map
