'use strict';

suite('Help', function () {
    var stateProvider,
        service, stateSpy;
    var signoutSpy, configureAppBarSpy, initScopeSpy, beginTransactionSpy;

    setup(module('pipTest.UserParty'));
    setup(module('pipTest.General'));
    setup(module('pipRest'));


    setup(function () {
        module('pipState', function (pipAuthStateProvider) {
            stateProvider = pipAuthStateProvider;
            stateSpy = sinon.spy(stateProvider, 'state');
            //spyOn(stateProvider, 'state').and.callThrough();
            //spyOn(stateProvider, 'redirect').and.callThrough();
        });

        module('pipHelp');
    });

    setup(inject(function (pipHelp) {
        service = pipHelp;
    }));


    test('should be able to add new page and get list of added pages', function (done) {
        var access = function () {
        };

        var page1 = {
            state: 'test',
            title: 'Test help page',
            stateConfig: {
                url: '/test',
                template: '<h1>This is test page in help inserted through provider</h1>'
            }
        };

        service.addPage(page1);

        service.addPage({
            state: 'test2',
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
                    state: 'test',
                    stateConfig: {}
                })
            }, true);

        done();
    });

    test('should be able to add new page and get list of added pages', function (done) {
        var access = function () {
        };

        var page1 = {
            state: 'test',
            title: 'Test help page',
            stateConfig: {
                url: '/test',
                template: '<h1>This is test page in help inserted through provider</h1>'
            }
        };

        service.addPage(page1);

        service.addPage({
            state: 'test2',
            visible: false,
            access: access,
            stateConfig: {}
        });

        service.setDefaultPage('test2');

        assert.isDefined(stateSpy.called);

        assert.equal(service.getDefaultPage().state, 'help.test2');

        assert.throws( function () {
            service.setDefaultPage('abc');
        }, true);

        done();
    })

});
