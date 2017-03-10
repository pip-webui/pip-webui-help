(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).help = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
var HelpTab = (function () {
    function HelpTab() {
    }
    return HelpTab;
}());
exports.HelpTab = HelpTab;
var HelpStateConfig = (function () {
    function HelpStateConfig() {
        this.auth = false;
    }
    return HelpStateConfig;
}());
exports.HelpStateConfig = HelpStateConfig;
var HelpPageSelectedTab = (function () {
    function HelpPageSelectedTab() {
    }
    return HelpPageSelectedTab;
}());
exports.HelpPageSelectedTab = HelpPageSelectedTab;
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelpConfig_1 = require("../common/HelpConfig");
var HelpService = (function () {
    HelpService.$inject = ['_config'];
    function HelpService(_config) {
        "ngInject";
        this._config = _config;
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
        this.$stateProvider = $stateProvider;
        this._config = new HelpConfig_1.HelpConfig();
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
        this.$stateProvider.state(this.getFullStateName(tabObj.state), tabObj.stateConfig);
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
},{"../common/HelpConfig":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
},{}],5:[function(require,module,exports){
{
    filter.$inject = ['$injector'];
    function filter($injector) {
        var pipTranslate = $injector.has('pipTranslate')
            ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate.translate(key) || key : key;
        };
    }
    angular.module('pipHelp.Translate', [])
        .filter('translate', filter);
}
},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelpConfig_1 = require("../common/HelpConfig");
var HelpPageController = (function () {
    HelpPageController.$inject = ['$log', '$state', '$rootScope', '$timeout', 'pipNavService', 'pipHelp'];
    function HelpPageController($log, $state, $rootScope, $timeout, pipNavService, pipHelp) {
        var _this = this;
        this.$log = $log;
        this.$state = $state;
        this.tabs = _.filter(pipHelp.getTabs(), function (tab) {
            if (tab.visible === true) {
                return tab;
            }
        });
        this.tabs = _.sortBy(this.tabs, 'index');
        this.selected = new HelpConfig_1.HelpPageSelectedTab();
        if (this.$state.current.name !== 'help') {
            this.initSelect(this.$state.current.name);
        }
        else if (this.$state.current.name === 'help' && pipHelp.getDefaultTab()) {
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
            this.$state.go(state);
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
},{"../common/HelpConfig":1,"./HelpPageRoutes":7}],7:[function(require,module,exports){
{
    configureHelpPageRoutes.$inject = ['$stateProvider'];
    function configureHelpPageRoutes($stateProvider) {
        $stateProvider
            .state('help', {
            url: '/help?party_id',
            auth: true,
            controllerAs: '$ctrl',
            controller: 'pipHelpPageController',
            templateUrl: 'page/HelpPage.html'
        });
    }
    angular.module('pipHelp.Page')
        .config(configureHelpPageRoutes);
}
},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./common/HelpService");
require("./page/HelpPageController");
angular.module('pipHelp', [
    'pipHelp.Service',
    'pipHelp.Page'
]);
},{"./common/HelpService":2,"./page/HelpPageController":6}],9:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipHelp.Templates');
} catch (e) {
  module = angular.module('pipHelp.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('page/HelpPage.html',
    '<md-toolbar class="pip-appbar-ext"></md-toolbar>\n' +
    '<pip-document width="800" min-height="400"\n' +
    '              class="pip-help">\n' +
    '\n' +
    '    <div class="pip-menu-container"\n' +
    '         ng-hide="$ctrl.manager === false || !$ctrl.tabs || $ctrl.tabs.length < 1">\n' +
    '        <md-list class="pip-menu pip-simple-list"\n' +
    '                 pip-selected="$ctrl.selected.tabIndex"\n' +
    '                 pip-selected-watch="$ctrl.selected.navId"\n' +
    '                 pip-select="$ctrl.onNavigationSelect($event.id)">\n' +
    '            <md-list-item class="pip-simple-list-item pip-selectable flex"\n' +
    '                          ng-repeat="tab in $ctrl.tabs track by tab.state" \n' +
    '                          md-ink-ripple\n' +
    '                          pip-id="{{:: tab.state }}">\n' +
    '                <p>{{::tab.title | translate}}</p>\n' +
    '            </md-list-item>\n' +
    '        </md-list>\n' +
    '\n' +
    '        <div class="pip-content-container">\n' +
    '            <pip-dropdown pip-actions="$ctrl.tabs"\n' +
    '                          pip-dropdown-select="$ctrl.onDropdownSelect"\n' +
    '                          pip-active-index="$ctrl.selected.tabIndex"></pip-dropdown>\n' +
    '\n' +
    '            <div class="pip-body p0 layout-column" ui-view></div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="layout-column layout-align-center-center flex"\n' +
    '         ng-show="$ctrl.manager === false || !$ctrl.tabs || $ctrl.tabs.length < 1">\n' +
    '        {{::\'ERROR_400\' | translate}}\n' +
    '    </div>\n' +
    '</pip-document>');
}]);
})();



},{}]},{},[9,1,2,3,4,5,6,7,8])(9)
});

//# sourceMappingURL=pip-webui-help.js.map
