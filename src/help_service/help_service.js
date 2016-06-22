/**
 * @file Service for help components
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';

    /**
     * @ngdoc service
     * @name pipHelp.Service.pipHelp
     *
     * @description
     * This service is provided an interface to manage the Help component.
     * It is available on the config and run application phases. On the both phases the interface is the same.
     * This module requires the 'pipState' module.
     *
     * @requires pipState
     */
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

                /**
                 * This method build the full name of state within the abstract 'help' state
                 */
                function getFullStateName(state) {
                    return 'help.' + state;
                }

                /**
                 * @ngdoc method
                 * @name pipHelp.Service.pipHelp#getPages
                 * @methodOf pipHelp.Service.pipHelp
                 *
                 * @description
                 * This method returns asset of all pages registered in the Help component.
                 *
                 * @returns {Array<Object>} List of registered states
                 *
                 * @example
                 * <pre>
                 * pipHelpProvider.getPages();
                 * </pre>
                 */
                function getPages() {
                    return _.clone(pages, true);
                }

                /**
                 * @ngdoc method
                 * @name pipHelp.Service.pipHelp#getDefaultPage
                 * @methodOf pipHelp.Service.pipHelp
                 *
                 * @description
                 * This method return name of the default state.
                 *
                 * @returns {string} Name of the state
                 *
                 * @example
                 * <pre>
                 * pipHelpProvider.getDefaultPage();
                 * </pre>
                 */
                function getDefaultPage() {
                    return _.clone(_.find(pages, function (page) {
                        return page.state === defaultPage;
                    }), true);
                }

                /**
                 * @ngdoc method
                 * @name pipHelp.Service.pipHelp#addPage
                 * @methodOf pipHelp.Service.pipHelp
                 *
                 * @description
                 * This method allows add new page into navigation menu. It accepts config object to define new state
                 * with needed params.
                 *
                 * @param {Object} pageObj Configuration object contains settings for another page
                 * @param {Object.<string>} pageObj.state   Name of page state which is available via UI router
                 * @param {Object.<string>} pageObj.title   Page title in the navigation menu.
                 * @param {Object.<boolean>} pageObj.access If it is true it will be available only for logged in users
                 * @param {Object.<boolean>} pageObj.visible If it is true the page will be visible
                 * @param {Object.<Object>} pageObj.stateConfig  Configuration object in format like UI Router state
                 *
                 * @example
                 * <pre>
                 *  pipHelpProvider.addPage({
                 *      state: 'test',
                 *      title: 'Test help page',
                 *      auth: true,
                 *      stateConfig: {
                 *          url: '/test',
                 *          templateUrl: 'help/help_test1.html'
                 *      }
                 *  });
                 * </pre>
                 */
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

                /**
                 * @ngdoc method
                 * @name pipHelp.Service.pipHelp#setDefaultPage
                 * @methodOf pipHelp.Service.pipHelp
                 *
                 * @description
                 * This method establishes passed state as default which is redirected at after transfer on abstract
                 * state
                 *
                 * @param {Object} name     Name of the state
                 *
                 * @example
                 * <pre>
                 * pipHelpProvider.setDefaultPage('test');
                 * </pre>
                 */
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

                /**
                 * This method validates passed state.
                 * If it is incorrect it will throw an error.
                 */
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
