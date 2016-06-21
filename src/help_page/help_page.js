/**
 * @file Page template for help components
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';

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

        $scope.pages    = _.filter(pipHelp.getPages(), function (page) {

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
        $scope.onDropdownSelect   = onDropdownSelect;

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
            $scope.selected.page      = _.find($scope.pages, function (page) {
                return page.state == state;
            });
            $scope.selected.pageIndex = _.indexOf($scope.pages, $scope.selected.page);
            $scope.selected.pageId    = state;
        }
    }
})(window.angular, window._);