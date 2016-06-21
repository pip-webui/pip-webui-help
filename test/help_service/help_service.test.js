'use strict';

describe('Help', function () {
    var stateProvider,
        service, stateSpy;
    var signoutSpy, configureAppBarSpy, initScopeSpy, beginTransactionSpy;

    beforeEach(module('pipit.UserParty'));
    beforeEach(module('pipit.General'));
    beforeEach(module('pipRest'));


    beforeEach(function () {
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


    it('should be able to add new page and get list of added pages', function (done) {
        var access = function () {
        };

        var page1 = {
            state: 'it',
            title: 'it help page',
            stateConfig: {
                url: '/it',
                template: '<h1>This is it page in help inserted through provider</h1>'
            }
        };

        service.addPage(page1);

        service.addPage({
            state: 'it2',
            visible: false,
            access: access,
            stateConfig: {}
        });
        assert.isDefined(stateSpy.called);

        assert.equal(service.getDefaultPage().state, 'help.' + page1.state);
        assert.equal(service.getDefaultPage().title, page1.title);
        assert.equal(service.getDefaultPage().stateConfig.url, page1.stateConfig.url);
        assert.equal(service.getDefaultPage().stateConfig.template, page1.stateConfig.template);

        assert.throws( function () {
                service.addPage({
                    state: 'it',
                    stateConfig: {}
                })
            }, true);

        done();
    });

    it('should be able to add new page and get list of added pages', function (done) {
        var access = function () {
        };

        var page1 = {
            state: 'it',
            title: 'it help page',
            stateConfig: {
                url: '/it',
                template: '<h1>This is it page in help inserted through provider</h1>'
            }
        };

        service.addPage(page1);

        service.addPage({
            state: 'it2',
            visible: false,
            access: access,
            stateConfig: {}
        });

        service.setDefaultPage('it2');

        assert.isDefined(stateSpy.called);

        assert.equal(service.getDefaultPage().state, 'help.it2');

        assert.throws( function () {
            service.setDefaultPage('abc');
        }, true);

        done();
    })

});
