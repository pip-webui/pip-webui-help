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

        return;

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