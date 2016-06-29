describe('Help', function () {
    'use strict';

    var stateSpy, mockPipAppBar, mockPipHelp, getDefaultPageStub,
        $controller, scope, $rootScope, getPagesStub;

    beforeEach(module('pipTest.UserParty'));
    beforeEach(module('pipTest.General'));

    beforeEach(function () {
        module(function ($provide) {
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

        // define mocks
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
    }));

    describe('Current state is not \'help\'', function () {
        beforeEach(function () {
            getDefaultPageStub = sinon.stub(mockPipHelp, 'getDefaultPage').returns(null);

            $controller('pipHelpPageController', {
                $scope: scope,
                $rootScope: $rootScope,
                pipHelp: mockPipHelp,
                pipAppBar: mockPipAppBar,
                $state: {current: {name: 'not.help'}}
            });
        });

        it('should not be initialized when actual state is not \'help\'', function () {
            expect(getPagesStub.called).to.equal(true);
            expect(scope.pages.length).to.equal(1);
            expect(getDefaultPageStub.called).to.equal(false);
        });
    });

    describe('Current state is \'help\'', function () {
        beforeEach(function () {
            getDefaultPageStub = sinon.stub(mockPipHelp, 'getDefaultPage').returns({
                state: 'test',
                title: 'test help page',
                visible: true,
                access: angular.noop,
                stateConfig: {
                    url: '/test',
                    template: '<h1>This is test page in help inserted through provider</h1>'
                }
            });

            $controller('pipHelpPageController', {
                $scope: scope,
                $rootScope: $rootScope,
                pipHelp: mockPipHelp,
                pipAppBar: mockPipAppBar,
                $state: {current: {name: 'help'}, go: angular.noop}
            });
        });

        it('should be initialized when actual state is \'help\'', function () {
            expect(getPagesStub.called).to.equal(true);
            expect(scope.pages.length).to.equal(1);
            expect(getDefaultPageStub.calledOnce).to.equal(true);
        });

        describe('\'navigationSelect\' method', function () {
            it('should be able to establish chosen page by passed state name', function () {
                scope.onNavigationSelect('test');
                expect(scope.selected.page.state).to.equal('test');
                expect(scope.selected.page.stateConfig.url).to.equal('/test');
            });

            it('should clear selected page when new state is not passed', function () {
                scope.onNavigationSelect();

                expect(scope.selected.page).to.be.an('undefined');
            });
        });

        describe('\'dropdownSelect\' method', function () {
            it('should be able to establish active page by passed object with specified page', function () {
                scope.onDropdownSelect({state: 'test'});

                expect(scope.selected.page.state).to.equal('test');
                expect(scope.selected.page.stateConfig.url).to.equal('/test');
            });

            it('should clear selected page when new state is not passed', function () {
                scope.onDropdownSelect({});

                expect(scope.selected.page).to.be.an('undefined');
            });
        });
    });

});
