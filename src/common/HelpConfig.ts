
export class HelpConfig {

    public defaultTab: string;
    public tabs: HelpTab[] = [];
    public titleText: string = 'SETTINGS_TITLE';
    public titleLogo: string = null;
    public isNavIcon: boolean = true;

}

export class HelpTab {

    public state: string;
    public title: string;
    public index: number;
    public access: Function;
    public visible: boolean;
    public stateConfig: HelpStateConfig;

}

export class HelpStateConfig {

    public url: string;
    public auth: boolean = false;
    public templateUrl?: string;
    public template?: string;

}


export class HelpPageSelectedTab {
    public tab: HelpTab;
    public tabIndex: number;
    public tabId: string;
}