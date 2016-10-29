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



(function () {
    'use strict';
    angular.module('pipHelp', [
        'pipHelp.Service',
        'pipHelp.Page'
    ]);
})();

(function () {
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
    function HelpPageController($rootScope, $scope, $state, pipAppBar, pipHelp) {
        $scope.tabs = _.filter(pipHelp.getTabs(), function (tab) {
            if (tab.visible && (tab.access !== angular.noop ? tab.access($rootScope.$user, tab) : true)) {
                return tab;
            }
        });
        $scope.selected = {};
        if ($state.current.name !== 'help') {
            initSelect($state.current.name);
        }
        else {
            initSelect(pipHelp.getDefaultTab().state);
        }
        appHeader();
        $scope.onNavigationSelect = onNavigationSelect;
        $scope.onDropdownSelect = onDropdownSelect;
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
            if ($scope.selected.tab) {
                $state.go(state);
            }
        }
        function initSelect(state) {
            $scope.selected.tab = _.find($scope.tabs, function (tab) {
                return tab.state === state;
            });
            $scope.selected.tabIndex = _.indexOf($scope.tabs, $scope.selected.tab);
            $scope.selected.tabId = state;
        }
    }
})();

(function () {
    'use strict';
    angular.module('pipHelp.Service', ['ui.router'])
        .provider('pipHelp', ['$stateProvider', function ($stateProvider) {
        var defaultTab, tabs = [];
        this.addTab = addTab;
        this.setDefaultTab = setDefaultTab;
        this.getTabs = getTabs;
        this.getDefaultTab = getDefaultTab;
        this.$get = function () {
            return {
                getTabs: getTabs,
                getDefaultTab: getDefaultTab,
                addTab: addTab,
                setDefaultTab: setDefaultTab
            };
        };
        function getFullStateName(state) {
            return 'help.' + state;
        }
        function getTabs() {
            return _.cloneDeep(tabs);
        }
        function getDefaultTab() {
            return _.cloneDeep(_.find(tabs, function (tab) {
                return tab.state === defaultTab;
            }));
        }
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
                stateConfig: _.cloneDeep(tabObj.stateConfig)
            });
            $stateProvider.state(getFullStateName(tabObj.state), tabObj.stateConfig);
            if (_.isUndefined(defaultTab) && tabs.length === 1) {
                setDefaultTab(tabObj.state);
            }
        }
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
})();



//# sourceMappingURL=pip-webui-help.js.map
