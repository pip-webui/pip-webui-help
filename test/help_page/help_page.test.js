

describe('Help', function () {
    var access, page1, stateSpy,  mockPipAppBar,  mockPipHelp,
        stateProvider, $controller, scope, $rootScope;

    beforeEach(module('pipTest.UserParty'));
    beforeEach(module('pipTest.General'));
    beforeEach(module('pipState'));
    beforeEach(module('pipRest'));
    beforeEach(function () {

        module('pipState', function (pipAuthStateProvider) {
            stateProvider = pipAuthStateProvider;
            stateSpy = sinon.spy(stateProvider, 'state');
        });

        module(function($provide){
            $provide.service('pipAppBar', function(){
            });
            $provide.service('pipHelp', function(){
                this.addPage = sinon.spy(stateProvider, 'state');
                this.setDefaultPage = angular.noop;
                this.getPages = angular.noop;
                this.getDefaultPage = angular.noop;

                this.$get = function () {
                    return {
                        getPages: function(){ console.log('a')},
                        getDefaultPage: angular.noop,
                        addPage: angular.noop,
                        setDefaultPage: angular.noop
                    };
                };
            });
        });
    });

    beforeEach(module('pipHelp'));

    beforeEach(inject(function () {
        this.timeout(3000);
    }));
    beforeEach(inject(function (_$controller_, pipAppBar, pipHelp, _$rootScope_) {
        $controller = _$controller_;
        mockPipAppBar = pipAppBar;
        mockPipHelp = pipHelp;
        $rootScope = _$rootScope_;
    }));

    beforeEach(function(){
        scope = {};
        $controller('pipHelpPageController', {
            $scope: scope,
            $rootScope: $rootScope,
            pipHelp: mockPipHelp,
            pipAppBar: mockPipAppBar,
            $state: {current:{name: 'help1'}}
        });
    });
    it.only('init', function () {

    });


});
