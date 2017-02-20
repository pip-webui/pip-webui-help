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
        this.selected = {};
        if (this._state.current.name !== 'help') {
            this.initSelect(this._state.current.name);
        }
        else if (this._state.current.name === 'help' && pipHelp.getDefaultTab()) {
            this.initSelect(pipHelp.getDefaultTab().state);
        }
        else {
            $timeout(function () {
                if (pipHelp.getDefaultTab()) {
                    this.initSelect(pipHelp.getDefaultTab().state);
                }
                if (!pipHelp.getDefaultTab() && this.tabs && this.tabs.length > 0) {
                    this.initSelect(this.tabs[0].state);
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
    HelpService.$inject = ['$rootScope', 'config'];
    function HelpService($rootScope, config) {
        "ngInject";
        this._rootScope = $rootScope;
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
        var defaultTab;
        defaultTab = _.find(this._config.tabs, function (p) {
            return p.state === defaultTab;
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
        var defaultTab;
        defaultTab = _.find(this._config.tabs, function (p) {
            return p.state === defaultTab;
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
        if (typeof this._config.defaultTab === 'undefined' && this._config.tabs.length === 1) {
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
        if (value !== null && value !== undefined) {
            this._config.isNavIcon = !!value;
        }
        return this._config.isNavIcon;
    };
    HelpProvider.prototype.$get = ['$rootScope', '$state', function ($rootScope, $state) {
        "ngInject";
        if (this._service == null)
            this._service = new HelpService($rootScope, this._config);
        return this._service;
    }];
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
require("./help_service/HelpService");
require("./help_page/HelpPageController");
angular.module('pipHelp', [
    'pipHelp.Service',
    'pipHelp.Page'
]);
__export(require("./help_service/HelpService"));
},{"./help_page/HelpPageController":2,"./help_service/HelpService":4}],6:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipHelp.Templates');
} catch (e) {
  module = angular.module('pipHelp.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('help_page/HelpPage.html',
    '<md-toolbar class="pip-appbar-ext"></md-toolbar><pip-document width="800" min-height="400" class="pip-help"><div class="pip-menu-container" ng-hide="vm.manager === false || !vm.tabs || vm.tabs.length < 1"><md-list class="pip-menu pip-simple-list" pip-selected="vm.selected.tabIndex" pip-selected-watch="vm.selected.navId" pip-select="vm.onNavigationSelect($event.id)"><md-list-item class="pip-simple-list-item pip-selectable flex" ng-repeat="tab in vm.tabs track by tab.state" md-ink-ripple="" pip-id="{{:: tab.state }}"><p>{{::tab.title | translate}}</p></md-list-item></md-list><div class="pip-content-container"><pip-dropdown pip-actions="vm.tabs" pip-dropdown-select="vm.onDropdownSelect" pip-active-index="vm.selected.tabIndex"></pip-dropdown><div class="pip-body p0 layout-column" ui-view=""></div></div></div><div class="layout-column layout-align-center-center flex" ng-show="vm.manager === false || !vm.tabs || vm.tabs.length < 1">{{::\'ERROR_400\' | translate}}</div></pip-document>');
}]);
})();



},{}]},{},[6,1,2,3,4,5])(6)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZGVwZW5kZW5jaWVzL3RyYW5zbGF0ZS50cyIsInNyYy9oZWxwX3BhZ2UvSGVscFBhZ2VDb250cm9sbGVyLnRzIiwic3JjL2hlbHBfcGFnZS9IZWxwUGFnZVJvdXRlcy50cyIsInNyYy9oZWxwX3NlcnZpY2UvSGVscFNlcnZpY2UudHMiLCJzcmMvcGlwSGVscC50cyIsInRlbXAvcGlwLXdlYnVpLWhlbHAtaHRtbC5taW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNPQSxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUV6RCxVQUFVLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxVQUFVLFNBQVM7UUFDOUMsSUFBSSxZQUFZLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7Y0FDMUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFM0MsTUFBTSxDQUFDLFVBQVUsR0FBRztZQUNoQixNQUFNLENBQUMsWUFBWSxHQUFJLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNwRSxDQUFDLENBQUE7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUVQLENBQUMsQ0FBQyxFQUFFLENBQUM7OztBQ2xCTDtJQVNJLDRCQUNJLElBQW9CLEVBQ3BCLEVBQWdCLEVBQ2hCLE1BQTJCLEVBQzNCLGFBQWEsRUFDYixPQUFxQixFQUNyQixVQUFnQyxFQUNoQyxRQUFpQztRQVByQyxpQkE4Q0M7UUFyQ0csSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVyQixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLFVBQVUsR0FBUTtZQUNwRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBSWIsQ0FBQyxDQUFDLENBQUM7UUFFUCxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUV6QyxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sSUFBSSxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3hFLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLFFBQVEsQ0FBQztnQkFDTCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUMxQixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbkQsQ0FBQztnQkFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDeEMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUVELGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDOUIsYUFBYSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO1FBQ3ZDLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDN0IsYUFBYSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVwQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsVUFBQyxLQUFLO1lBQzFCLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQUVPLHVDQUFVLEdBQWxCLFVBQW1CLEtBQWE7UUFDNUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFVBQVUsR0FBUTtZQUM1QyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqRSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDaEMsQ0FBQztJQUVNLCtDQUFrQixHQUF6QixVQUEwQixLQUFhO1FBQ25DLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFdkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFCLENBQUM7SUFDTCxDQUFDO0lBQ0wseUJBQUM7QUFBRCxDQXhFQSxBQXdFQyxJQUFBO0FBRUQsQ0FBQztJQUVELE9BQU8sQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFO1FBQzNCLFdBQVc7UUFDWCxpQkFBaUI7UUFDakIsUUFBUTtRQUNSLGFBQWE7UUFDYixjQUFjO1FBQ2QsbUJBQW1CO0tBQ2xCLENBQUM7U0FDRCxVQUFVLENBQUMsdUJBQXVCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUM3RCxDQUFDLENBQUMsRUFBRSxDQUFDO0FBRUwsNEJBQTBCOztBQzFGMUIsWUFBWSxDQUFDO0FBRWIsaUNBQWlDLGNBQWM7SUFDM0MsY0FBYztTQUNULEtBQUssQ0FBQyxNQUFNLEVBQUU7UUFDWCxHQUFHLEVBQUUsZ0JBQWdCO1FBQ3JCLElBQUksRUFBRSxJQUFJO1FBQ1YsWUFBWSxFQUFFLElBQUk7UUFDbEIsVUFBVSxFQUFFLHVCQUF1QjtRQUNuQyxXQUFXLEVBQUUseUJBQXlCO0tBQ3pDLENBQUMsQ0FBQztBQUVYLENBQUM7QUFFRCxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQztLQUN6QixNQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQzs7QUNmckMsWUFBWSxDQUFDO0FBRWI7SUFBQTtJQU9BLENBQUM7SUFBRCxjQUFDO0FBQUQsQ0FQQSxBQU9DLElBQUE7QUFQWSwwQkFBTztBQXlCcEI7SUFBQTtRQUdXLFNBQUksR0FBYyxFQUFFLENBQUM7UUFDckIsY0FBUyxHQUFXLGdCQUFnQixDQUFDO1FBQ3JDLGNBQVMsR0FBWSxJQUFJLENBQUM7UUFDMUIsY0FBUyxHQUFZLElBQUksQ0FBQztJQUVyQyxDQUFDO0lBQUQsaUJBQUM7QUFBRCxDQVJBLEFBUUMsSUFBQTtBQVJZLGdDQUFVO0FBVXZCO0lBSUkscUJBQW1CLFVBQWdDLEVBQ2hDLE1BQWtCO1FBQ2pDLFVBQVUsQ0FBQztRQUNYLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQzFCLENBQUM7SUFFTyxzQ0FBZ0IsR0FBeEIsVUFBeUIsS0FBYTtRQUNsQyxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBRU0sbUNBQWEsR0FBcEIsVUFBcUIsSUFBWTtRQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsVUFBVSxHQUFHO1lBQ3hDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLEdBQUcscUJBQXFCLENBQUMsQ0FBQztRQUM1RSxDQUFDO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFTSxtQ0FBYSxHQUFwQjtRQUNJLElBQUksVUFBVSxDQUFDO1FBQ2YsVUFBVSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDO1lBQzlDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLFVBQVUsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFTSxtQ0FBYSxHQUFwQixVQUFzQixZQUFvQjtRQUN0QyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUNsQyxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO0lBQ2xDLENBQUM7SUFFTSxtQ0FBYSxHQUFwQixVQUFxQixZQUFZO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUM7WUFDdEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ2xDLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7SUFDbEMsQ0FBQztJQUVNLGlDQUFXLEdBQWxCLFVBQW1CLEtBQWM7UUFDN0IsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ3JDLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7SUFDbEMsQ0FBQztJQUNNLDZCQUFPLEdBQWQ7UUFDSSxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFTCxrQkFBQztBQUFELENBOURBLEFBOERDLElBQUE7QUFFRDtJQUtJLHNCQUFZLGNBQW9DO1FBSHhDLFlBQU8sR0FBZSxJQUFJLFVBQVUsRUFBRSxDQUFDO1FBSTNDLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO0lBQ3pDLENBQUM7SUFFTSx1Q0FBZ0IsR0FBdkIsVUFBd0IsS0FBSztRQUN6QixNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBRU0sb0NBQWEsR0FBcEI7UUFDSSxJQUFJLFVBQVUsQ0FBQztRQUVmLFVBQVUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQztZQUM5QyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxVQUFVLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRU0sNkJBQU0sR0FBYixVQUFjLE1BQVc7UUFDckIsSUFBSSxXQUFvQixDQUFDO1FBRXpCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekIsV0FBVyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDO1lBQy9DLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQzlDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLEdBQUcsTUFBTSxDQUFDLEtBQUssR0FBRyx5QkFBeUIsQ0FBQyxDQUFDO1FBQ3hGLENBQUM7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDbkIsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQzFDLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSztZQUNuQixLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssSUFBSSxNQUFNO1lBQzdCLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTtZQUNyQixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sS0FBSyxLQUFLO1lBQ2pDLFdBQVcsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7U0FDL0MsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFHbkYsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsS0FBSyxXQUFXLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckMsQ0FBQztJQUNMLENBQUM7SUFFTSxvQ0FBYSxHQUFwQixVQUFxQixJQUFZO1FBRTdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxVQUFVLEdBQUc7WUFDeEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEtBQUssT0FBTyxHQUFHLElBQUksQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixHQUFHLElBQUksR0FBRyxxQkFBcUIsQ0FBQyxDQUFDO1FBQzVFLENBQUM7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFHMUQsQ0FBQztJQU9PLGtDQUFXLEdBQW5CLFVBQW9CLE1BQWU7UUFDL0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQyxNQUFNLElBQUksS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEtBQUssSUFBSSxJQUFJLE1BQU0sQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMvQyxNQUFNLElBQUksS0FBSyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7UUFDMUUsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1FBQ3JELENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekQsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1FBQzFELENBQUM7SUFDTCxDQUFDO0lBRU0sb0NBQWEsR0FBcEIsVUFBc0IsWUFBb0I7UUFDdEMsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQztZQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDbEMsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztJQUNsQyxDQUFDO0lBRU0sb0NBQWEsR0FBcEIsVUFBcUIsWUFBWTtRQUM3QixFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUNsQyxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO0lBQ2xDLENBQUM7SUFFTSxrQ0FBVyxHQUFsQixVQUFtQixLQUFLO1FBQ3BCLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNyQyxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO0lBQ2xDLENBQUM7SUFFTSwyQkFBSSxHQUFYLFVBQVksVUFBVSxFQUFFLE1BQU07UUFDMUIsVUFBVSxDQUFDO1FBRVgsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUM7WUFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFdBQVcsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTlELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFDTCxtQkFBQztBQUFELENBeEhBLEFBd0hDLElBQUE7QUFFRCxPQUFPO0tBQ0YsTUFBTSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQztLQUM3QixRQUFRLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDOzs7Ozs7QUM1TnZDLHNDQUFvQztBQUNwQywwQ0FBd0M7QUFFeEMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7SUFDdEIsaUJBQWlCO0lBQ2pCLGNBQWM7Q0FDakIsQ0FBQyxDQUFDO0FBRUgsZ0RBQTJDOztBQ2IzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4gKiBAZmlsZSBPcHRpb25hbCBmaWx0ZXIgdG8gdHJhbnNsYXRlIHN0cmluZyByZXNvdXJjZXNcclxuICogQGNvcHlyaWdodCBEaWdpdGFsIExpdmluZyBTb2Z0d2FyZSBDb3JwLiAyMDE0LTIwMTZcclxuICovXHJcbiBcclxuLyogZ2xvYmFsIGFuZ3VsYXIgKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHRoaXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwSGVscC5UcmFuc2xhdGUnLCBbXSk7XHJcblxyXG4gICAgdGhpc01vZHVsZS5maWx0ZXIoJ3RyYW5zbGF0ZScsIGZ1bmN0aW9uICgkaW5qZWN0b3IpIHtcclxuICAgICAgICB2YXIgcGlwVHJhbnNsYXRlID0gJGluamVjdG9yLmhhcygncGlwVHJhbnNsYXRlJykgXHJcbiAgICAgICAgICAgID8gJGluamVjdG9yLmdldCgncGlwVHJhbnNsYXRlJykgOiBudWxsO1xyXG5cclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcGlwVHJhbnNsYXRlICA/IHBpcFRyYW5zbGF0ZS50cmFuc2xhdGUoa2V5KSB8fCBrZXkgOiBrZXk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG59KSgpO1xyXG4iLCIvLyBQcmV2ZW50IGp1bmsgZnJvbSBnb2luZyBpbnRvIHR5cGVzY3JpcHQgZGVmaW5pdGlvbnNcclxuaW1wb3J0IHtJSGVscFNlcnZpY2V9IGZyb20gJy4uL2hlbHBfc2VydmljZS9IZWxwU2VydmljZSc7XHJcblxyXG5jbGFzcyBIZWxwUGFnZUNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBfbG9nOiBuZy5JTG9nU2VydmljZTtcclxuICAgIHByaXZhdGUgX3E6IG5nLklRU2VydmljZTtcclxuICAgIHByaXZhdGUgX3N0YXRlOiBuZy51aS5JU3RhdGVTZXJ2aWNlO1xyXG5cclxuICAgIHB1YmxpYyB0YWJzOiBhbnk7XHJcbiAgICBwdWJsaWMgc2VsZWN0ZWQ6IGFueTtcclxuICAgIHB1YmxpYyBvbkRyb3Bkb3duU2VsZWN0OiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgJGxvZzogbmcuSUxvZ1NlcnZpY2UsXHJcbiAgICAgICAgJHE6IG5nLklRU2VydmljZSxcclxuICAgICAgICAkc3RhdGU6IG5nLnVpLklTdGF0ZVNlcnZpY2UsXHJcbiAgICAgICAgcGlwTmF2U2VydmljZSwvLzogcGlwLm5hdi5JTmF2U2VydmljZSxcclxuICAgICAgICBwaXBIZWxwOiBJSGVscFNlcnZpY2UsXHJcbiAgICAgICAgJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsIFxyXG4gICAgICAgICR0aW1lb3V0OiBhbmd1bGFyLklUaW1lb3V0U2VydmljZVxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5fbG9nID0gJGxvZztcclxuICAgICAgICB0aGlzLl9xID0gJHE7XHJcbiAgICAgICAgdGhpcy5fc3RhdGUgPSAkc3RhdGU7XHJcblxyXG4gICAgICAgIHRoaXMudGFicyA9IF8uZmlsdGVyKHBpcEhlbHAuZ2V0VGFicygpLCBmdW5jdGlvbiAodGFiOiBhbnkpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdGFiO1xyXG4gICAgICAgICAgICAgICAgLyppZiAodGFiLnZpc2libGUgPT09IHRydWUgJiYgKHRhYi5hY2Nlc3MgPyB0YWIuYWNjZXNzKCRyb290U2NvcGUuJHVzZXIsIHRhYikgOiB0cnVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YWI7XHJcbiAgICAgICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMudGFicyA9IF8uc29ydEJ5KHRoaXMudGFicywgJ2luZGV4Jyk7XHJcblxyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSB7fTtcclxuICAgICAgICBpZiAodGhpcy5fc3RhdGUuY3VycmVudC5uYW1lICE9PSAnaGVscCcpIHtcclxuICAgICAgICAgICAgdGhpcy5pbml0U2VsZWN0KHRoaXMuX3N0YXRlLmN1cnJlbnQubmFtZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9zdGF0ZS5jdXJyZW50Lm5hbWUgPT09ICdoZWxwJyAmJiBwaXBIZWxwLmdldERlZmF1bHRUYWIoKSkge1xyXG4gICAgICAgICAgICB0aGlzLmluaXRTZWxlY3QocGlwSGVscC5nZXREZWZhdWx0VGFiKCkuc3RhdGUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwaXBIZWxwLmdldERlZmF1bHRUYWIoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdFNlbGVjdChwaXBIZWxwLmdldERlZmF1bHRUYWIoKS5zdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIXBpcEhlbHAuZ2V0RGVmYXVsdFRhYigpICYmIHRoaXMudGFicyAmJiB0aGlzLnRhYnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdFNlbGVjdCh0aGlzLnRhYnNbMF0uc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBpcE5hdlNlcnZpY2UuaWNvbi5zaG93TWVudSgpO1xyXG4gICAgICAgIHBpcE5hdlNlcnZpY2UuYnJlYWRjcnVtYi50ZXh0ID0gXCJIZWxwXCI7XHJcbiAgICAgICAgcGlwTmF2U2VydmljZS5hY3Rpb25zLmhpZGUoKTtcclxuICAgICAgICBwaXBOYXZTZXJ2aWNlLmFwcGJhci5yZW1vdmVTaGFkb3coKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm9uRHJvcGRvd25TZWxlY3QgPSAoc3RhdGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5vbk5hdmlnYXRpb25TZWxlY3Qoc3RhdGUuc3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRTZWxlY3Qoc3RhdGU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQudGFiID0gXy5maW5kKHRoaXMudGFicywgZnVuY3Rpb24gKHRhYjogYW55KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhYi5zdGF0ZSA9PT0gc3RhdGU7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkLnRhYkluZGV4ID0gXy5pbmRleE9mKHRoaXMudGFicywgdGhpcy5zZWxlY3RlZC50YWIpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQudGFiSWQgPSBzdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25OYXZpZ2F0aW9uU2VsZWN0KHN0YXRlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmluaXRTZWxlY3Qoc3RhdGUpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZC50YWIpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhdGUuZ28oc3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuKCgpID0+IHtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdwaXBIZWxwLlBhZ2UnLCBbXHJcbiAgICAndWkucm91dGVyJywgXHJcbiAgICAncGlwSGVscC5TZXJ2aWNlJyxcclxuICAgICdwaXBOYXYnLCBcclxuICAgICdwaXBTZWxlY3RlZCcsXHJcbiAgICAncGlwVHJhbnNsYXRlJyxcclxuICAgICdwaXBIZWxwLlRlbXBsYXRlcydcclxuICAgIF0pXHJcbiAgICAuY29udHJvbGxlcigncGlwSGVscFBhZ2VDb250cm9sbGVyJywgSGVscFBhZ2VDb250cm9sbGVyKTtcclxufSkoKTtcclxuXHJcbmltcG9ydCAnLi9IZWxwUGFnZVJvdXRlcyc7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZnVuY3Rpb24gY29uZmlndXJlSGVscFBhZ2VSb3V0ZXMoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnN0YXRlKCdoZWxwJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvaGVscD9wYXJ0eV9pZCcsXHJcbiAgICAgICAgICAgIGF1dGg6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ3BpcEhlbHBQYWdlQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnaGVscF9wYWdlL0hlbHBQYWdlLmh0bWwnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICBcclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3BpcEhlbHAuUGFnZScpXHJcbiAgICAuY29uZmlnKGNvbmZpZ3VyZUhlbHBQYWdlUm91dGVzKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEhlbHBUYWIge1xyXG4gICAgcHVibGljIHN0YXRlOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdGl0bGU6IHN0cmluZztcclxuICAgIHB1YmxpYyBpbmRleDogc3RyaW5nO1xyXG4gICAgcHVibGljIGFjY2VzczogYm9vbGVhbjtcclxuICAgIHB1YmxpYyB2aXNpYmxlOiBib29sZWFuO1xyXG4gICAgcHVibGljIHN0YXRlQ29uZmlnOiBhbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUhlbHBTZXJ2aWNlIHtcclxuICAgIGdldERlZmF1bHRUYWIoKTtcclxuICAgIHNob3dUaXRsZVRleHQgKG5ld1RpdGxlVGV4dCk7XHJcbiAgICBzaG93VGl0bGVMb2dvKG5ld1RpdGxlTG9nbyk7XHJcbiAgICBzZXREZWZhdWx0VGFiKG5hbWU6IHN0cmluZyk7XHJcbiAgICBzaG93TmF2SWNvbih2YWx1ZSk7XHJcbiAgICBnZXRUYWJzKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUhlbHBQcm92aWRlciBleHRlbmRzIG5nLklTZXJ2aWNlUHJvdmlkZXIge1xyXG4gICAgZ2V0RGVmYXVsdFRhYigpOiBIZWxwVGFiO1xyXG4gICAgYWRkVGFiKHRhYk9iajogYW55KTtcclxuICAgIHNldERlZmF1bHRUYWIobmFtZTogc3RyaW5nKTogdm9pZDtcclxuICAgIGdldEZ1bGxTdGF0ZU5hbWUoc3RhdGU6IHN0cmluZyk6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEhlbHBDb25maWcge1xyXG5cclxuICAgIHB1YmxpYyBkZWZhdWx0VGFiOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdGFiczogSGVscFRhYltdID0gW107XHJcbiAgICBwdWJsaWMgdGl0bGVUZXh0OiBzdHJpbmcgPSAnU0VUVElOR1NfVElUTEUnO1xyXG4gICAgcHVibGljIHRpdGxlTG9nbzogYm9vbGVhbiA9IG51bGw7XHJcbiAgICBwdWJsaWMgaXNOYXZJY29uOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbn1cclxuXHJcbmNsYXNzIEhlbHBTZXJ2aWNlIGltcGxlbWVudHMgSUhlbHBTZXJ2aWNlIHtcclxuICAgIHByaXZhdGUgX2NvbmZpZzogSGVscENvbmZpZztcclxuICAgIHByaXZhdGUgX3Jvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2U7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLCBcclxuICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IEhlbHBDb25maWcpIHtcclxuICAgICAgICBcIm5nSW5qZWN0XCI7XHJcbiAgICAgICAgdGhpcy5fcm9vdFNjb3BlID0gJHJvb3RTY29wZTtcclxuICAgICAgICB0aGlzLl9jb25maWcgPSBjb25maWc7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRGdWxsU3RhdGVOYW1lKHN0YXRlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiAnaGVscC4nICsgc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldERlZmF1bHRUYWIobmFtZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCFfLmZpbmQodGhpcy5fY29uZmlnLnRhYnMsIGZ1bmN0aW9uICh0YWIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRhYi5zdGF0ZSA9PT0gJ2hlbHAuJyArIG5hbWU7XHJcbiAgICAgICAgfSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUYWIgd2l0aCBzdGF0ZSBuYW1lIFwiJyArIG5hbWUgKyAnXCIgaXMgbm90IHJlZ2lzdGVyZWQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbmZpZy5kZWZhdWx0VGFiID0gdGhpcy5nZXRGdWxsU3RhdGVOYW1lKG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXREZWZhdWx0VGFiKCkge1xyXG4gICAgICAgIHZhciBkZWZhdWx0VGFiO1xyXG4gICAgICAgIGRlZmF1bHRUYWIgPSBfLmZpbmQodGhpcy5fY29uZmlnLnRhYnMsIGZ1bmN0aW9uIChwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwLnN0YXRlID09PSBkZWZhdWx0VGFiO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBfLmNsb25lRGVlcChkZWZhdWx0VGFiKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvd1RpdGxlVGV4dCAobmV3VGl0bGVUZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAobmV3VGl0bGVUZXh0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZy50aXRsZVRleHQgPSBuZXdUaXRsZVRleHQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZy50aXRsZUxvZ28gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZy50aXRsZVRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNob3dUaXRsZUxvZ28obmV3VGl0bGVMb2dvKSB7XHJcbiAgICAgICAgaWYgKG5ld1RpdGxlTG9nbykge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25maWcudGl0bGVMb2dvID0gbmV3VGl0bGVMb2dvO1xyXG4gICAgICAgICAgICB0aGlzLl9jb25maWcudGl0bGVUZXh0ID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWcudGl0bGVMb2dvO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzaG93TmF2SWNvbih2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZy5pc05hdkljb24gPSAhIXZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZy5pc05hdkljb247XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VGFicygpIHtcclxuICAgICAgICByZXR1cm4gXy5jbG9uZURlZXAodGhpcy5fY29uZmlnLnRhYnMpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuY2xhc3MgSGVscFByb3ZpZGVyIGltcGxlbWVudHMgSUhlbHBQcm92aWRlciB7XHJcbiAgICBwcml2YXRlIF9zZXJ2aWNlOiBIZWxwU2VydmljZTtcclxuICAgIHByaXZhdGUgX2NvbmZpZzogSGVscENvbmZpZyA9IG5ldyBIZWxwQ29uZmlnKCk7XHJcbiAgICBwcml2YXRlIF9zdGF0ZVByb3ZpZGVyOiBuZy51aS5JU3RhdGVQcm92aWRlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigkc3RhdGVQcm92aWRlcjogbmcudWkuSVN0YXRlUHJvdmlkZXIpIHtcclxuICAgICAgICB0aGlzLl9zdGF0ZVByb3ZpZGVyID0gJHN0YXRlUHJvdmlkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEZ1bGxTdGF0ZU5hbWUoc3RhdGUpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiAnaGVscC4nICsgc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldERlZmF1bHRUYWIoKTogSGVscFRhYiB7XHJcbiAgICAgICAgdmFyIGRlZmF1bHRUYWI7XHJcblxyXG4gICAgICAgIGRlZmF1bHRUYWIgPSBfLmZpbmQodGhpcy5fY29uZmlnLnRhYnMsIGZ1bmN0aW9uIChwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwLnN0YXRlID09PSBkZWZhdWx0VGFiO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gXy5jbG9uZURlZXAoZGVmYXVsdFRhYik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZFRhYih0YWJPYmo6IGFueSkge1xyXG4gICAgICAgIHZhciBleGlzdGluZ1RhYjogSGVscFRhYjtcclxuXHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZVRhYih0YWJPYmopO1xyXG4gICAgICAgIGV4aXN0aW5nVGFiID0gXy5maW5kKHRoaXMuX2NvbmZpZy50YWJzLCBmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcC5zdGF0ZSA9PT0gJ2hlbHAuJyArIHRhYk9iai5zdGF0ZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoZXhpc3RpbmdUYWIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUYWIgd2l0aCBzdGF0ZSBuYW1lIFwiJyArIHRhYk9iai5zdGF0ZSArICdcIiBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbmZpZy50YWJzLnB1c2goe1xyXG4gICAgICAgICAgICBzdGF0ZTogdGhpcy5nZXRGdWxsU3RhdGVOYW1lKHRhYk9iai5zdGF0ZSksXHJcbiAgICAgICAgICAgIHRpdGxlOiB0YWJPYmoudGl0bGUsXHJcbiAgICAgICAgICAgIGluZGV4OiB0YWJPYmouaW5kZXggfHwgMTAwMDAwLFxyXG4gICAgICAgICAgICBhY2Nlc3M6IHRhYk9iai5hY2Nlc3MsXHJcbiAgICAgICAgICAgIHZpc2libGU6IHRhYk9iai52aXNpYmxlICE9PSBmYWxzZSxcclxuICAgICAgICAgICAgc3RhdGVDb25maWc6IF8uY2xvbmVEZWVwKHRhYk9iai5zdGF0ZUNvbmZpZylcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9zdGF0ZVByb3ZpZGVyLnN0YXRlKHRoaXMuZ2V0RnVsbFN0YXRlTmFtZSh0YWJPYmouc3RhdGUpLCB0YWJPYmouc3RhdGVDb25maWcpO1xyXG5cclxuICAgICAgICAvLyBpZiB3ZSBqdXN0IGFkZGVkIGZpcnN0IHN0YXRlIGFuZCBubyBkZWZhdWx0IHN0YXRlIGlzIHNwZWNpZmllZFxyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5fY29uZmlnLmRlZmF1bHRUYWIgPT09ICd1bmRlZmluZWQnICYmIHRoaXMuX2NvbmZpZy50YWJzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldERlZmF1bHRUYWIodGFiT2JqLnN0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldERlZmF1bHRUYWIobmFtZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgLy8gVE9ETyBbYXBpZGhpcm55aV0gZXh0cmFjdCBleHByZXNzaW9uIGluc2lkZSAnaWYnIGludG8gdmFyaWFibGUuIEl0IGlzbid0IHJlYWRhYmxlIG5vdy5cclxuICAgICAgICBpZiAoIV8uZmluZCh0aGlzLl9jb25maWcudGFicywgZnVuY3Rpb24gKHRhYikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGFiLnN0YXRlID09PSAnaGVscC4nICsgbmFtZTtcclxuICAgICAgICB9KSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RhYiB3aXRoIHN0YXRlIG5hbWUgXCInICsgbmFtZSArICdcIiBpcyBub3QgcmVnaXN0ZXJlZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fY29uZmlnLmRlZmF1bHRUYWIgPSB0aGlzLmdldEZ1bGxTdGF0ZU5hbWUobmFtZSk7XHJcbiAgICAgICAgLy90aGlzLl9zdGF0ZVByb3ZpZGVyLmdvKHRoaXMuX2NvbmZpZy5kZWZhdWx0VGFiKTtcclxuICAgICAgICAgICAgLy9waXBBdXRoU3RhdGVQcm92aWRlci5yZWRpcmVjdCgnaGVscCcsIGdldEZ1bGxTdGF0ZU5hbWUobmFtZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVmFsaWRhdGVzIHBhc3NlZCB0YWIgY29uZmlnIG9iamVjdFxyXG4gICAgICogSWYgcGFzc2VkIHRhYiBpcyBub3QgdmFsaWQgaXQgd2lsbCB0aHJvdyBhbiBlcnJvclxyXG4gICAgICovXHJcblxyXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZVRhYih0YWJPYmo6IEhlbHBUYWIpIHtcclxuICAgICAgICBpZiAoIXRhYk9iaiB8fCAhXy5pc09iamVjdCh0YWJPYmopKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBvYmplY3QnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0YWJPYmouc3RhdGUgPT09IG51bGwgfHwgdGFiT2JqLnN0YXRlID09PSAnJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RhYiBzaG91bGQgaGF2ZSB2YWxpZCBBbmd1bGFyIFVJIHJvdXRlciBzdGF0ZSBuYW1lJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGFiT2JqLmFjY2VzcyAmJiAhXy5pc0Z1bmN0aW9uKHRhYk9iai5hY2Nlc3MpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignXCJhY2Nlc3NcIiBzaG91bGQgYmUgYSBmdW5jdGlvbicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0YWJPYmouc3RhdGVDb25maWcgfHwgIV8uaXNPYmplY3QodGFiT2JqLnN0YXRlQ29uZmlnKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RhdGUgY29uZmlndXJhdGlvbiBvYmplY3QnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNob3dUaXRsZVRleHQgKG5ld1RpdGxlVGV4dDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAobmV3VGl0bGVUZXh0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZy50aXRsZVRleHQgPSBuZXdUaXRsZVRleHQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZy50aXRsZUxvZ28gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZy50aXRsZVRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNob3dUaXRsZUxvZ28obmV3VGl0bGVMb2dvKSB7XHJcbiAgICAgICAgaWYgKG5ld1RpdGxlTG9nbykge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25maWcudGl0bGVMb2dvID0gbmV3VGl0bGVMb2dvO1xyXG4gICAgICAgICAgICB0aGlzLl9jb25maWcudGl0bGVUZXh0ID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWcudGl0bGVMb2dvO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzaG93TmF2SWNvbih2YWx1ZSkge1xyXG4gICAgICAgIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZy5pc05hdkljb24gPSAhIXZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZy5pc05hdkljb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICRnZXQoJHJvb3RTY29wZSwgJHN0YXRlKSB7XHJcbiAgICAgICAgXCJuZ0luamVjdFwiO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2VydmljZSA9PSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLl9zZXJ2aWNlID0gbmV3IEhlbHBTZXJ2aWNlKCRyb290U2NvcGUsIHRoaXMuX2NvbmZpZyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlcnZpY2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcEhlbHAuU2VydmljZScsIFtdKVxyXG4gICAgLnByb3ZpZGVyKCdwaXBIZWxwJywgSGVscFByb3ZpZGVyKTtcclxuXHJcbiIsIu+7vy8qKlxyXG4gKiBAZmlsZSBSZWdpc3RyYXRpb24gb2YgYWxsIGhlbHAgY29tcG9uZW50c1xyXG4gKiBAY29weXJpZ2h0IERpZ2l0YWwgTGl2aW5nIFNvZnR3YXJlIENvcnAuIDIwMTQtMjAxNlxyXG4gKi9cclxuXHJcbmltcG9ydCAnLi9oZWxwX3NlcnZpY2UvSGVscFNlcnZpY2UnO1xyXG5pbXBvcnQgJy4vaGVscF9wYWdlL0hlbHBQYWdlQ29udHJvbGxlcic7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncGlwSGVscCcsIFtcclxuICAgICdwaXBIZWxwLlNlcnZpY2UnLFxyXG4gICAgJ3BpcEhlbHAuUGFnZSdcclxuXSk7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL2hlbHBfc2VydmljZS9IZWxwU2VydmljZSc7XHJcbmV4cG9ydCAqIGZyb20gJy4vaGVscF9wYWdlL0hlbHBQYWdlQ29udHJvbGxlcic7IiwiKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcEhlbHAuVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBIZWxwLlRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnaGVscF9wYWdlL0hlbHBQYWdlLmh0bWwnLFxuICAgICc8bWQtdG9vbGJhciBjbGFzcz1cInBpcC1hcHBiYXItZXh0XCI+PC9tZC10b29sYmFyPjxwaXAtZG9jdW1lbnQgd2lkdGg9XCI4MDBcIiBtaW4taGVpZ2h0PVwiNDAwXCIgY2xhc3M9XCJwaXAtaGVscFwiPjxkaXYgY2xhc3M9XCJwaXAtbWVudS1jb250YWluZXJcIiBuZy1oaWRlPVwidm0ubWFuYWdlciA9PT0gZmFsc2UgfHwgIXZtLnRhYnMgfHwgdm0udGFicy5sZW5ndGggPCAxXCI+PG1kLWxpc3QgY2xhc3M9XCJwaXAtbWVudSBwaXAtc2ltcGxlLWxpc3RcIiBwaXAtc2VsZWN0ZWQ9XCJ2bS5zZWxlY3RlZC50YWJJbmRleFwiIHBpcC1zZWxlY3RlZC13YXRjaD1cInZtLnNlbGVjdGVkLm5hdklkXCIgcGlwLXNlbGVjdD1cInZtLm9uTmF2aWdhdGlvblNlbGVjdCgkZXZlbnQuaWQpXCI+PG1kLWxpc3QtaXRlbSBjbGFzcz1cInBpcC1zaW1wbGUtbGlzdC1pdGVtIHBpcC1zZWxlY3RhYmxlIGZsZXhcIiBuZy1yZXBlYXQ9XCJ0YWIgaW4gdm0udGFicyB0cmFjayBieSB0YWIuc3RhdGVcIiBtZC1pbmstcmlwcGxlPVwiXCIgcGlwLWlkPVwie3s6OiB0YWIuc3RhdGUgfX1cIj48cD57ezo6dGFiLnRpdGxlIHwgdHJhbnNsYXRlfX08L3A+PC9tZC1saXN0LWl0ZW0+PC9tZC1saXN0PjxkaXYgY2xhc3M9XCJwaXAtY29udGVudC1jb250YWluZXJcIj48cGlwLWRyb3Bkb3duIHBpcC1hY3Rpb25zPVwidm0udGFic1wiIHBpcC1kcm9wZG93bi1zZWxlY3Q9XCJ2bS5vbkRyb3Bkb3duU2VsZWN0XCIgcGlwLWFjdGl2ZS1pbmRleD1cInZtLnNlbGVjdGVkLnRhYkluZGV4XCI+PC9waXAtZHJvcGRvd24+PGRpdiBjbGFzcz1cInBpcC1ib2R5IHAwIGxheW91dC1jb2x1bW5cIiB1aS12aWV3PVwiXCI+PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cImxheW91dC1jb2x1bW4gbGF5b3V0LWFsaWduLWNlbnRlci1jZW50ZXIgZmxleFwiIG5nLXNob3c9XCJ2bS5tYW5hZ2VyID09PSBmYWxzZSB8fCAhdm0udGFicyB8fCB2bS50YWJzLmxlbmd0aCA8IDFcIj57ezo6XFwnRVJST1JfNDAwXFwnIHwgdHJhbnNsYXRlfX08L2Rpdj48L3BpcC1kb2N1bWVudD4nKTtcbn1dKTtcbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpcC13ZWJ1aS1oZWxwLWh0bWwubWluLmpzLm1hcFxuIl19