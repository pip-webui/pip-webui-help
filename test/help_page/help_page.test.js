'use strict';

describe('pipHelp.Page', function () {
    var controller;

    beforeEach(module('pipTest.UserParty'));
    beforeEach(module('pipTest.General'));
    beforeEach(module('pipState'));
    beforeEach(module('pipRest'));
    beforeEach(module('pipHelp'));
    beforeEach(inject(function ($controller, $rootScope, pipHelp, _$state_, pipAppBar) {
        controller = $controller('pipHelpPageController', {
            $rootScope: $rootScope,
            $scope: $rootScope.$new(),
            $state: _$state_,
            pipAppBar: pipAppBar,
            pipHelp: pipHelp
        });

    }));

    it('initialization', function () {
        angular.noop();

    });
});
