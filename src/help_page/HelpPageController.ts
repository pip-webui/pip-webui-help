// Prevent junk from going into typescript definitions
import {IHelpService} from '../help_service/HelpService';
import {HelpTab} from '../help_common/HelpTab';
import {HelpPageSelectedTab} from '../help_common/HelpPageSelectedTab';

class HelpPageController {
    private _log: ng.ILogService;
    private _q: ng.IQService;
    private _state: ng.ui.IStateService;

    public tabs: HelpTab[];
    public selected: HelpPageSelectedTab;
    public onDropdownSelect: Function;

    constructor(
        $log: ng.ILogService,
        $q: ng.IQService,
        $state: ng.ui.IStateService,
        pipNavService,//: pip.nav.INavService,
        pipHelp: IHelpService,
        $rootScope: ng.IRootScopeService, 
        $timeout: angular.ITimeoutService
    ) {
        this._log = $log;
        this._q = $q;
        this._state = $state;

        this.tabs = _.filter(pipHelp.getTabs(), (tab: any) =>{
              return tab;
                /*if (tab.visible === true && (tab.access ? tab.access($rootScope.$user, tab) : true)) {
                    return tab;
                }*/
            });

        this.tabs = _.sortBy(this.tabs, 'index');

        this.selected = new HelpPageSelectedTab();
        if (this._state.current.name !== 'help') {
            this.initSelect(this._state.current.name);
        } else if (this._state.current.name === 'help' && pipHelp.getDefaultTab()) {
            this.initSelect(pipHelp.getDefaultTab().state);
        } else {
            $timeout(() => {
                if (pipHelp.getDefaultTab()) {
                    this.initSelect(pipHelp.getDefaultTab().state);
                }
                if (!pipHelp.getDefaultTab() && this.tabs && this.tabs.length > 0) {
                    this.initSelect(this.tabs[0].state);
                }
            });
        }

        pipNavService.icon.showMenu();
        pipNavService.breadcrumb.text = "Help";
        pipNavService.actions.hide();
        pipNavService.appbar.removeShadow();
        
        this.onDropdownSelect = (state) => {
            this.onNavigationSelect(state.state);
        }
    }

    private initSelect(state: string) {
        this.selected.tab = _.find(this.tabs, (tab: HelpTab) => {
            return tab.state === state;
        });
        this.selected.tabIndex = _.indexOf(this.tabs, this.selected.tab);
        this.selected.tabId = state;
    }

    public onNavigationSelect(state: string) {
        this.initSelect(state);

        if (this.selected.tab) {
            this._state.go(state);
        }
    }
}

(() => {

angular.module('pipHelp.Page', [
    'ui.router', 
    'pipHelp.Service',
    'pipNav', 
    'pipSelected',
    'pipTranslate',
    'pipHelp.Templates'
    ])
    .controller('pipHelpPageController', HelpPageController);
})();

import './HelpPageRoutes';