describe('HelpService', function () {
    'use strict';

    var access, page1,
        service, stateSpy;

    beforeEach(module('pipTest.UserParty'));
    beforeEach(module('pipTest.General'));

    beforeEach(module(function ($provide) {
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
    }));

    beforeEach(module('pipState'));
    beforeEach(module('pipHelp'));

    beforeEach(function () {
        access = angular.noop;
        page1 = {
            state: 'test',
            title: 'test help page',
            stateConfig: {
                url: '/test',
                template: '<h1>This is test page in help inserted7 through provider</h1>'
            }
        };
    });

    beforeEach(inject(function (pipHelp) {
        service = pipHelp;
    }));

    describe('"addPages" method', function () {
        it('should be able to add new page and get list of added pages', function () {
            service.addPage(page1);

            service.addPage({
                state: 'test2',
                visible: false,
                access: access,
                stateConfig: {}
            });

            expect(function () {
                service.addPage({
                    state: 'test',
                    stateConfig: {}
                });
            }).to.throw(Error);
        });
    });

    describe('"getDefaultPages/setDefaultPages" methods', function () {
        it('default state', function () {

            service.addPage(page1);

            service.addPage({
                state: 'test2',
                visible: false,
                access: access,
                stateConfig: {}
            });

            expect(service.getDefaultPage().state).to.equal('help.' + page1.state);
            expect(service.getDefaultPage().title).to.equal(page1.title);
            expect(service.getDefaultPage().stateConfig.url).to.equal(page1.stateConfig.url);
            expect(service.getDefaultPage().stateConfig.template).to.equal(page1.stateConfig.template);

            service.setDefaultPage('test2');

            expect(stateSpy.called).to.not.be.an('undefined');

            expect(service.getDefaultPage().state).to.equal('help.test2');

            expect(function () {
                service.setDefaultPage('abc');
            }).to.throw(Error);
        });
    });

    describe('"getPages" method', function () {
        it('should be able to add new page', function () {
            service.addPage(page1);
            service.addPage({
                state: 'test2',
                visible: false,
                access: access,
                stateConfig: {}
            });

            expect(service.getPages().length).to.equal(2);
        });

        it('should not have any predefined pages', function () {
            expect(service.getPages().length).to.equal(0);
        });
    });

    describe('"validatePage" method', function () {
        it('should throw an error when passed \'undefined\'', function () {
            expect(function () {
                service.addPage();
            }).to.throw('Invalid object');
        });

        it('should throw an errors when passed config object doesn\'t have state name' , function () {
            expect(function () {
                service.addPage({});
            }).to.throw('Page should have valid Angular UI router state name');
        });

        it('should throw an error when "access" field is not a function', function () {
            expect(function () {
                service.addPage({state: 'test', access: true});
            }).to.throw('"access" should be a function');
        });

        it('should throw an error when config object is invalid', function () {
            expect(function () {
                service.addPage({state: 'test', access: angular.noop});
            }).to.throw('Invalid state configuration object');
        });
    });

});
