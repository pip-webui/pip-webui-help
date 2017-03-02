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
    getDefaultTab(): HelpTab;
    showTitleText(newTitleText: string): string;
    showTitleLogo(newTitleLogo: string): any;
    setDefaultTab(name: string): void;
    showNavIcon(value: any): boolean;
    getTabs(): HelpTab[];
}
export interface IHelpProvider extends ng.IServiceProvider {
    getDefaultTab(): HelpTab;
    addTab(tabObj: HelpTab): void;
    setDefaultTab(name: string): void;
    getFullStateName(state: string): string;
}
export class HelpConfig {
    defaultTab: string;
    tabs: HelpTab[];
    titleText: string;
    titleLogo: string;
    isNavIcon: boolean;
}

}
