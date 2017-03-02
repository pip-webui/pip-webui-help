import {HelpTab} from "../help_common/HelpTab";
import {HelpConfig} from "../help_common/HelpConfig";
import {HelpService} from "../help_service/HelpService";

export interface IHelpProvider extends ng.IServiceProvider {
    getDefaultTab(): HelpTab;
    addTab(tabObj: HelpTab): void;
    setDefaultTab(name: string): void;
    getFullStateName(state: string): string;
}

class HelpProvider implements IHelpProvider {
    private _service: HelpService;
    private _config: HelpConfig = new HelpConfig();

    constructor( private $stateProvider: ng.ui.IStateProvider) {}

    public getFullStateName(state: string): string {
        return 'help.' + state;
    }

    public getDefaultTab(): HelpTab {
        let defaultTab: HelpTab;

        defaultTab = _.find(this._config.tabs, (p) => {
            return p.state === this._config.defaultTab;
        });

        return _.cloneDeep(defaultTab);
    }

    public addTab(tabObj: HelpTab): void {
        let existingTab: HelpTab;
        this.validateTab(tabObj);
        existingTab = _.find(this._config.tabs, (p) => {
            return p.state === 'help.' + tabObj.state;
        });
        if (existingTab) {
            throw new Error('Tab with state name "' + tabObj.state + '" is already registered');
        }

        this._config.tabs.push({
            state: this.getFullStateName(tabObj.state),
            title: tabObj.title,
            index: tabObj.index || 100000,
            access: tabObj.access,
            visible: tabObj.visible !== false,
            stateConfig: _.cloneDeep(tabObj.stateConfig)
        });
        this.$stateProvider.state(this.getFullStateName(tabObj.state), tabObj.stateConfig);

        // if we just added first state and no default state is specified
        if (typeof _.isUndefined(this._config.defaultTab) && this._config.tabs.length === 1) {
            this.setDefaultTab(tabObj.state);
        }
    }

    public setDefaultTab(name: string): void {
        // TODO [apidhirnyi] extract expression inside 'if' into variable. It isn't readable now.
        if (!_.find(this._config.tabs, (tab: HelpTab) => {
            return tab.state === 'help.' + name;
        })) {
            throw new Error('Tab with state name "' + name + '" is not registered');
        }

        this._config.defaultTab = this.getFullStateName(name);
        //this.$stateProvider.go(this._config.defaultTab);
            //pipAuthStateProvider.redirect('help', getFullStateName(name));
    }

    /**
     * Validates passed tab config object
     * If passed tab is not valid it will throw an error
     */

    private validateTab(tabObj: HelpTab) {
        if (!tabObj || !_.isObject(tabObj)) {
            throw new Error('Invalid object');
        }

        if (tabObj.state === null || tabObj.state === '') {
            throw new Error('Tab should have valid Angular UI router state name');
        }

        if (tabObj.access && !_.isFunction(tabObj.access)) {
            throw new Error('"access" should be a function');
        }

        if (!tabObj.stateConfig || !_.isObject(tabObj.stateConfig)) {
            throw new Error('Invalid state configuration object');
        }
    }

    public showTitleText (newTitleText: string): string {
        if (newTitleText) {
            this._config.titleText = newTitleText;
            this._config.titleLogo = null;
        }

        return this._config.titleText;
    }

    public showTitleLogo(newTitleLogo: string): string {
        if (newTitleLogo) {
            this._config.titleLogo = newTitleLogo;
            this._config.titleText = null;
        }

        return this._config.titleLogo;
    }

    public showNavIcon(value: boolean): boolean {
        if (!_.isNull(value) && !_.isUndefined(value)) {
            this._config.isNavIcon = !!value;
        }

        return this._config.isNavIcon;
    }

    public $get() {
        "ngInject";

        if (_.isNull(this._service) || _.isUndefined(this._service)) {
            this._service = new HelpService(this._config);
        }
        
        return this._service;
    }
}


angular
    .module('pipHelp.Service', [])
    .provider('pipHelp', HelpProvider);