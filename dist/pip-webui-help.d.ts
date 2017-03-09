declare module pip.help {


export class HelpConfig {
    defaultTab: string;
    tabs: HelpTab[];
    titleText: string;
    titleLogo: string;
    isNavIcon: boolean;
}

export class HelpPageSelectedTab {
    tab: HelpTab;
    tabIndex: number;
    tabId: string;
}

export class HelpStateConfig {
    url: string;
    auth: boolean;
    templateUrl?: string;
    template?: string;
}

export class HelpTab {
    state: string;
    title: string;
    index: number;
    access: Function;
    visible: boolean;
    stateConfig: HelpStateConfig;
}



export interface IHelpProvider extends ng.IServiceProvider {
    getDefaultTab(): HelpTab;
    addTab(tabObj: HelpTab): void;
    setDefaultTab(name: string): void;
    getFullStateName(state: string): string;
}

export interface IHelpService {
    getDefaultTab(): HelpTab;
    showTitleText(newTitleText: string): string;
    showTitleLogo(newTitleLogo: string): any;
    setDefaultTab(name: string): void;
    showNavIcon(value: boolean): boolean;
    getTabs(): HelpTab[];
}
export class HelpService implements IHelpService {
    private _config;
    constructor(_config: HelpConfig);
    private getFullStateName(state);
    setDefaultTab(name: string): void;
    getDefaultTab(): HelpTab;
    showTitleText(newTitleText: string): string;
    showTitleLogo(newTitleLogo: string): string;
    showNavIcon(value: boolean): boolean;
    getTabs(): HelpTab[];
}

}
