/**
 * * @file Service for help components
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';

    angular.module('pipHelp.Service', ['pipState'])
        .provider('pipHelp',
            function (pipAuthStateProvider) {
                var defaultPage,
                    pages = [];

                /** @see addPage */
                this.addPage = addPage;

                /** @see setDefaultPage */
                this.setDefaultPage = setDefaultPage;

                /** @see getPages */
                this.getPages = getPages;

                /** @see getDefaultPage */
                this.getDefaultPage = getDefaultPage;

                this.$get = function () {
                    return {
                        /** @see getPages */
                        getPages: getPages,

                        /** @see getDefaultPage */
                        getDefaultPage: getDefaultPage,

                        /** @see addPage */
                        addPage: addPage,

                        /** @see setDefaultPage */
                        setDefaultPage: setDefaultPage
                    };
                };

                function getFullStateName(state) {
                    return 'help.' + state;
                }

                function getPages() {
                    return _.clone(pages, true);
                }

                function getDefaultPage() {
                    return _.clone(_.find(pages, function (page) {
                        return page.state === defaultPage;
                    }), true);
                }

                function addPage(pageObj) {
                    var page;

                    validatePage(pageObj);

                    page = _.find(pages, function (page) {
                        return page.state === getFullStateName(pageObj.state);
                    });
                    if (page) {
                        throw new Error('Page with state name "' + pageObj.state + '" is already registered');
                    }

                    pages.push({
                        state: getFullStateName(pageObj.state),
                        title: pageObj.title,
                        access: pageObj.access || angular.noop,
                        visible: pageObj.visible || true,
                        stateConfig: _.clone(pageObj.stateConfig, true)
                    });

                    pipAuthStateProvider.state(getFullStateName(pageObj.state), pageObj.stateConfig);

                    // if we just added first state and no default state is specified
                    if (_.isUndefined(defaultPage) && pages.length === 1) {
                        setDefaultPage(pageObj.state);
                    }
                }

                function setDefaultPage(name) {
                    var page, error;

                    page = _.find(pages, function (page) {
                        return page.state === getFullStateName(name);
                    });
                    if (!page) {
                        error = new Error('Page with state name "' + name + '" is not registered');
                        throw error;
                    }

                    defaultPage = getFullStateName(name);

                    pipAuthStateProvider.redirect('help', getFullStateName(name));
                }

                function validatePage(pageObj) {
                    if (!pageObj || !_.isObject(pageObj)) {
                        throw new Error('Invalid object');
                    }

                    if (!pageObj.state || pageObj.state === '') {
                        throw new Error('Page should have valid Angular UI router state name');
                    }

                    if (pageObj.access && !_.isFunction(pageObj.access)) {
                        throw new Error('"access" should be a function');
                    }

                    if (!pageObj.stateConfig || !_.isObject(pageObj.stateConfig)) {
                        throw new Error('Invalid state configuration object');
                    }
                }
            });

})(window.angular, window._);
