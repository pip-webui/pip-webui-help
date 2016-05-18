/**
 * @file Registration of all help components
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    angular.module('pipHelp', [
        'pipHelp.Service',
        'pipHelp.Page'
    ]);
    
})();
(function(module) {
try {
  module = angular.module('pipHelp.Templates');
} catch (e) {
  module = angular.module('pipHelp.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('help_page/help_page.html',
    '<md-toolbar class="pip-appbar-ext"></md-toolbar>\n' +
    '\n' +
    '<pip-document width="800" min-height="400">\n' +
    '    <div class="pip-menu-container pip-help" ng-hide="manager === false">\n' +
    '        <md-list class="pip-menu pip-simple-list hide-xs" pip-selected="selected.pageIndex"\n' +
    '                 pip-selected-watch="selected.navId" pip-select="onNavigationSelect($event.id)">\n' +
    '            <md-list-item class="pip-simple-list-item pip-selectable" md-ink-ripple pip-id="{{ page.state }}"\n' +
    '                          ng-repeat="page in pages track by page.state">\n' +
    '                <p> {{page.title | translate}} </p>\n' +
    '            </md-list-item>\n' +
    '        </md-list>\n' +
    '\n' +
    '        <div class="pip-content-container">\n' +
    '            <pip-dropdown pip-actions="pages" class="hide-gt-xs" pip-dropdown-select="onDropdownSelect"\n' +
    '                          pip-active-index="selected.pageIndex"></pip-dropdown>\n' +
    '            <div class="pip-body p24-flex" ui-view layout="column" flex style="max-width: none !important"></div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div ng-show="manager === false" layout="column" layout-align="center center" flex>\n' +
    '        {{::\'ERROR_400\' | translate}}\n' +
    '    </div>\n' +
    '</pip-document>');
}]);
})();

// ==========================================================
//  Title: help_page.js
//  Description: Application help page module
//  Copyright (c) 2004-2015 Modular Mining Systems, Inc.
//  All Rights Reserved
// ==========================================================
//  The information described in this document is furnished as proprietary
//  information and may not be copied or sold without the written permission
//  of Modular Mining Systems, Inc.
// ==========================================================

(function (angular, _) {
    'use strict';

    config.$inject = ['pipStateProvider'];
    HelpPageController.$inject = ['$scope', '$rootScope', '$state', '$mdMedia', 'pipAppBar', 'pipHelp'];
    angular.module('pipHelp.Page', ['pipState', 'pipHelp.Service',  'pipAppBar', 'pipSelected', 'pipTranslate', 'pipHelp.Templates'])
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

    function HelpPageController($scope, $rootScope, $state, $mdMedia, pipAppBar, pipHelp) {
        $scope.$mdMedia = $mdMedia;

        $scope.pages = _.filter(pipHelp.getPages(), function (page) {
            if (page.visible === true && (page.access ? page.access($rootScope.$user, page) : true)) {
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

        function appHeader () {
            pipAppBar.showMenuNavIcon();
            pipAppBar.showTitleText('Help');
            pipAppBar.hideShadow();
            pipAppBar.showLocalActions(null,[]);
        };

        function onNavigationSelect  (state) {
            initSelect(state);

            if ($scope.selected.page) {
                $state.go(state);
            }
        };

        function initSelect(state) {
            $scope.selected.page = _.find($scope.pages, function(page) { return page.state == state; });
            $scope.selected.pageIndex = _.indexOf($scope.pages, $scope.selected.page);
            $scope.selected.pageId = state;
        }
    }
})(window.angular, window._);
(function () {
    'use strict';

    angular.module('pipHelp.Service', ['pipState'])
        .provider('pipHelp',
        ['pipAuthStateProvider', function(pipAuthStateProvider) {
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
            }

            function getFullStateName(state) {
                return 'help.' + state;
            }

            function getPages () {
                return _.clone(pages, true);
            }

            function getDefaultPage() {
                return _.clone(_.find(pages, function(page) { return page.state == defaultPage; }), true);
            }


            function addPage(pageObj) {
                validatePage(pageObj);

                if (_.find(pages, function(page) { return page.state == getFullStateName(pageObj.state); })) {
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
                if (typeof defaultPage === 'undefined' && pages.length === 1) {
                    setDefaultPage(pageObj.state);
                }
            }

            function setDefaultPage(name) {
                if (!_.find(pages, function(page) { return page.state == getFullStateName(name); })) {
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

                if (!pageObj.stateConfig || !_.isObject(pageObj.stateConfig )) {
                    throw new Error('Invalid state configuration object');
                }
            }
        }]);


})();
//# sourceMappingURL=pip-webui-help.js.map
