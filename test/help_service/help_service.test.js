'use strict';

describe('Help', function () {
    var access, page1,
        stateProvider,
        service, stateSpy,
        signoutSpy, configureAppBarSpy, initScopeSpy, beginTransactionSpy;

    beforeEach(module('pipTest.UserParty'));
    beforeEach(module('pipTest.General'));
    beforeEach(module('pipRest'));


    beforeEach(function () {
        access = angular.noop,
            page1 = {
                state: 'test',
                title: 'test help page',
                stateConfig: {
                    url: '/test',
                    template: '<h1>This is test page in help inserted through provider</h1>'
                }
            };
        
        module('pipState', function (pipAuthStateProvider) {
            stateProvider = pipAuthStateProvider;
            stateSpy = sinon.spy(stateProvider, 'state');
            //spyOn(stateProvider, 'state').and.callThrough();
            //spyOn(stateProvider, 'redirect').and.callThrough();
        });

        module('pipHelp');
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

        expect(stateSpy.called).to.exist;

        expect(service.getDefaultPage().state).to.equal('help.' + page1.state);
        expect(service.getDefaultPage().title).to.equal(page1.title);
        expect(service.getDefaultPage().stateConfig.url).to.equal(page1.stateConfig.url);
        expect(service.getDefaultPage().stateConfig.template).to.equal(page1.stateConfig.template);

        expect(function () {
            service.addPage({
                state: 'test',
                stateConfig: {}
            })
        }).to.throw(true);
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
        
        expect(stateSpy.called).to.exist;

        expect(service.getDefaultPage().state).to.equal('help.test2');

        expect(function () {
            service.setDefaultPage('abc');
        }).to.throw(true);
    })

});
