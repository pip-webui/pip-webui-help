(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).help = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('pipHelp.Translate', [])
        .filter('translate', ['$injector', function ($injector) {
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
},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelpPageSelectedTab = (function () {
    function HelpPageSelectedTab() {
    }
    return HelpPageSelectedTab;
}());
exports.HelpPageSelectedTab = HelpPageSelectedTab;
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelpStateConfig = (function () {
    function HelpStateConfig() {
        this.auth = false;
    }
    return HelpStateConfig;
}());
exports.HelpStateConfig = HelpStateConfig;
},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelpTab = (function () {
    function HelpTab() {
    }
    return HelpTab;
}());
exports.HelpTab = HelpTab;
},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelpPageSelectedTab_1 = require("../help_common/HelpPageSelectedTab");
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
        this.selected = new HelpPageSelectedTab_1.HelpPageSelectedTab();
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
},{"../help_common/HelpPageSelectedTab":3,"./HelpPageRoutes":7}],7:[function(require,module,exports){
'use strict';
configureHelpPageRoutes.$inject = ['$stateProvider'];
function configureHelpPageRoutes($stateProvider) {
    $stateProvider
        .state('help', {
        url: '/help?party_id',
        auth: true,
        controllerAs: '$ctrl',
        controller: 'pipHelpPageController',
        templateUrl: 'help_page/HelpPage.html'
    });
}
angular.module('pipHelp.Page')
    .config(configureHelpPageRoutes);
},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelpConfig_1 = require("../help_common/HelpConfig");
var HelpService_1 = require("../help_service/HelpService");
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
            this._service = new HelpService_1.HelpService(this._config);
        }
        return this._service;
    };
    return HelpProvider;
}());
angular
    .module('pipHelp.Service', [])
    .provider('pipHelp', HelpProvider);
},{"../help_common/HelpConfig":2,"../help_service/HelpService":9}],9:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.HelpService = HelpService;
},{}],10:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
require("./help_provider/HelpProvider");
require("./help_page/HelpPageController");
angular.module('pipHelp', [
    'pipHelp.Service',
    'pipHelp.Page'
]);
__export(require("./help_service/HelpService"));
},{"./help_page/HelpPageController":6,"./help_provider/HelpProvider":8,"./help_service/HelpService":9}],11:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipHelp.Templates');
} catch (e) {
  module = angular.module('pipHelp.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('help_page/HelpPage.html',
    '<md-toolbar class="pip-appbar-ext"></md-toolbar><pip-document width="800" min-height="400" class="pip-help"><div class="pip-menu-container" ng-hide="$ctrl.manager === false || !$ctrl.tabs || $ctrl.tabs.length < 1"><md-list class="pip-menu pip-simple-list" pip-selected="$ctrl.selected.tabIndex" pip-selected-watch="$ctrl.selected.navId" pip-select="$ctrl.onNavigationSelect($event.id)"><md-list-item class="pip-simple-list-item pip-selectable flex" ng-repeat="tab in $ctrl.tabs track by tab.state" md-ink-ripple="" pip-id="{{:: tab.state }}"><p>{{::tab.title | translate}}</p></md-list-item></md-list><div class="pip-content-container"><pip-dropdown pip-actions="$ctrl.tabs" pip-dropdown-select="$ctrl.onDropdownSelect" pip-active-index="$ctrl.selected.tabIndex"></pip-dropdown><div class="pip-body p0 layout-column" ui-view=""></div></div></div><div class="layout-column layout-align-center-center flex" ng-show="$ctrl.manager === false || !$ctrl.tabs || $ctrl.tabs.length < 1">{{::\'ERROR_400\' | translate}}</div></pip-document>');
}]);
})();



},{}]},{},[11,1,2,3,4,5,6,7,8,9,10])(11)
});

//# sourceMappingURL=pip-webui-help.js.map
