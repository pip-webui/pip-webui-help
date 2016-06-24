

describe('Help', function () {
    var access, page1, stateSpy,  mockPipAppBar,  mockPipHelp,
        stateProvider, $controller, scope, $rootScope, getPagesStub;

    beforeEach(module('pipTest.UserParty'));
    beforeEach(module('pipTest.General'));
    beforeEach(module('pipState'));
    beforeEach(module('pipRest'));
    beforeEach(function () {

        module('pipState', function (pipAuthStateProvider) {
            stateProvider = pipAuthStateProvider;
            stateSpy = sinon.spy(stateProvider, 'state');
        });

        module('pipHelp');
        module(function($provide){
            $provide.service('pipAppBar', function(){
                this.showMenuNavIcon = angular.noop;
                this.showTitleText = angular.noop;
                this.showShadowSm = angular.noop;
                this.showLocalActions = angular.noop;
            });

        });
    });

    beforeEach(inject(function (_$controller_, pipAppBar, pipHelp, _$rootScope_) {
        $controller = _$controller_;
        mockPipAppBar = pipAppBar;
        mockPipHelp = pipHelp;
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
    }));

    beforeEach(function(){
        getPagesStub = sinon.stub(mockPipHelp, 'getPages').returns([{
            state: 'test',
            title: 'test help page',
            visible: true,
            access: angular.noop,
            stateConfig: {
                url: '/test',
                template: '<h1>This is test page in help inserted through provider</h1>'
            }
        }, {
            state: 'tes2',
            title: 'test2 help page',
            access: angular.noop,
            stateConfig: {
                url: '/test2',
                template: '<h1>This is test page in help inserted through provider</h1>'
            }
        }]);

        $controller('pipHelpPageController', {
            $scope: scope,
            $rootScope: $rootScope,
            pipHelp: mockPipHelp,
            pipAppBar: mockPipAppBar,
            $state: {current:{name: 'help1'}}
        });
    });

    it('init', function () {
        expect(getPagesStub.called).to.equal(true);
        expect(scope.pages.length).to.equal(1);

    });


});
