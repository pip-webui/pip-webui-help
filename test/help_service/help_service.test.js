describe('HelpService', function () {
    'use strict';

    var access, page1,
        stateProvider,
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

    it('should be able to add new page and get list of added pages', function () {
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

        expect(function () {
            service.addPage({
                state: 'test',
                stateConfig: {}
            });
        }).to.throw(Error);
    });

    it('should be able to add new page and get list of added pages', function () {

        service.addPage(page1);

        service.addPage({
            state: 'test2',
            visible: false,
            access: access,
            stateConfig: {}
        });

        service.setDefaultPage('test2');

        expect(stateSpy.called).to.isDefined;

        expect(service.getDefaultPage().state).to.equal('help.test2');

        expect(function () {
            service.setDefaultPage('abc');
        }).to.throw(Error);
    });

    it('should be get pages after add', function () {
        var pages;

        service.addPage(page1);

        service.addPage({
            state: 'test2',
            visible: false,
            access: access,
            stateConfig: {}
        });

        pages = service.getPages();

        expect(pages.length).to.equal(2);
    });

    it('should be get errors if validation fall', function () {
        expect(function () {
            service.addPage();
        }).to.throw('Invalid object');

        expect(function () {
            service.addPage({});
        }).to.throw('Page should have valid Angular UI router state name');

        expect(function () {
            service.addPage({state:'test', access: true});
        }).to.throw('"access" should be a function');

        expect(function () {
            service.addPage({state:'test', access: angular.noop});
        }).to.throw('Invalid state configuration object');
    });

});
