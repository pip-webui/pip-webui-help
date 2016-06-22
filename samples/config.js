/**
 * @file Global configuration for sample application
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipSampleConfig', ['pipRest.State', 'pipRest', 'pipEntry', 'pipSideNav',
        'pipAppBar', 'pipHelp', 'pipHelpConfig']);

    // Configure application services before start
    thisModule.config(
        function ($mdThemingProvider, $urlRouterProvider, pipAuthStateProvider, pipRestProvider, pipSideNavProvider,
                  pipAppBarProvider, pipEntryProvider, $mdIconProvider) {

            $mdIconProvider.iconSet('icons', 'images/icons.svg', 512);

            // Set global constants
            pipAppBarProvider.appTitleText('Sample Application');
            pipAppBarProvider.globalSecondaryActions([
                {name: 'global.signout', title: 'SIGNOUT', state: 'signout'}
            ]);

            // Configure REST API
            pipRestProvider.serverUrl('http://alpha.pipservices.net');

            // Configure entry pages

            // Configure default states
            pipAuthStateProvider.unauthorizedState('signin');
            pipAuthStateProvider.authorizedState('help');

            $urlRouterProvider.otherwise(function ($injector, $location) {
                if ($location.$$path === '') {
                    return '/signin';
                }

                return '/help';
            });

            // Configure navigation menu
            pipSideNavProvider.sections([
                {
                    links: [
                        {title: 'Help', url: '/help'}
                    ]
                },
                {
                    links: [
                        {title: 'Signout', url: '/signout'}
                    ]
                }
            ]);

        }
    );

})(window.angular);
