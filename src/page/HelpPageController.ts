// Prevent junk from going into typescript definitions
import {
    IHelpService
} from '../common/IHelpService';
import {
    HelpTab,
    HelpPageSelectedTab
} from '../common/HelpConfig';

interface IHelpPage {
    tabs: HelpTab[];
    selected: HelpPageSelectedTab;
    onDropdownSelect: Function;
    onNavigationSelect(state: string): void;
}

class HelpPageController implements IHelpPage, ng.IController {
    public tabs: HelpTab[];
    public selected: HelpPageSelectedTab;
    public onDropdownSelect: Function;

    constructor(
        private $log: ng.ILogService,
        private $state: ng.ui.IStateService,
        $rootScope: ng.IRootScopeService, 
        $timeout: angular.ITimeoutService,
        pipNavService: pip.nav.INavService,
        pipHelp: IHelpService
    ) {

        this.tabs = _.filter(pipHelp.getTabs(), (tab: HelpTab) =>{
            if (tab.visible === true) {
                    return tab;
            }
        });

        this.tabs = _.sortBy(this.tabs, 'index');

        this.selected = new HelpPageSelectedTab();
        if (this.$state.current.name !== 'help') {
            this.initSelect(this.$state.current.name);
        } else if (this.$state.current.name === 'help' && pipHelp.getDefaultTab()) {
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

    private initSelect(state: string): void {
        this.selected.tab = _.find(this.tabs, (tab: HelpTab) => {
            return tab.state === state;
        });
        this.selected.tabIndex = _.indexOf(this.tabs, this.selected.tab);
        this.selected.tabId = state;
    }

    public onNavigationSelect(state: string): void {
        this.initSelect(state);

        if (this.selected.tab) {
            this.$state.go(state);
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