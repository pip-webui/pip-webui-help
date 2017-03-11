/**
 * @file Global configuration for sample application
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipSampleConfig', [ 'pipSideNav',
        'pipAppBar', 'pipHelp', 'pipHelpConfig']);

    // Configure application services before start
    thisModule.config(
        function ($mdThemingProvider, $urlRouterProvider, pipSideNavProvider,
                  pipAppBarProvider, $mdIconProvider) {

            var links = [
                { title: 'Basic controls', href: '/pip-webui-controls/index.html'},
                { title: 'Composite controls', href: '/pip-webui-composite/index.html'},
                { title: 'Core', href: '/pip-webui-core/index.html'},
                { title: 'CSS components', href: '/pip-webui-css/index.html'},
                { title: 'Document controls', href: '/pip-webui-documents/index.html'},
                { title: 'Entry pages', href: '/pip-webui-entry/index.html'},
                { title: 'Error handling', href: '/pip-webui-errors/index.html'},
                { title: 'Guidance components', href: '/pip-webui-guidance/index.html'},
                { title: 'Layouts', href: '/pip-webui-layouts/index.html'},
                { title: 'Location Controls', href: '/pip-webui-locations/index.html'},
                { title: 'Navigation controls', href: '/pip-webui-nav/index.html'},
                { title: 'Picture controls', href: '/pip-webui-pictures/index.html'},
                { title: 'REST API', href: '/pip-webui-rest/index.html'},
                { title: 'Settings components', href: '/pip-webui-settings/index.html'},
                { title: 'Support components', href: '/pip-webui-support/index.html'},
                { title: 'Test Framework', href: '/pip-webui-test/index.html'}
            ];

            $mdIconProvider.iconSet('icons', 'images/icons.svg', 512);
            
            pipAppBarProvider.parts = {icon: true, title: 'breadcrumb', actions: 'primary', menu: true };

            // Set global constants
            //pipAppBarProvider.appTitleText('Sample Application');
            // pipAppBarProvider.globalSecondaryActions([
            //     {name: 'global.signout', title: 'Signout', state: 'signout'}
            // ]);

            // Configure REST API
            //pipRestProvider.serverUrl('http://alpha.pipservices.net');

            // Configure entry pages

            // Configure default states
            //pipAuthStateProvider.unauthorizedState('help');
            //pipAuthStateProvider.authorizedState('help');

            $urlRouterProvider.otherwise('/help/test1');

            // Configure navigation menu
            /*pipSideNavProvider.sections([
                {
                    links: [{title: 'Help', url: '/help'}]
                }/*, Links only for publishing samples
                {
                    links: links
                }/*,
                {
                    links: [{title: 'Signout', url: '/signout'}]
                }
            ]);*/

        }
    );

})(window.angular);
