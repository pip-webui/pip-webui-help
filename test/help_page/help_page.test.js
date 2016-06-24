

describe('Help', function () {
    var access, page1, stateSpy,  mockPipAppBar,  mockPipHelp,
        stateProvider, $controller, scope, $rootScope, getPagesStub;

    beforeEach(module('pipTest.UserParty'));
    beforeEach(module('pipTest.General'));

    beforeEach(function () {
        module(function($provide){
            stateSpy = sinon.spy();

            $provide.provider('pipAuthState', function () {
                this.state = stateSpy;
                this.redirect = angular.noop;

                this.$get = {};
            });

            $provide.provider('pipState', function () {
                this.state = angular.noop;
                this.$get = {};
            });

            $provide.service('pipAppBar', angular.noop);
            $provide.service('pipSelected', angular.noop);
        });
        module('pipHelp');
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
