/**
 * @file Service for help components
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name pipHelp.Service.pipHelp
     *
     * @description
     * This service is provided an interface to manage the Help component.
     * It is available on the config and run application phases. On the both phases the interface is the same.
     * This module requires the '$state' module.
     */
    angular.module('pipHelp.Service', ['ui.router'])
        .provider('pipHelp',
            function ($stateProvider): any {
                var defaultTab,
                    tabs = [];

                /** @see addTab */
                this.addTab = addTab;

                /** @see setDefaultTab */
                this.setDefaultTab = setDefaultTab;

                /** @see getTabs */
                this.getTabs = getTabs;

                /** @see getDefaultTab */
                this.getDefaultTab = getDefaultTab;

                this.$get = function () {
                    return {
                        /** @see getTabs */
                        getTabs: getTabs,

                        /** @see getDefaultTab */
                        getDefaultTab: getDefaultTab,

                        /** @see addTab */
                        addTab: addTab,

                        /** @see setDefaultTab */
                        setDefaultTab: setDefaultTab
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
                 * @name pipHelp.Service.pipHelp#getTabs
                 * @methodOf pipHelp.Service.pipHelp
                 *
                 * @description
                 * This method returns asset of all tabs registered in the Help component.
                 *
                 * {@link https://github.com/pip-webui/pip-webui-help/blob/master/src/help_service/help_service.js#L79 View source}
                 *
                 * @returns {Array<Object>} List of registered states
                 *
                 * @example
                 * <pre>
                 * // on the config phase
                 * pipHelpProvider.getTabs();
                 * </pre>
                 */
                function getTabs() {
                    return _.cloneDeep(tabs);
                }

                /**
                 * @ngdoc method
                 * @name pipHelp.Service.pipHelp#getDefaultTab
                 * @methodOf pipHelp.Service.pipHelp
                 *
                 * @description
                 * This method return name of the default state.
                 *
                 * {@link https://github.com/pip-webui/pip-webui-help/blob/master/src/help_service/help_service.js#L101 View source}
                 *
                 * @returns {string} Name of the state
                 *
                 * @example
                 * <pre>
                 * // on the config phase
                 * pipHelpProvider.getDefaultTab();
                 * </pre>
                 */
                function getDefaultTab() {
                    return _.cloneDeep(_.find(tabs, function (tab) {
                        return tab.state === defaultTab;
                    }));
                }

                /**
                 * @ngdoc method
                 * @name pipHelp.Service.pipHelp#addTab
                 * @methodOf pipHelp.Service.pipHelp
                 *
                 * @description
                 * This method allows add new tab into navigation menu. It accepts config object to define new state
                 * with needed params.
                 *
                 * {@link https://github.com/pip-webui/pip-webui-help/blob/master/src/help_service/help_service.js#L139 View source}
                 *
                 * @param {Object} tabObj Configuration object contains settings for another tab
                 * @param {Object.<string>} tabObj.state   Name of tab state which is available via UI router
                 * @param {Object.<string>} tabObj.title   Tab title in the navigation menu.
                 * @param {Object.<boolean>} tabObj.access If it is true it will be available only for logged in users
                 * @param {Object.<boolean>} tabObj.visible If it is true the tab will be visible
                 * @param {Object.<Object>} tabObj.stateConfig  Configuration object in format like UI Router state
                 *
                 * @example
                 * <pre>
                 *  // on the config phase
                 *  pipHelpProvider.addTab({
                 *      state: 'test',
                 *      title: 'Test help tab',
                 *      auth: true,
                 *      stateConfig: {
                 *          url: '/test',
                 *          templateUrl: 'help/help_test1.html'
                 *      }
                 *  });
                 * </pre>
                 */
                function addTab(tabObj) {
                    var tab;

                    validateTab(tabObj);

                    tab = _.find(tabs, function (tab) {
                        return tab.state === getFullStateName(tabObj.state);
                    });
                    if (tab) {
                        throw new Error('Tab with state name "' + tabObj.state + '" is already registered');
                    }

                    tabs.push({
                        state: getFullStateName(tabObj.state),
                        title: tabObj.title,
                        access: tabObj.access || angular.noop,
                        visible: tabObj.visible || true,
                        stateConfig: _.cloneDeep(tabObj.stateConfig)
                    });

                    $stateProvider.state(getFullStateName(tabObj.state), tabObj.stateConfig);

                    // if we just added first state and no default state is specified
                    if (_.isUndefined(defaultTab) && tabs.length === 1) {
                        setDefaultTab(tabObj.state);
                    }
                }

                /**
                 * @ngdoc method
                 * @name pipHelp.Service.pipHelp#setDefaultTab
                 * @methodOf pipHelp.Service.pipHelp
                 *
                 * @description
                 * This method establishes passed state as default which is redirected at after transfer on abstract
                 * state
                 *
                 * {@link https://github.com/pip-webui/pip-webui-help/blob/master/src/help_service/help_service.js#L185 View source}
                 *
                 * @param {Object} name     Name of the state
                 *
                 * @example
                 * <pre>
                 * pipHelpProvider.setDefaultTab('test');
                 * </pre>
                 */
                function setDefaultTab(name) {
                    var tab, error;

                    tab = _.find(tabs, function (tab) {
                        return tab.state === getFullStateName(name);
                    });
                    if (!tab) {
                        error = new Error('Tab with state name "' + name + '" is not registered');
                        throw error;
                    }

                    defaultTab = getFullStateName(name);

                    $stateProvider.redirect('help', getFullStateName(name));
                }

                /**
                 * This method validates passed state.
                 * If it is incorrect it will throw an error.
                 */
                function validateTab(tabObj) {
                    if (!tabObj || !_.isObject(tabObj)) {
                        throw new Error('Invalid object');
                    }

                    if (!tabObj.state || tabObj.state === '') {
                        throw new Error('Tab should have valid Angular UI router state name');
                    }

                    if (tabObj.access && !_.isFunction(tabObj.access)) {
                        throw new Error('"access" should be a function');
                    }

                    if (!tabObj.stateConfig || !_.isObject(tabObj.stateConfig)) {
                        throw new Error('Invalid state configuration object');
                    }
                }
            });

})();
