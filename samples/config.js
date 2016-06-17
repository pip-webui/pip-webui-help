/**
 * @file Global configuration for sample application
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipSampleConfig', ['pipRest.State', 'pipRest', 'pipEntry', 'pipSideNav', 
        'pipAppBar', 'pipHelp' ]);

    // Configure application services before start
    thisModule.config(
        function ($mdThemingProvider, $urlRouterProvider, pipAuthStateProvider, pipRestProvider, pipSideNavProvider, 
                  pipAppBarProvider, pipEntryProvider, $mdIconProvider, pipHelpProvider) {

            $mdIconProvider.iconSet('icons', 'images/icons.svg', 512);

            // Set global constants
            pipAppBarProvider.appTitleText('Sample Application');
            pipAppBarProvider.globalSecondaryActions([
                {name: 'global.signout', title: 'SIGNOUT', state: 'signout'}
            ]);

            // Configure REST API
            //pipRestProvider.version('1.0');
            pipRestProvider.serverUrl('http://alpha.pipservices.net');

            // Configure entry pages
            //pipEntryProvider.fixedServerUrl('http://alpha.pipservices.net');

            // Configure default states
            pipAuthStateProvider.unauthorizedState('signin');
            pipAuthStateProvider.authorizedState('help');

            $urlRouterProvider.otherwise(function ($injector, $location) {
                if ($location.$$path == '') return '/signin';
                else  return '/help';
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
                },
            ]);

            // Register custom help page
            pipHelpProvider.addPage({
                state: 'test',
                title: 'Test help page',
                auth: true,
                stateConfig: {
                    url: '/test',
                    template: '<h1>This is test page in help inserted through provider</h1>'
                }
            });

            pipHelpProvider.addPage({
                state: 'test2',
                title: 'Test2 help page',
                auth: true,
                stateConfig: {
                    url: '/test2',
                    template: '<h1>This is test2 page in help inserted through provider</h1>'
                }
            });

            pipHelpProvider.setDefaultPage('test');

        }
    );

})(window.angular);

