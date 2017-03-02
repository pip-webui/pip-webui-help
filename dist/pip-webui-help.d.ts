declare module pip.help {


export class HelpPageSelectedTab {
    tab: HelpTab;
    tabIndex: number;
    tabId: string;
}

function configureHelpPageRoutes($stateProvider: any): void;

export class HelpTab {
    state: string;
    title: string;
    index: number;
    access: boolean;
    visible: boolean;
    stateConfig: any;
}
export interface IHelpService {
    getDefaultTab(): any;
    showTitleText(newTitleText: any): any;
    showTitleLogo(newTitleLogo: any): any;
    setDefaultTab(name: string): any;
    showNavIcon(value: any): any;
    getTabs(): any;
}
export interface IHelpProvider extends ng.IServiceProvider {
    getDefaultTab(): HelpTab;
    addTab(tabObj: HelpTab): any;
    setDefaultTab(name: string): void;
    getFullStateName(state: string): string;
}
export class HelpConfig {
    defaultTab: string;
    tabs: HelpTab[];
    titleText: string;
    titleLogo: boolean;
    isNavIcon: boolean;
}

}
