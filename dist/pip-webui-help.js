(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).help = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('pipHelp', [
        'pipHelp.Service',
        'pipHelp.Page'
    ]);
})();
},{}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipHelp.Templates');
} catch (e) {
  module = angular.module('pipHelp.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('help_page/help_page.html',
    '<md-toolbar class="pip-appbar-ext"></md-toolbar><pip-document width="800" min-height="400"><div class="pip-menu-container pip-help" ng-if="manager !== false"><md-list class="pip-menu pip-simple-list hide-xs" pip-selected="selected.tabIndex" pip-selected-watch="selected.navId" pip-select="onNavigationSelect($event.id)"><md-list-item class="pip-simple-list-item pip-selectable" ng-repeat="tab in tabs track by tab.state" md-ink-ripple="" pip-id="{{::tab.state }}"><p>{{::tab.title | translate}}</p></md-list-item></md-list><div class="pip-content-container"><pip-dropdown class="hide-gt-xs" pip-actions="tabs" pip-dropdown-select="onDropdownSelect" pip-active-index="selected.tabIndex"></pip-dropdown><div class="pip-body layout-column flex" ui-view=""></div></div></div><div class="layout-column layout-align-center-center flex" ng-if="manager === false">{{::\'ERROR_400\' | translate}}</div></pip-document>');
}]);
})();



},{}]},{},[4,2,3,1])(4)
});

//# sourceMappingURL=pip-webui-help.js.map
