(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).help = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipHelp.Translate', []);
    thisModule.filter('translate', ['$injector', function ($injector) {
        var pipTranslate = $injector.has('pipTranslate')
            ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate.translate(key) || key : key;
        };
    }]);
})();
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelpPageSelectedTab = (function () {
    function HelpPageSelectedTab() {
    }
    return HelpPageSelectedTab;
}());
exports.HelpPageSelectedTab = HelpPageSelectedTab;
var HelpPageController = (function () {
    HelpPageController.$inject = ['$log', '$q', '$state', 'pipNavService', 'pipHelp', '$rootScope', '$timeout'];
    function HelpPageController($log, $q, $state, pipNavService, pipHelp, $rootScope, $timeout) {
        var _this = this;
        this._log = $log;
        this._q = $q;
        this._state = $state;
        this.tabs = _.filter(pipHelp.getTabs(), function (tab) {
            return tab;
        });
        this.tabs = _.sortBy(this.tabs, 'index');
        this.selected = new HelpPageSelectedTab();
        if (this._state.current.name !== 'help') {
            this.initSelect(this._state.current.name);
        }
        else if (this._state.current.name === 'help' && pipHelp.getDefaultTab()) {
            this.initSelect(pipHelp.getDefaultTab().state);
        }
        else {
            $timeout(function () {
                if (pipHelp.getDefaultTab()) {
                    _this.initSelect(pipHelp.getDefaultTab().state);
                }
                if (!pipHelp.getDefaultTab() && _this.tabs && _this.tabs.length > 0) {
                    _this.initSelect(_this.tabs[0].state);
                }
            });
        }
        pipNavService.icon.showMenu();
        pipNavService.breadcrumb.text = "Help";
        pipNavService.actions.hide();
        pipNavService.appbar.removeShadow();
        this.onDropdownSelect = function (state) {
            _this.onNavigationSelect(state.state);
        };
    }
    HelpPageController.prototype.initSelect = function (state) {
        this.selected.tab = _.find(this.tabs, function (tab) {
            return tab.state === state;
        });
        this.selected.tabIndex = _.indexOf(this.tabs, this.selected.tab);
        this.selected.tabId = state;
    };
    HelpPageController.prototype.onNavigationSelect = function (state) {
        this.initSelect(state);
        if (this.selected.tab) {
            this._state.go(state);
        }
    };
    return HelpPageController;
}());
(function () {
    angular.module('pipHelp.Page', [
        'ui.router',
        'pipHelp.Service',
        'pipNav',
        'pipSelected',
        'pipTranslate',
        'pipHelp.Templates'
    ])
        .controller('pipHelpPageController', HelpPageController);
})();
require("./HelpPageRoutes");
},{"./HelpPageRoutes":3}],3:[function(require,module,exports){
'use strict';
configureHelpPageRoutes.$inject = ['$stateProvider'];
function configureHelpPageRoutes($stateProvider) {
    $stateProvider
        .state('help', {
        url: '/help?party_id',
        auth: true,
        controllerAs: 'vm',
        controller: 'pipHelpPageController',
        templateUrl: 'help_page/HelpPage.html'
    });
}
angular.module('pipHelp.Page')
    .config(configureHelpPageRoutes);
},{}],4:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var HelpTab = (function () {
    function HelpTab() {
    }
    return HelpTab;
}());
exports.HelpTab = HelpTab;
var HelpConfig = (function () {
    function HelpConfig() {
        this.tabs = [];
        this.titleText = 'SETTINGS_TITLE';
        this.titleLogo = null;
        this.isNavIcon = true;
    }
    return HelpConfig;
}());
exports.HelpConfig = HelpConfig;
var HelpService = (function () {
    HelpService.$inject = ['config'];
    function HelpService(config) {
        "ngInject";
        this._config = config;
    }
    HelpService.prototype.getFullStateName = function (state) {
        return 'help.' + state;
    };
    HelpService.prototype.setDefaultTab = function (name) {
        if (!_.find(this._config.tabs, function (tab) {
            return tab.state === 'help.' + name;
        })) {
            throw new Error('Tab with state name "' + name + '" is not registered');
        }
        this._config.defaultTab = this.getFullStateName(name);
    };
    HelpService.prototype.getDefaultTab = function () {
        var _this = this;
        var defaultTab;
        defaultTab = _.find(this._config.tabs, function (p) {
            return p.state === _this._config.defaultTab;
        });
        return _.cloneDeep(defaultTab);
    };
    HelpService.prototype.showTitleText = function (newTitleText) {
        if (newTitleText) {
            this._config.titleText = newTitleText;
            this._config.titleLogo = null;
        }
        return this._config.titleText;
    };
    HelpService.prototype.showTitleLogo = function (newTitleLogo) {
        if (newTitleLogo) {
            this._config.titleLogo = newTitleLogo;
            this._config.titleText = null;
        }
        return this._config.titleLogo;
    };
    HelpService.prototype.showNavIcon = function (value) {
        if (value !== null && value !== undefined) {
            this._config.isNavIcon = !!value;
        }
        return this._config.isNavIcon;
    };
    HelpService.prototype.getTabs = function () {
        return _.cloneDeep(this._config.tabs);
    };
    return HelpService;
}());
var HelpProvider = (function () {
    HelpProvider.$inject = ['$stateProvider'];
    function HelpProvider($stateProvider) {
        this._config = new HelpConfig();
        this._stateProvider = $stateProvider;
    }
    HelpProvider.prototype.getFullStateName = function (state) {
        return 'help.' + state;
    };
    HelpProvider.prototype.getDefaultTab = function () {
        var _this = this;
        var defaultTab;
        defaultTab = _.find(this._config.tabs, function (p) {
            return p.state === _this._config.defaultTab;
        });
        return _.cloneDeep(defaultTab);
    };
    HelpProvider.prototype.addTab = function (tabObj) {
        var existingTab;
        this.validateTab(tabObj);
        existingTab = _.find(this._config.tabs, function (p) {
            return p.state === 'help.' + tabObj.state;
        });
        if (existingTab) {
            throw new Error('Tab with state name "' + tabObj.state + '" is already registered');
        }
        this._config.tabs.push({
            state: this.getFullStateName(tabObj.state),
            title: tabObj.title,
            index: tabObj.index || 100000,
            access: tabObj.access,
            visible: tabObj.visible !== false,
            stateConfig: _.cloneDeep(tabObj.stateConfig)
        });
        this._stateProvider.state(this.getFullStateName(tabObj.state), tabObj.stateConfig);
        if (typeof _.isUndefined(this._config.defaultTab) && this._config.tabs.length === 1) {
            this.setDefaultTab(tabObj.state);
        }
    };
    HelpProvider.prototype.setDefaultTab = function (name) {
        if (!_.find(this._config.tabs, function (tab) {
            return tab.state === 'help.' + name;
        })) {
            throw new Error('Tab with state name "' + name + '" is not registered');
        }
        this._config.defaultTab = this.getFullStateName(name);
    };
    HelpProvider.prototype.validateTab = function (tabObj) {
        if (!tabObj || !_.isObject(tabObj)) {
            throw new Error('Invalid object');
        }
        if (tabObj.state === null || tabObj.state === '') {
            throw new Error('Tab should have valid Angular UI router state name');
        }
        if (tabObj.access && !_.isFunction(tabObj.access)) {
            throw new Error('"access" should be a function');
        }
        if (!tabObj.stateConfig || !_.isObject(tabObj.stateConfig)) {
            throw new Error('Invalid state configuration object');
        }
    };
    HelpProvider.prototype.showTitleText = function (newTitleText) {
        if (newTitleText) {
            this._config.titleText = newTitleText;
            this._config.titleLogo = null;
        }
        return this._config.titleText;
    };
    HelpProvider.prototype.showTitleLogo = function (newTitleLogo) {
        if (newTitleLogo) {
            this._config.titleLogo = newTitleLogo;
            this._config.titleText = null;
        }
        return this._config.titleLogo;
    };
    HelpProvider.prototype.showNavIcon = function (value) {
        if (!_.isNull(value) && !_.isUndefined(value)) {
            this._config.isNavIcon = !!value;
        }
        return this._config.isNavIcon;
    };
    HelpProvider.prototype.$get = function () {
        "ngInject";
        if (_.isNull(this._service) || _.isUndefined(this._service)) {
            this._service = new HelpService(this._config);
        }
        return this._service;
    };
    return HelpProvider;
}());
angular
    .module('pipHelp.Service', [])
    .provider('pipHelp', HelpProvider);
},{}],5:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
require("./help_service/HelpService");
require("./help_page/HelpPageController");
angular.module('pipHelp', [
    'pipHelp.Service',
    'pipHelp.Page'
]);
__export(require("./help_service/HelpService"));
__export(require("./help_page/HelpPageController"));
},{"./help_page/HelpPageController":2,"./help_service/HelpService":4}],6:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipHelp.Templates');
} catch (e) {
  module = angular.module('pipHelp.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('help_page/HelpPage.html',
    '<md-toolbar class="pip-appbar-ext"></md-toolbar>\n' +
    '<pip-document width="800" min-height="400"\n' +
    '              class="pip-help">\n' +
    '\n' +
    '    <div class="pip-menu-container"\n' +
    '         ng-hide="vm.manager === false || !vm.tabs || vm.tabs.length < 1">\n' +
    '        <md-list class="pip-menu pip-simple-list"\n' +
    '                 pip-selected="vm.selected.tabIndex"\n' +
    '                 pip-selected-watch="vm.selected.navId"\n' +
    '                 pip-select="vm.onNavigationSelect($event.id)">\n' +
    '            <md-list-item class="pip-simple-list-item pip-selectable flex"\n' +
    '                          ng-repeat="tab in vm.tabs track by tab.state" \n' +
    '                          md-ink-ripple\n' +
    '                          pip-id="{{:: tab.state }}">\n' +
    '                <p>{{::tab.title | translate}}</p>\n' +
    '            </md-list-item>\n' +
    '        </md-list>\n' +
    '\n' +
    '        <div class="pip-content-container">\n' +
    '            <pip-dropdown pip-actions="vm.tabs"\n' +
    '                          pip-dropdown-select="vm.onDropdownSelect"\n' +
    '                          pip-active-index="vm.selected.tabIndex"></pip-dropdown>\n' +
    '\n' +
    '            <div class="pip-body p0 layout-column" ui-view></div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="layout-column layout-align-center-center flex"\n' +
    '         ng-show="vm.manager === false || !vm.tabs || vm.tabs.length < 1">\n' +
    '        {{::\'ERROR_400\' | translate}}\n' +
    '    </div>\n' +
    '</pip-document>');
}]);
})();



},{}]},{},[6,1,2,3,4,5])(6)
});

//# sourceMappingURL=pip-webui-help.js.map
