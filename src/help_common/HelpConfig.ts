import {HelpTab} from "./HelpTab";

export class HelpConfig {

    public defaultTab: string;
    public tabs: HelpTab[] = [];
    public titleText: string = 'SETTINGS_TITLE';
    public titleLogo: string = null;
    public isNavIcon: boolean = true;

}
