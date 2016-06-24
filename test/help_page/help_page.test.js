

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

        module('pipHelp.Page');
        module(function($provide){
            $provide.service('pipAppBar', function(){
                this.showMenuNavIcon = angular.noop;
                this.showTitleText = angular.noop;
                this.showShadowSm = angular.noop;
                this.showLocalActions = angular.noop;
            });
            $provide.service('pipHelp', function() {
                this.addPage = angular.noop;
                this.setDefaultPage = angular.noop;
                this.getPages = getPages;
                this.getDefaultPage = angular.noop;
                this.$get = function () {
                    return {
                        /** @see getPages */
                        getPages: getPages
                    };
                }
                function getPages() {
                    var pages = [{
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
                    }];
                    return pages;
                }
            });
        });
    });

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

    it('init', function () {
        expect(scope.pages.length).to.equal(1);

    });


});
