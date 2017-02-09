'use strict';

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
