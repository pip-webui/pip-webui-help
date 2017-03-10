{
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